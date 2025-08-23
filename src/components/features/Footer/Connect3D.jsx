import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";

const VS = `
uniform float uTime;
uniform vec3 uMousePos;
uniform float uHoverState;
uniform float uNoiseFrequency;
uniform float uNoiseAmplitude;
void main(){
  float waveX = sin(position.x * uNoiseFrequency + uTime * 1.5);
  float waveY = cos(position.y * uNoiseFrequency + uTime * 1.5);
  float total = (waveX + waveY) * uNoiseAmplitude;
  vec3 np = position + normal * total * uHoverState;
  float d = distance(position, uMousePos);
  float push = smoothstep(200.0, 0.0, d) * uHoverState;
  np += normalize(position - uMousePos) * push * 50.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(np, 1.0);
}
`;

const FS = `
precision highp float;
void main(){
  gl_FragColor = vec4(1.0);
}
`;

export default function Connect3DVanilla({
  text = "let's connect",
  fontUrl = "/fonts/Redcollar_Regular.json",
  height = 180,            // adjust to your footer row height
  dpr = Math.min(window.devicePixelRatio, 2),
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    // --- sizes
    const container = wrapRef.current;
    let width = container.clientWidth;
    let heightPx = container.clientHeight;

    // --- scenes/camera
    const scene = new THREE.Scene();
    const hoverScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(14, width / heightPx, 0.01, 100000);
    camera.position.set(0, 0, 10000);

    // --- main renderer (base text)
    const rendererMain = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererMain.setPixelRatio(dpr);
    rendererMain.setSize(width, heightPx);
    rendererMain.setClearColor(0x000000, 0);
    rendererMain.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(rendererMain.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    container.appendChild(rendererMain.domElement);

    // --- fx renderer (only hovered glyph, on top)
    const rendererFX = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererFX.setPixelRatio(dpr);
    rendererFX.setSize(width, heightPx);
    rendererFX.setClearColor(0x000000, 0);
    rendererFX.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(rendererFX.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      pointerEvents: "none", // crucial: let the base canvas receive mouse input
    });
    container.appendChild(rendererFX.domElement);

    // --- composer for hover scene (RGB shift)
    const composerFX = new EffectComposer(rendererFX);
    composerFX.addPass(new RenderPass(hoverScene, camera));
    const rgbPass = new ShaderPass(RGBShiftShader);
    rgbPass.uniforms["amount"].value = 0;
    composerFX.addPass(rgbPass);

    // --- text group
    const textGroup = new THREE.Group();
    scene.add(textGroup);

    // --- loaders, helpers
    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(99, 99);

    const fontLoader = new FontLoader();
    let disposed = false;
    let rafId = 0;

    fontLoader.load(fontUrl, (font) => {
      if (disposed) return;

      // build glyphs
      let x = 0;
      for (let c of text) {
        if (c === " ") { x += 500; continue; }
        const geo = new TextGeometry(c, {
          font,
          size: 500,
          height: 1,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 10,
          curveSegments: 16,
        });
        geo.computeBoundingBox();

        const mat = new THREE.ShaderMaterial({
          vertexShader: VS,
          fragmentShader: FS,
          uniforms: {
            uTime: { value: 0 },
            uMousePos: { value: new THREE.Vector3() },
            uHoverState: { value: 0 },
            uNoiseFrequency: { value: 0.005 },
            uNoiseAmplitude: { value: 30 },
          },
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = x;
        x += geo.boundingBox.max.x - geo.boundingBox.min.x + 50;
        textGroup.add(mesh);
      }

      alignTextLeft();
      // BUT, we now call a new function after building the text.
      fitAndAlignText();
      // start loop
      const loop = () => {
        const t = clock.getElapsedTime();

        // 1) raycast
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(textGroup.children);
        const hovered = hits.length > 0 ? hits[0].object : null;

        // 2) update uniforms per glyph
        textGroup.children.forEach((mesh) => {
          const mat = mesh.material;
          const isH = mesh === hovered;
          if (isH) {
            const local = mesh.worldToLocal(hits[0].point.clone());
            mat.uniforms.uMousePos.value.copy(local);
          }
          mat.uniforms.uHoverState.value = THREE.MathUtils.lerp(
            mat.uniforms.uHoverState.value,
            isH ? 1 : 0,
            0.1
          );
          mat.uniforms.uTime.value = t;
        });

        // 3) draw base canvas (all text)
        rendererMain.autoClear = true;
        rendererMain.clear();
        rendererMain.render(scene, camera);

        // 4) clear hover scene and draw hovered-only to FX canvas
        hoverScene.clear();
        if (hovered) {
          const clone = new THREE.Mesh(hovered.geometry, hovered.material);
          clone.matrixAutoUpdate = false;
          clone.matrix.copy(hovered.matrixWorld);
          hoverScene.add(clone);

          rgbPass.uniforms["amount"].value =
            hovered.material.uniforms.uHoverState.value * 0.0035;

          rendererFX.autoClear = true;
          rendererFX.clear();
          composerFX.render();
        } else {
          rgbPass.uniforms["amount"].value = 0;
          rendererFX.clear(true, true, true);
        }

        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    });

    function alignTextLeft() {
      if (!textGroup || textGroup.children.length === 0) return;
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const dist = camera.position.z;
      const h = 2 * Math.tan(vFov / 2) * dist;
      const w = h * camera.aspect;
      textGroup.position.x = -w / 2;
    }

    // --- events
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouse.x = x * 2 - 1;
      mouse.y = -(y * 2 - 1);
    };
    container.addEventListener("mousemove", onMouseMove, { passive: true });
    // FIXED: This function now handles both SCALING and ALIGNMENT
    function fitAndAlignText() {
      if (!textGroup || textGroup.children.length === 0) return;

      const box = new THREE.Box3().setFromObject(textGroup);
      const textWidth = box.max.x - box.min.x;
      if (textWidth === 0) return;

      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const dist = camera.position.z;
      const visibleHeight = 2 * Math.tan(vFov / 2) * dist;
      const visibleWidth = visibleHeight * camera.aspect;

      const scale = (visibleWidth * 0.9) / textWidth;
      textGroup.scale.setScalar(scale);

      // --- THIS IS THE DEFINITIVE FIX ---
      // After scaling, we find the exact world position of the left edge of the text
      // and shift the entire group so that this edge aligns with the left of the screen.
      const firstLetter = textGroup.children[0];
      if (firstLetter) {
        firstLetter.geometry.computeBoundingBox();
        const letterPadding = firstLetter.geometry.boundingBox.min.x;
        // The final position is the left edge of the screen, minus the scaled internal padding of the first letter.
        textGroup.position.x = (-visibleWidth / 2) - (letterPadding * scale);
      }
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        width = cr.width;
        heightPx = cr.height;

        camera.aspect = width / heightPx;
        camera.updateProjectionMatrix();

        rendererMain.setSize(width, heightPx);
        rendererFX.setSize(width, heightPx);
        composerFX.setSize(width, heightPx);

        alignTextLeft();
      }
    });
    ro.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);

      // cleanup
      textGroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose?.();
      });
      rendererMain.dispose();
      rendererFX.dispose();
      composerFX.dispose();

      container.innerHTML = "";
    };
  }, [text, fontUrl, dpr]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
        overflow: "hidden",
      }}
    />
  );
}
