import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import gsap from "gsap";
import { productsWithData } from "./productsData";
import { useProjectStore } from "./useProjectStore";
import { REVISION } from "three"

/**
 * Props:
 *  - sectionEl: ref to the <section> DOM node (sticky viewport parent)
 */
export default function WorkScene({ sectionEl }) {
  const { gl, scene, camera } = useThree();

  // Post FX
  const composerRef = useRef(null);
  const bokehRef = useRef(null);

  // Controls / focus
  const controlsRef = useRef(null);

  // Product targets
  const productTargetsRef = useRef([]);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  // Scroll hysteresis
  const wheelAccRef = useRef(0);
  const wheelCooldownRef = useRef(false);
  const THRESH = 80;
  const COOLDOWN_MS = 350;

  // Edge dwell (time you must spend on first/last before exit is allowed)
  const ARRIVAL_DWELL_MS = 800;
  const arrivedAtRef = useRef(performance.now());

  // Sticky pin state
  const isHijackActiveRef = useRef(false);

  // Exit guard
  const exitingRef = useRef(false);

  // Parallax
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const baseCamRef = useRef(camera.position.clone());
  const parallaxGroupRef = useRef(new THREE.Group());

  // Store for overlay
  const setProjects = useProjectStore((s) => s.setProjects);
  const setCurrentIndex = useProjectStore((s) => s.setCurrentTargetIndex);

  // Scene background/fog so DoF is visible
  useEffect(() => {
    const bg = new THREE.Color(0x0b0b0b);
    const fogColor = 0x111111
    scene.background = bg;
    scene.fog = new THREE.Fog(fogColor, 20, 100);
    scene.add(parallaxGroupRef.current);
    return () => {
      scene.remove(parallaxGroupRef.current);
    };
  }, [scene]);

  // Load GLTF + DRACO
  useEffect(() => {
    const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`
    const ktx2Loader = new KTX2Loader()
      .setTranscoderPath(`${THREE_PATH}/examples/jsm/libs/basis/`)
      .detectSupport(gl);
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(draco);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      "/assets/models/final.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(5, 5, 5);

        const names = productsWithData.map((p) => p.name);
        const found = [];

        model.traverse((child) => {
          if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if(child.material)
              {
                  const mats = Array.isArray(child.material) ? child.material : [child.material];
                  mats.forEach(mat => {
                      // If the material uses a baked color map
                      if (mat.map) {
                        mat.map.colorSpace = THREE.SRGBColorSpace;                    // correct color space
                        mat.map.minFilter = THREE.LinearMipmapLinearFilter;       // good min filter
                        mat.map.magFilter = THREE.LinearFilter;                   // smooth magnification
                        mat.map.anisotropy = gl.capabilities.getMaxAnisotropy(); // crisp at oblique angles
                        mat.map.needsUpdate = true;
                      }
                      // If you have emissiveMap / aoMap / etc handle similarly
                      if (mat.emissiveMap) { mat.emissiveMap.encoding = THREE.sRGBEncoding; mat.emissiveMap.anisotropy = gl.capabilities.getMaxAnisotropy(); mat.emissiveMap.needsUpdate = true; }
                      mat.needsUpdate = true;
                  });
              }
          }
          if (names.includes(child.name)) {
            const meta = productsWithData[names.indexOf(child.name)];
            found.push({
              object: child,
              targetOffset: new THREE.Vector3(...meta.targetOffset),
              cameraPosition: new THREE.Vector3(...meta.cameraPosition),
              category: meta.category,
              title: meta.title,
              description: meta.description,
              link: meta.link,
              name: meta.name,
            });
          }
        });

        found.sort((a, b) => names.indexOf(a.object.name) - names.indexOf(b.object.name));
        productTargetsRef.current = found;
        setProjects(found);
        

        parallaxGroupRef.current.add(model);
        parallaxGroupRef.current.position.set(0, 0, 0);

        if (found.length > 0) {
          focusCameraOnIndex(0, 0); // instant on first item
        } else {
          console.warn("No product nodes found. Check node names in GLTF.");
        }
      },
      undefined,
      (e) => console.error("GLTF load error:", e)
    );

    return () => {
      draco.dispose?.();
      ktx2Loader.dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);

  // Composer
  useEffect(() => {
    const composer = new EffectComposer(gl);
    const SCALE = 1; // 0.7–0.85 is a sweet spot
    composer.setSize(gl.domElement.width * SCALE, gl.domElement.height * SCALE);

    composer.addPass(new RenderPass(scene, camera));

    const bokeh = new BokehPass(scene, camera, {
      focus: 60,
      aperture: 0.0005,
      maxblur: 0.009,
      width: gl.domElement.width,
      height: gl.domElement.height,
    });
    composer.addPass(bokeh);
    bokehRef.current = bokeh;

    composer.addPass(
      new SMAAPass(
        gl.domElement.width * gl.getPixelRatio(),
        gl.domElement.height * gl.getPixelRatio()
      )
    );
    composer.addPass(new OutputPass());

    composerRef.current = composer;

    const onResize = () => {
      const w = gl.domElement.width * SCALE;
      const h = gl.domElement.height * SCALE;
      try {
        composerRef.current?.setSize(w, h);
        if (bokehRef.current) {
          bokehRef.current.uniforms.width.value = w;
          bokehRef.current.uniforms.height.value = h;
        }
      } catch {}
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      try {
        composer.dispose();
      } catch {}
      composerRef.current = null;
    };
  }, [gl, scene, camera]);

  /** Sticky viewport hijack: ON only while the section is pinned */
  useEffect(() => {
    const el = sectionEl?.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinned = rect.top <= 0 && rect.bottom >= vh;
      isHijackActiveRef.current = pinned;
      if (!pinned) {
        wheelAccRef.current = 0; // reset when leaving
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionEl]);

  /** Pointer -> NDC mouse for parallax */
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /** --- Precise single-step exit from sticky section --- */
  function exitSection(dir = 1) {
    if (exitingRef.current) return;
    const el = sectionEl?.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;

    let delta = 0;
    if (dir > 0) {
      // push bottom just past viewport bottom
      delta = Math.max(1, rect.bottom - vh + 1);
    } else {
      // pull top just past viewport top
      delta = Math.min(-1, rect.top - 1);
    }

    exitingRef.current = true;
    wheelAccRef.current = 0;
    wheelCooldownRef.current = true;

    window.scrollBy({ top: delta, behavior: "smooth" });

    // give the browser some time to cross the threshold and release the pin
    setTimeout(() => {
      exitingRef.current = false;
      wheelCooldownRef.current = false;
    }, 600);
  }

  /** Wheel with hysteresis; edge dwell logic */
  useEffect(() => {
    const onWheel = (e) => {
      const targets = productTargetsRef.current;
      if (!targets?.length) return;

      // If not pinned or we're already exiting -> let page scroll
      if (!isHijackActiveRef.current || exitingRef.current) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const atFirst = currentIndexRef.current === 0;
      const atLast = currentIndexRef.current === targets.length - 1;

      // --- EDGE DWELL ---
      if ((atFirst && dir === -1) || (atLast && dir === 1)) {
        const elapsed = performance.now() - arrivedAtRef.current;
        if (elapsed < ARRIVAL_DWELL_MS) {
          // Still dwelling: keep user on the product; block page scroll.
          e.preventDefault();
          return;
        }
        // Dwell satisfied: release to next/prev section in one gesture.
        exitSection(dir);
        return;
      }

      // Inside the section: handle product stepping
      e.preventDefault();

      if (isAnimatingRef.current || wheelCooldownRef.current) return;

      wheelAccRef.current += e.deltaY;

      if (Math.abs(wheelAccRef.current) >= THRESH) {
        const step = wheelAccRef.current > 0 ? 1 : -1;
        wheelAccRef.current = 0;

        const next = THREE.MathUtils.clamp(
          currentIndexRef.current + step,
          0,
          targets.length - 1
        );

        if (next !== currentIndexRef.current) {
          currentIndexRef.current = next;
          focusCameraOnIndex(currentIndexRef.current, 1.2);

          wheelCooldownRef.current = true;
          setTimeout(() => {
            wheelCooldownRef.current = false;
          }, COOLDOWN_MS);
        }
      }
    };

    // Listen on window so you never need to click to focus the canvas
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  /** Render */
  useFrame((_, delta) => {
    // only apply parallax rotation while not animating focus
  if (!isAnimatingRef.current) {
    // FIXED: This is the new, subtle camera orbit logic.
      // We no longer rotate any objects. We only shift the camera's position slightly.
      
      const parallaxFactor = 2.0; // Controls the strength of the effect. Lower is more subtle.
      
      // Calculate the target position based on the camera's base position plus a mouse offset
      const targetX = baseCamRef.current.x + mouseRef.current.x * parallaxFactor;
      const targetY = baseCamRef.current.y + mouseRef.current.y * parallaxFactor;

      // Smoothly interpolate (lerp) the camera's position towards the target
      // A smaller smoothing factor (e.g., 0.02) makes the movement feel smoother and heavier.
      const smoothing = 0.05;
      camera.position.x += (targetX - camera.position.x) * smoothing;
      camera.position.y += (targetY - camera.position.y) * smoothing;
  }


    composerRef.current?.render(delta);
  },1);

  /** Camera tween + DoF + update baseCam + set arrival time */
  function focusCameraOnIndex(index, duration = 1.2) {
    const targets = productTargetsRef.current;
    if (!targets?.[index]) return;

    isAnimatingRef.current = true;

    const { object, targetOffset, cameraPosition } = targets[index];
    const world = new THREE.Vector3();
    object.getWorldPosition(world);

    const finalTarget = new THREE.Vector3().addVectors(world, targetOffset || new THREE.Vector3());
    const camPos = cameraPosition ? cameraPosition.clone() : camera.position.clone();
    const focusDist = camPos.distanceTo(finalTarget);

    // Update overlay index now (or do your fade timing in Overlay component)
    setCurrentIndex(index);

    const tl = gsap.timeline({
      onComplete: () => {
        baseCamRef.current.copy(camPos);
        isAnimatingRef.current = false;
        arrivedAtRef.current = performance.now(); // <-- mark arrival time for dwell
      },
    });

    tl.to(
      camera.position,
      { x: camPos.x, y: camPos.y, z: camPos.z, duration, ease: "power2.out" },
      0
    );
    tl.to(
      controlsRef.current.target,
      {
        x: finalTarget.x,
        y: finalTarget.y,
        z: finalTarget.z,
        duration,
        ease: "power2.out",
        onUpdate: () => controlsRef.current.update(),
      },
      0
    );

    if (bokehRef.current?.uniforms?.focus) {
      tl.to(
        bokehRef.current.uniforms.focus,
        { value: focusDist, duration, ease: "power2.out" },
        0
      );
    }
  }

  return (
    <>
      <ambientLight intensity={2.2} />
      <OrbitControls ref={controlsRef} enableZoom={false} enableRotate={false} enablePan={false} />
    </>
  );
}
