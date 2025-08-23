import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import styles from "./styles/Blogs.module.css";

export default function ViewAllCTA({ children = "view all blogs", href = "#" }) {
  const pathLeftRef = useRef(null);
  const pathRightRef = useRef(null);
  // FIXED: Add a ref to store the active animation
  const animRef = useRef(null);

  const initialVisibleLength = 20;

  useLayoutEffect(() => {
    const pathLeft = pathLeftRef.current;
    if (!pathLeft) return;
    const length = pathLeft.getTotalLength();
    gsap.set([pathLeftRef.current, pathRightRef.current], {
      strokeDasharray: length,
      strokeDashoffset: length - initialVisibleLength,
    });
  }, []);

  const animateIn = () => {
    // FIXED: Kill any existing animation before starting a new one
    if (animRef.current) animRef.current.kill();

    animRef.current = gsap.to([pathLeftRef.current, pathRightRef.current], {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  const animateOut = () => {
    // FIXED: Kill any existing animation before starting a new one
    if (animRef.current) animRef.current.kill();
    
    const length = pathLeftRef.current.getTotalLength();
    animRef.current = gsap.to([pathLeftRef.current, pathRightRef.current], {
      strokeDashoffset: length - initialVisibleLength,
      duration: 0.6,
      // FIXED: Use a more responsive 'out' ease
      ease: "power2.out",
    });
  };

  return (
    <a
      href={href}
      className={styles.viewAll}
      onMouseEnter={animateIn}
      onFocus={animateIn}
      onMouseLeave={animateOut}
      onBlur={animateOut}
    >
      <span className={styles.viewAllInner}>{children}</span>
      <svg
        className={styles.ctaSvg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathLeftRef}
          d="M 150,58 L 30,58 A 28,28 0 0 1 2,30 A 28,28 0 0 1 30,2 L 150,2"
          stroke="#ff4b2b" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke"
        />
        <path
          ref={pathRightRef}
          d="M 150,58 L 270,58 A 28,28 0 0 0 298,30 A 28,28 0 0 0 270,2 L 150,2"
          stroke="#ff4b2b" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke"
        />
      </svg>
    </a>
  );
}