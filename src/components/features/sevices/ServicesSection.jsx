import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import styles from "./styles/Services.module.css";
import { SERVICES_COLUMNS } from "./ServiceColumns";

/* ---------- shaders ---------- */
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
  visible,
  mouseRef,           // { x, y } in client pixels
  overlayRect,        // DOMRect of overlay (absolute to viewport)
  targetRect,         // DOMRect of hovered item (absolute to viewport)
  leftShiftPx = 24,   // small left nudge
  strength = 0.25,
}) {
  const { size, viewport } = useThree(); // size = canvas px (overlay size), viewport = world units
  const tex = useTexture(currentSrc || "/images/placeholder.jpg");
  const meshRef = useRef();
  const matRef = useRef();
  const targetPos = useRef(new THREE.Vector3());
  const lastPos = useRef(new THREE.Vector3());
  const scaleRef = useRef([1.4, 1, 1]);

  // scale plane to image aspect (world units)
  useMemo(() => {
    const img = tex?.image;
    if (!img || !img.width) {
      scaleRef.current = [viewport.width * 0.28 * 1.2, viewport.height * 0.28, 1];
      return;
    }
    const aspect = img.width / img.height;
    const h = viewport.height * 0.28;
    const w = h * aspect;
    scaleRef.current = [w, h, 1];
  }, [tex, viewport.height, viewport.width]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: tex },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uAlpha: { value: 0.0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tex]
  );

  // fade alpha
  useEffect(() => {
    let raf = null;
    const step = () => {
      const target = visible ? 1 : 0;
      uniforms.uAlpha.value += (target - uniforms.uAlpha.value) * 0.16;
      if (Math.abs(uniforms.uAlpha.value - target) > 0.001) {
        raf = requestAnimationFrame(step);
      } else {
        uniforms.uAlpha.value = target;
      }
    };
    step();
    return () => cancelAnimationFrame(raf);
  }, [visible, uniforms]);

  useFrame(() => {
    if (!meshRef.current || !overlayRect) return;

    // Desired client px (relative to viewport)
    let clientX, clientY;

    // if (targetRect) {
    //   // place left of hovered link; flip to right if clipping
    //   const GAP = 24;
    //   clientX = targetRect.left - GAP - leftShiftPx;
    //   clientY = targetRect.top + targetRect.height / 2;

    //   const MIN_MARGIN = 32;
    //   if (clientX < MIN_MARGIN) {
    //     clientX = Math.min(
    //       window.innerWidth - MIN_MARGIN,
    //       targetRect.right + GAP + leftShiftPx
    //     );
    //   }
    // } else {
    //   clientX = mouseRef.current?.x ?? window.innerWidth / 2;
    //   clientY = mouseRef.current?.y ?? window.innerHeight / 2;
    // }
    clientX = mouseRef.current?.x ?? window.innerWidth / 2;
    clientY = mouseRef.current?.y ?? window.innerHeight / 2;

    // Convert viewport client px -> local overlay px
    const localX = clientX - overlayRect.left;
    const localY = clientY - overlayRect.top;

    // Convert local px -> world units using canvas size (size = overlay px)
    let vwX = (localX / size.width) * viewport.width - viewport.width / 2;
    const vwY = -(localY / size.height) * viewport.height + viewport.height / 2;
    vwX = vwX-leftShiftPx;

    targetPos.current.set(vwX, vwY, 0);

    // smooth follow & clamp
    lastPos.current.lerp(targetPos.current, 0.12);

    const [pw, ph] = scaleRef.current;
    const halfW = pw / 2;
    const halfH = ph / 2;
    const minX = -viewport.width / 2 + halfW + 0.02;
    const maxX = viewport.width / 2 - halfW - 0.02;
    const minY = -viewport.height / 2 + halfH + 0.02;
    const maxY = viewport.height / 2 - halfH - 0.02;

    lastPos.current.x = THREE.MathUtils.clamp(lastPos.current.x, minX, maxX);
    lastPos.current.y = THREE.MathUtils.clamp(lastPos.current.y, minY, maxY);

    meshRef.current.position.copy(lastPos.current);

    // rgb shift offset from lag
    const lag = new THREE.Vector2(
      lastPos.current.x - targetPos.current.x,
      lastPos.current.y - targetPos.current.y
    ).multiplyScalar(-strength);
    uniforms.uOffset.value.copy(lag);

    meshRef.current.scale.set(...scaleRef.current);

    if (matRef.current && uniforms.uTexture.value !== tex) {
      uniforms.uTexture.value = tex;
      matRef.current.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        key={currentSrc}
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

  const mouseRef = useRef({ x: 0, y: 0 });
  const [hoverSrc, setHoverSrc] = useState(null);
  const [visible, setVisible] = useState(false);

  const hoveredElRef = useRef(null);
  const hoverTargetRectRef = useRef(null);
  const overlayRectRef = useRef(null);

  const enterTimerRef = useRef(null);
  const ENTER_DELAY_MS = 30;

  // IO to toggle rendering
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.15),
      { threshold: [0, 0.15, 0.4, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // keep overlay rect fresh (scroll/resize)
  const refreshOverlayRect = useCallback(() => {
    if (overlayRef.current) {
      overlayRectRef.current = overlayRef.current.getBoundingClientRect();
    }
    if (hoveredElRef.current) {
      hoverTargetRectRef.current = hoveredElRef.current.getBoundingClientRect();
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

  // section mouse tracking
  const onMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  // enter/leave with tiny delay + data-hovered attribute
  const handleEnter = useCallback((e, src) => {
    if (hoveredElRef.current && hoveredElRef.current !== e.currentTarget) {
      hoveredElRef.current.dataset.hovered = "false";
      hoveredElRef.current = null;
    }
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);

    enterTimerRef.current = setTimeout(() => {
      if (e && e.currentTarget) {
        hoveredElRef.current = e.currentTarget;
        hoveredElRef.current.dataset.hovered = "true";
        hoverTargetRectRef.current = hoveredElRef.current.getBoundingClientRect();
      } else {
        hoverTargetRectRef.current = null;
      }
      setHoverSrc(src);
      refreshOverlayRect();
      enterTimerRef.current = null;
    }, ENTER_DELAY_MS);
  }, [refreshOverlayRect]);

  const handleLeave = useCallback((e) => {
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    if (e?.currentTarget) e.currentTarget.dataset.hovered = "false";
    if (hoveredElRef.current && hoveredElRef.current !== e?.currentTarget) {
      hoveredElRef.current.dataset.hovered = "false";
    }
    hoveredElRef.current = null;
    hoverTargetRectRef.current = null;
    setHoverSrc(null);
  }, []);

  useEffect(() => () => {
    if (hoveredElRef.current) hoveredElRef.current.dataset.hovered = "false";
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
  }, []);

  // Preload images
  useEffect(() => {
    SERVICES_COLUMNS.flatMap((c) => c.items.map((i) => i.image)).forEach((u) => {
      const img = new Image();
      img.src = u;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.servicesSection}
      onMouseMove={onMouseMove}
    >
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
                      onMouseEnter={(e) => handleEnter(e, it.image)}
                      onFocus={(e) => handleEnter(e, it.image)}
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

      {/* Absolute overlay — scoped to section */}
      <div ref={overlayRef} className={styles.canvasOverlay} aria-hidden="true">
        {visible && hoverSrc && overlayRectRef.current && (
          <Canvas
            orthographic
            camera={{ position: [0, 0, 10], zoom: 100 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <HoverPreview
              currentSrc={hoverSrc}
              visible={!!hoverSrc}
              mouseRef={mouseRef}
              overlayRect={overlayRectRef.current}
              targetRect={hoverTargetRectRef.current}
              leftShiftPx={0.8}
            />
          </Canvas>
        )}
      </div>
    </section>
  );
}
