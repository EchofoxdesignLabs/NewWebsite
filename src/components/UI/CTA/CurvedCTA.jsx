import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import styles from "./styles/CurvedCTA.module.css";

/**
 * Curved pill CTA (two strokes: left + right).
 *
 * Props:
 * - as: 'link' | 'a' | 'button'  (default 'a')
 * - to / href / onClick: routed to the right tag
 * - size: 'sm' | 'md' | 'lg'     (defaults to 'md')
 * - className: extra class
 */
export default function CurvedCTA({
  children = "view all blogs",
  as = "a",
  to,
  href,
  onClick,
  size = "md",
  className = "",
  ...rest
}) {
  const pathL = useRef(null);
  const pathR = useRef(null);
  const animRef = useRef(null);

  // How much stroke is visible by default (center “teaser”)
  const INITIAL_VISIBLE = 60;

  useLayoutEffect(() => {
    const L = pathL.current;
    const R = pathR.current;
    if (!L || !R) return;

    const len = L.getTotalLength(); // both halves share same length
    gsap.set([L, R], {
      strokeDasharray: len,
      strokeDashoffset: len - INITIAL_VISIBLE,
    });

    return () => animRef.current?.kill();
  }, []);

  const animateIn = () => {
    animRef.current?.kill();
    animRef.current = gsap.to([pathL.current, pathR.current], {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  const animateOut = () => {
    animRef.current?.kill();
    const len = pathL.current.getTotalLength();
    animRef.current = gsap.to([pathL.current, pathR.current], {
      strokeDashoffset: len - INITIAL_VISIBLE,
      duration: 0.55,
      ease: "power2.out",
    });
  };

  const Tag = as === "link" ? Link : as === "button" ? "button" : "a";
  const tagProps =
    as === "link"
      ? { to }
      : as === "button"
      ? { type: "button", onClick }
      : { href: href || to || "#", onClick };

  return (
    <Tag
      {...tagProps}
      {...rest}
      className={`${styles.cta} ${styles[size]} ${className}`}
      onMouseEnter={animateIn}
      onFocus={animateIn}
      onMouseLeave={animateOut}
      onBlur={animateOut}
    >
      <span className={styles.label}>{children}</span>

      {/* Two halves that meet at x=150 (center) */}
      <svg
        className={styles.svg}
        viewBox="0 0 300 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* left half */}
        <path
          ref={pathL}
          className={styles.path}
          d="M 150,58 L 30,58 A 28,28 0 0 1 2,30 A 28,28 0 0 1 30,2 L 150,2"
        />
        {/* right half */}
        <path
          ref={pathR}
          className={styles.path}
          d="M 150,58 L 270,58 A 28,28 0 0 0 298,30 A 28,28 0 0 0 270,2 L 150,2"
        />
      </svg>
    </Tag>
  );
}
