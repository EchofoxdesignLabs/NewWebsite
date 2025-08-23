import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import styles from "./styles/Testimonials.module.css";
import { TESTIMONIALS } from "./Testimonials";

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const animating = useRef(false);

  const textRef = useRef(null);
  const avatarRef = useRef(null);
  const dotsRef = useRef(null);

  // animate indicator pips: active pip elongates & turns red
  const animatePips = (activeIdx) => {
    if (!dotsRef.current) return;
    const nodes = Array.from(dotsRef.current.querySelectorAll(`.${styles.dot}`));
    nodes.forEach((n, i) => {
      if (i === activeIdx) {
        gsap.to(n, { width: 28, backgroundColor: "#ff4b2b", duration: 0.28, ease: "power3.out" });
      } else {
        gsap.to(n, { width: 10, backgroundColor: "rgba(255,255,255,0.25)", duration: 0.28, ease: "power3.out" });
      }
    });
  };

  // in animation (dir: 1 = incoming from right, -1 incoming from left)
  const animateIn = (dir = 1) => {
    if (!textRef.current || !avatarRef.current) return;
    animating.current = true;
    gsap.killTweensOf([textRef.current, avatarRef.current]);

    gsap.fromTo(
      textRef.current,
      { y: dir > 0 ? 18 : -18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.62,
        ease: "power3.out",
        onComplete: () => (animating.current = false),
      }
    );

    gsap.fromTo(
      avatarRef.current,
      { x: dir > 0 ? 80 : -80, scale: 0.94, opacity: 0 },
      { x: 0, scale: 1, opacity: 1, duration: 0.7, delay: 0.06, ease: "power3.out" }
    );

    animatePips(indexRef.current);
  };

  // out animation (dir: 1 means animate out toward top-right, -1 toward top-left)
  const animateOut = (dir = 1) => {
    if (!textRef.current || !avatarRef.current) return;
    animating.current = true;
    gsap.killTweensOf([textRef.current, avatarRef.current]);

    gsap.to(textRef.current, {
      y: dir > 0 ? -18 : 18,
      opacity: 0,
      duration: 0.42,
      ease: "power2.in",
    });

    gsap.to(avatarRef.current, {
      x: dir > 0 ? -80 : 80,
      scale: 0.94,
      opacity: 0,
      duration: 0.42,
      ease: "power2.in",
    });
  };

  // goTo with wrap support
  const goTo = (nextIndex, dir = 1) => {
    if (animating.current || nextIndex === indexRef.current) return;
    animateOut(dir);
    setTimeout(() => {
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      requestAnimationFrame(() => animateIn(dir));
    }, 420);
  };

  // wrap next/prev
  const next = () => {
    const nxt = (indexRef.current + 1) % TESTIMONIALS.length;
    goTo(nxt, 1);
  };
  const prev = () => {
    const p = (indexRef.current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    goTo(p, -1);
  };

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, []);

  // initial show (avoid blank first paint)
  useEffect(() => {
    indexRef.current = 0;
    animatePips(0);
    const t = setTimeout(() => animateIn(1), 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, []);

  const handlePipClick = (i) => {
    const dir = i > indexRef.current ? 1 : -1;
    goTo(i, dir);
  };

  return (
    <section className={styles.section} aria-label="Testimonials">
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span className={styles.dotSmall} /> testimonial
        </p>

        <blockquote className={styles.wrap}>
            {/* decorative quote mark */}
            <span className={styles.quoteMark} aria-hidden>“</span>

            {/* row 1 – quote (left) */}
            <div className={styles.quote} ref={textRef}>
                <p className={styles.quoteText}>{TESTIMONIALS[index].quote}</p>
            </div>

            {/* row 1 – avatar (right) */}
            <div className={styles.avatarCol} aria-hidden>
                <div className={styles.avatarWrap} ref={avatarRef}>
                <img className={styles.avatar}
                    src={TESTIMONIALS[index].avatar}
                    alt={TESTIMONIALS[index].name} />
                </div>
            </div>

            {/* row 2 – footer (left) */}
            <div className={styles.footer}>
                <div className={styles.pips} ref={dotsRef} aria-hidden>
                {TESTIMONIALS.map((_, i) => (
                    <button key={i} className={styles.dot}
                            onClick={() => handlePipClick(i)}
                            aria-label={`Go to testimonial ${i + 1}`} />
                ))}
                </div>

                <div className={styles.person}>
                <div className={styles.name}>{TESTIMONIALS[index].name}</div>
                <div className={styles.title}>{TESTIMONIALS[index].title}</div>
                </div>
            </div>

            {/* row 2 – controls (right) */}
            <div className={styles.controls}>
                <button className={styles.ctrl} onClick={prev} aria-label="Previous">‹</button>
                <button className={styles.ctrl} onClick={next} aria-label="Next">›</button>
            </div>
        </blockquote>
      </div>
    </section>
  );
}
