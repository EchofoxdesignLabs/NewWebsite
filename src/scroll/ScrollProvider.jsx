import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const ScrollCtx = createContext({ y: 0, velocity: 0, progress: 0, direction: 1, rm: false });

export function ScrollProvider({ children }) {
  const [state, setState] = useState({ y: 0, velocity: 0, progress: 0, direction: 1, rm: false });

  const rawY = useRef(0);
  const easedY = useRef(0);
  const lastY = useRef(0);
  const lastT = useRef(performance.now());
  const rafId = useRef(0);
  const ease = 0.12; // smoothing (0.08–0.2)

  useEffect(() => {
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    setState(s => ({ ...s, rm }));
  }, []);

  useEffect(() => {
    const onScroll = () => { rawY.current = window.scrollY || window.pageYOffset || 0; };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = (t) => {
      const dt = (t - lastT.current) / 1000;
      lastT.current = t;

      // ease raw -> eased
      const target = rawY.current;
      easedY.current += (target - easedY.current) * ease;

      const v = easedY.current - lastY.current;
      const dir = v >= 0 ? 1 : -1;
      lastY.current = easedY.current;

      const docH = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight
      );
      const winH = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, easedY.current / (docH - winH)));

      setState(s => ({ ...s, y: easedY.current, velocity: v / Math.max(dt, 1e-4), progress: p, direction: dir }));
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    const onResize = () => { /* keep progress accurate; no work needed here */ };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const value = useMemo(() => state, [state.y, state.velocity, state.progress, state.direction, state.rm]);

  return <ScrollCtx.Provider value={value}>{children}</ScrollCtx.Provider>;
}

export const useScrollState = () => useContext(ScrollCtx);
