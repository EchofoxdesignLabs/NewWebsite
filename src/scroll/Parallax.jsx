// src/scroll/Parallax.jsx
import React, { useLayoutEffect, useRef } from "react";
import { useScrollState } from "./ScrollProvider";

/**
 * Parallax: applies transform directly to the single child (no wrapper).
 * - anchorRef: ref to a NON-transformed element used to measure starting position (e.g., the <section>)
 * - speed: 0.1..0.25 for large blocks (too high causes seasick motion)
 * - axis: 'y' | 'x'
 * - lerp: 0..1 smoothing (0 = off, 0.1..0.2 feels nice)
 */
export default function Parallax({
  children,
  speed = 0.18,
  axis = "y",
  translate = 1,
  rotate = 0,
  scale = 0,
  clamp,
  anchorRef,          // <- important for stability
  lerp = 0,           // set to 0.1 for extra smoothness
}) {
  const elRef = useRef(null);
  const startRef = useRef(0);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  const rotRef = useRef(0);
  const sclRef = useRef(1);

  const { y, rm } = useScrollState();

  // Measure ONCE (and on resize) from a stable anchor (preferred) or parent node.
  useLayoutEffect(() => {
    const el = elRef.current;
    const anchor = anchorRef?.current || el?.parentElement;
    if (!el || !anchor) return;

    const measure = () => {
      const r = anchor.getBoundingClientRect();
      startRef.current = (window.scrollY || window.pageYOffset || 0) + r.top;
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(anchor);

    window.addEventListener("resize", measure, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // NOTE: do NOT depend on `y` here; we only re-measure on layout changes.
  }, [anchorRef]);

  // Apply transform on scroll updates (no re-measure here).
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (rm) {
      el.style.transform = "";
      return;
    }

    const start = startRef.current;
    const dy = (y - start) * speed;
    const t = clamp ? Math.max(-clamp, Math.min(clamp, dy)) : dy;

    const targetTx = axis === "x" ? t * translate : 0;
    const targetTy = axis === "y" ? t * translate : 0;
    const targetRot = rotate ? (t / 1000) * rotate : 0;
    const targetScl = scale ? 1 + (t / 1000) * scale : 1;

    if (lerp > 0) {
      const L = (from, to) => from + (to - from) * lerp;
      txRef.current = L(txRef.current, targetTx);
      tyRef.current = L(tyRef.current, targetTy);
      rotRef.current = L(rotRef.current, targetRot);
      sclRef.current = L(sclRef.current, targetScl);
    } else {
      txRef.current = targetTx;
      tyRef.current = targetTy;
      rotRef.current = targetRot;
      sclRef.current = targetScl;
    }

    el.style.willChange = "transform";
    el.style.transform = `translate3d(${txRef.current}px, ${tyRef.current}px, 0) rotate(${rotRef.current}deg) scale(${sclRef.current})`;
  }, [y, rm, speed, axis, translate, rotate, scale, clamp, lerp]);

  // Clone the only child, attach our ref and preserve existing style/props
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    ref: (node) => {
      elRef.current = node;
      const { ref } = child;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    style: { willChange: "transform", ...(child.props.style || {}) },
  });
}
