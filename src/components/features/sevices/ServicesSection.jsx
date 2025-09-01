import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import styles from "./styles/Services.module.css";
import { SERVICES_COLUMNS } from "./ServiceColumns";
import Parallax from "../../../scroll/Parallax";
import Background from "../../Background/Background";

/* ---------- Shaders ---------- */
const vertex = `
uniform vec2 uOffset;
varying vec2 vUv;
vec3 deform(vec3 position, vec2 uv, vec2 offset){
  float PI = 3.14159265358979323846264;
  position.x += sin(uv.y*PI)*offset.x;
  position.y += sin(uv.x*PI)*offset.y;
  return position;
}
void main(){
  vUv = uv;
  vec3 p = deform(position,uv,uOffset);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
}
`;

const fragment = `
uniform sampler2D uTexture;
uniform float uAlpha;
uniform vec2 uOffset;
varying vec2 vUv;
void main(){
  float r = texture2D(uTexture, vUv + uOffset).r;
  vec2 gb = texture2D(uTexture, vUv).gb;
  vec3 color = vec3(r, gb);
  gl_FragColor = vec4(color, uAlpha);
}
`;

/* ---------- Preview plane (R3F) ---------- */
function HoverPreview({
  currentSrc,
  isVisible,
  mouseRef,
  overlayRect,
  leftShiftPx = 100, // Controls how far left of the cursor the image rests
}) {
  const { size, viewport } = useThree();
  const meshRef = useRef();
  const firstRenderRef = useRef(true); // Ref to track the entrance animation

  const allImageUrls = useMemo(() =>
    SERVICES_COLUMNS.flatMap((c) => c.items.map((i) => i.image)),
    []
  );
  const textures = useTexture(allImageUrls);

  const activeTexture = useMemo(() => {
    const idx = allImageUrls.indexOf(currentSrc);
    return idx > -1 ? textures[idx] : null;
  }, [currentSrc, allImageUrls, textures]);

  const uniforms = useMemo(() => ({
    uTexture: { value: null },
    uOffset: { value: new THREE.Vector2(0, 0) },
    uAlpha: { value: 0.0 },
  }), []);

  // This effect handles the fade-in and resets the entrance animation flag
  useEffect(() => {
    if (isVisible) {
      firstRenderRef.current = true; // Reset on each new hover
    }
    gsap.to(uniforms.uAlpha, {
      value: isVisible ? 1.0 : 0.0,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, [isVisible, uniforms.uAlpha]);

  const targetPos = useRef(new THREE.Vector3());
  useFrame(() => {
    if (!meshRef.current || !overlayRect || !activeTexture?.image) return;

    // Calculate mouse position in world units, relative to the canvas
    let targetX = (mouseRef.current.x - overlayRect.left) / size.width * viewport.width - viewport.width / 2;
    let targetY = -(mouseRef.current.y - overlayRect.top) / size.height * viewport.height + viewport.height / 2;

    // FIXED: Re-introduce the left shift to position the image correctly
    const shiftInWorldUnits = (leftShiftPx / size.width) * viewport.width;
    targetX -= shiftInWorldUnits;
    
    targetPos.current.set(targetX, targetY, 0);

    // FIXED: Add the "slide from right" entrance animation on the first frame
    if (isVisible && firstRenderRef.current) {
      // On the first frame, teleport the mesh to its starting position (off-screen right)
      meshRef.current.position.set(targetX + viewport.width * 0.1, targetY, 0);
      firstRenderRef.current = false;
    }

    // The lerp automatically creates the slide-in and follow effects
    meshRef.current.position.lerp(targetPos.current, 0.08);

    const lag = targetPos.current.clone().sub(meshRef.current.position).multiplyScalar(0.1);
    uniforms.uOffset.value.set(lag.x, lag.y);
    
    uniforms.uTexture.value = activeTexture;
    
    const aspect = activeTexture.image.width / activeTexture.image.height;
    const h = viewport.height * 0.28;
    const w = h * aspect;
    meshRef.current.scale.set(w, h, 1);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 16, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
      />
    </mesh>
  );
}

/* ---------- Main component ---------- */
export default function ServicesSection() {
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 }); // Raw clientX/Y
  const [hoverSrc, setHoverSrc] = useState(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [overlayRect, setOverlayRect] = useState(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting && entry.intersectionRatio > 0.1),
      { threshold: [0, 0.1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const refreshOverlayRect = useCallback(() => {
    if (overlayRef.current) {
      setOverlayRect(overlayRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    refreshOverlayRect();
    window.addEventListener("scroll", refreshOverlayRect, { passive: true });
    window.addEventListener("resize", refreshOverlayRect);
    return () => {
      window.removeEventListener("scroll", refreshOverlayRect);
      window.removeEventListener("resize", refreshOverlayRect);
    };
  }, [refreshOverlayRect]);

  const onMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  const handleEnter = useCallback((src) => setHoverSrc(src), []);
  const handleLeave = useCallback(() => setHoverSrc(null), []);

  return (
    <section
      ref={sectionRef}
      className={styles.servicesSection}
      onMouseMove={onMouseMove}
      onMouseLeave={handleLeave}
    >
      
      <Parallax speed={-0.2}>
        
      <div className={styles.inner}>
        <p className={styles.kicker}><span className={styles.dot} /> our services</p>
        <h2 className={styles.headline}>
          We focus on a broader picture with great <span className={styles.accent}>attention to detail</span>, for analytics and design to development and tech support
        </h2>
        <div className={styles.columns}>
          {SERVICES_COLUMNS.map((col) => (
            <div key={col.title} className={styles.column}>
              <h3 className={styles.columnTitle}>{col.title}</h3>
              <ul className={styles.list}>
                {col.items.map((it) => (
                  <li key={it.label}>
                    <button
                      type="button"
                      className={styles.link}
                      onMouseEnter={() => handleEnter(it.image)}
                      onFocus={() => handleEnter(it.image)}
                      onMouseLeave={handleLeave}
                      onBlur={handleLeave}
                    >
                      {it.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      </Parallax>

      <div ref={overlayRef} className={styles.canvasOverlay} aria-hidden="true">
        {isSectionVisible && overlayRect && (
          // --- OPTIMIZATION COMMENT ---
          // Cap the device pixel ratio (DPR) to a maximum of 1.5. This provides a
          // crisp image on high-res screens while significantly reducing the number
          // of pixels the GPU needs to render, improving performance.
          // The Canvas is persistent and rendered conditionally only on section visibility,
          // not on hover. This prevents the expensive process of creating and destroying
          // the WebGL context repeatedly, fixing performance and memory issues.
          <Canvas
            orthographic
            camera={{ zoom: 100 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <HoverPreview
                currentSrc={hoverSrc}
                isVisible={!!hoverSrc}
                mouseRef={mouseRef}
                overlayRect={overlayRect}
              />
            </Suspense>
          </Canvas>
        )}
      </div>
    </section>
  );
}