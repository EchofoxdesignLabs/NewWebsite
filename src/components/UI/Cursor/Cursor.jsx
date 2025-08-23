import React, { useEffect, useRef } from "react";
import styles from "./styles/Cursor.module.css";
import { gsap } from "gsap";

/**
 * Cursor component:
 * - Renders an SVG cursor with two concentric rings (same radius visually)
 * - Outer ring follows slower; inner ring follows faster
 * - When hovering trigger elements (a, button, [data-cursor]) both rings get an animated
 *   turbulence/vibration via feTurbulence (GSAP timeline).
 */
export default function Cursor() {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const outerRef = useRef(null);
  const feRef = useRef(null);

  // stateful positions used for lerp
  const pos = useRef({ x: -9999, y: -9999 });
  const rendered = useRef({
    // both rings share same radius visually
    inner: { x: -9999, y: -9999, r: 18, opacity: 1 },
    outer: { x: -9999, y: -9999, r: 18, opacity: 1 },
    // lerp amounts: smaller = slower follow
    amtInner: 0.22,
    amtOuter: 0.15
  });

  // timeline for turbulence (vibration)
  const tg = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const outer = outerRef.current;
    const fe = feRef.current;

    if (!wrap || !inner || !outer || !fe) return;

    // initialize: hide until first move
    wrap.style.opacity = "0";

    let running = true;
    let rafId = null;

    // make GSAP timeline for turbulence — animate feTurbulence baseFrequency down to zero
    tg.current = gsap.timeline({ paused: true })
      .to({ f: 0.35 }, { 
        f: 0,
        duration: 0.9, 
        ease: "expo.out",
        onUpdate: function() {
          // gsap passes a proxy object; we pick its f
          const val = this.targets()[0].f;
          fe.setAttribute("baseFrequency", val.toFixed(4));
        },
        // ensure filter removed at the end
        onComplete: () => {
          inner.style.filter = "none";
          outer.style.filter = "none";
        }
      });

    // pointermove -> update target
    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      // show on first move
      wrap.style.opacity = "1";
      // ensure we keep the rAF loop running
      if (!rafId) tick();
    };

    // rAF loop -> lerp positions and apply transforms
    function lerp(a, b, n) { return (1 - n) * a + n * b; }

    function tick() {
      // positions to aim to (center origin)
      const targetX = pos.current.x;
      const targetY = pos.current.y;

      // Inner (follows faster)
      rendered.current.inner.x = lerp(rendered.current.inner.x, targetX, rendered.current.amtInner);
      rendered.current.inner.y = lerp(rendered.current.inner.y, targetY, rendered.current.amtInner);

      // Outer (slower)
      rendered.current.outer.x = lerp(rendered.current.outer.x, targetX, rendered.current.amtOuter);
      rendered.current.outer.y = lerp(rendered.current.outer.y, targetY, rendered.current.amtOuter);

      // Apply transform to container (we position by translate of wrap)
      // Keep wrap top-left so child circles coordinates match visually.
      wrap.style.transform = `translate3d(${rendered.current.outer.x - (rendered.current.outer.r)}px, ${rendered.current.outer.y - (rendered.current.outer.r)}px, 0)`;

      // Position inner circle relative to container (outer sets container pos).
      // Both circles should appear same size visually; we keep same 'r'.
      inner.setAttribute("cx", rendered.current.inner.r);
      inner.setAttribute("cy", rendered.current.inner.r);
      outer.setAttribute("cx", rendered.current.outer.r);
      outer.setAttribute("cy", rendered.current.outer.r);

      // For slight parallax you can offset inner inside container:
      const innerOffsetX = Math.round(rendered.current.inner.x - rendered.current.outer.x);
      const innerOffsetY = Math.round(rendered.current.inner.y - rendered.current.outer.y);
      inner.style.transform = `translate3d(${innerOffsetX}px, ${innerOffsetY}px, 0)`;

      rafId = running ? requestAnimationFrame(tick) : null;
    }

    // hover triggers
    const triggers = Array.from(document.querySelectorAll("a, button, [data-cursor]"));
    const enter = (ev) => {
      // apply filter to both circles and restart vibration timeline
      inner.style.filter = `url(#cursor-filter)`;
      outer.style.filter = `url(#cursor-filter)`;
      // reset baseFrequency initial
      fe.setAttribute("baseFrequency", "0.35");
      tg.current.restart();
    };
    const leave = (ev) => {
      // timeline will complete and remove filter (onComplete)
      // if you want immediate stop: tg.current.progress(1).kill();
      // but we want smooth decay so do nothing here
    };

    triggers.forEach(n => {
      n.addEventListener("mouseenter", enter);
      n.addEventListener("mouseleave", leave);
    });

    window.addEventListener("mousemove", onMove, { passive: true });

    // start loop so container is trackable even before hover
    tick();

    return () => {
      // cleanup
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      tg.current && tg.current.kill();
      triggers.forEach(n => {
        n.removeEventListener("mouseenter", enter);
        n.removeEventListener("mouseleave", leave);
      });
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      {/* SVG filter in DOM once (id referenced by url(#cursor-filter)) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="cursor-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence ref={el => (feRef.current = el)} type="fractalNoise" baseFrequency="0.0" numOctaves="1" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="20" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Container positioned via JS transform. pointer-events none so it doesn't block real elements */}
      <div
        ref={wrapRef}
        className={styles.cursor}
        aria-hidden="true"
        style={{ width: 36, height: 36 }} // width = 2*r (r=18)
      >
        <svg className={styles.cursorSvg} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" >
          {/* outer ring */}
          <circle ref={outerRef} className={styles.outer} cx="18" cy="18" r="18" strokeWidth="2" stroke="#ff4b2b" fill="none" />
          {/* inner ring */}
          <circle ref={innerRef} className={styles.inner} cx="18" cy="18" r="18" strokeWidth="2" stroke="#ff4b2b" fill="none" />
        </svg>
      </div>
    </>
  );
}
