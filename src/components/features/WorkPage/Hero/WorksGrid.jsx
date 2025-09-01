// src/components/features/workPage/WorksGrid.jsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

// Reuse the exact blog card/grid look:
import grid from "../../Blogs/styles/Blogs.module.css";

// Local styles just for the tab bar + underline + small extras
import styles from "./styles/WorkGrid.module.css";

import { WORKS } from "./WorkPosts";

const CATS = ["digital product", "entertainment", "industrial"];

export default function WorksGrid() {
  const [activeCat, setActiveCat] = useState(CATS[0]);

  // Filtered list (memoized)
  const filtered = useMemo(
    () => WORKS.filter((w) => w.category.toLowerCase() === activeCat.toLowerCase()),
    [activeCat]
  );

  // refs for underline animation and grid swap animation
  const barRef = useRef(null);
  const tabRefs = useRef([]);
  const underlineRef = useRef(null);
  const gridRef = useRef(null);

  // ---- underline helpers ----------------------------------------------------
  const moveUnderlineTo = (idx) => {
    const bar = barRef.current;
    const underline = underlineRef.current;
    const tab = tabRefs.current[idx];
    if (!bar || !underline || !tab) return;

    const barRect = bar.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const left = tabRect.left - barRect.left;
    const width = tabRect.width;

    // animate with GSAP for butter-smooth motion
    gsap.to(underline, {
      x: left,
      width,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  // initial underline + on resize
  useLayoutEffect(() => {
    moveUnderlineTo(CATS.indexOf(activeCat));
    const onR = () => moveUnderlineTo(CATS.indexOf(activeCat));
    window.addEventListener("resize", onR, { passive: true });
    return () => window.removeEventListener("resize", onR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    moveUnderlineTo(CATS.indexOf(activeCat));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCat]);

  // ---- grid swap animation on category change ------------------------------
  // Animate IN on first mount
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(`.${grid.card}`);
    if (!cards?.length) return;
    gsap.from(cards, {
      opacity: 0,
      y: 20,
      duration: 0.45,
      ease: "power3.out",
      stagger: 0.04,
      clearProps: "all",
    });
  }, []);

  const handleSelect = (cat, idx) => {
    if (cat === activeCat) return;

    // move the underline immediately for snappy feedback
    moveUnderlineTo(idx);

    // animate current cards OUT, then swap list, then animate IN
    const cards = gridRef.current?.querySelectorAll(`.${grid.card}`);
    if (!cards?.length) {
      setActiveCat(cat);
      return;
    }

    gsap.to(cards, {
      opacity: 0,
      y: 20,
      scale: 0.98,
      duration: 0.25,
      ease: "power2.in",
      stagger: 0.02,
      onComplete: () => {
        setActiveCat(cat);
        requestAnimationFrame(() => {
          const nextCards = gridRef.current?.querySelectorAll(`.${grid.card}`);
          gsap.from(nextCards, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.04,
            clearProps: "all",
          });
        });
      },
    });
  };

  return (
    <section className={grid.blogs} aria-label="All works">
      <div className={grid.inner}>
        {/* --- Category tabs + underline --- */}
        <div
          ref={barRef}
          className={styles.tabBar}
          onMouseLeave={() => moveUnderlineTo(CATS.indexOf(activeCat))}
        >
          {CATS.map((cat, i) => (
            <button
              key={cat}
              ref={(el) => (tabRefs.current[i] = el)}
              className={`${styles.tab} ${activeCat === cat ? styles.active : ""}`}
              onMouseEnter={() => moveUnderlineTo(i)}
              onClick={() => handleSelect(cat, i)}
              type="button"
            >
              {cat}
            </button>
          ))}
          <span ref={underlineRef} className={styles.underline} />
        </div>

        {/* --- Grid (reusing Blogs card styles) --- */}
        <div ref={gridRef} className={grid.grid}>
          {filtered.map((p) => (
            <article
              key={p.id}
              className={`${grid.card} ${styles.workCard}`} /* add our local workCard */
            >
              <a
                className={`${grid.imageWrap} ${styles.imageWrap}`}
                href={p.href}
                aria-label={p.title}
              >
                <img className={`${grid.image} ${styles.image}`} src={p.img} alt={p.title} />

                {/* overlay button (shows only when caseStudy exists) */}
                {p.caseStudy && (
                  <div className={styles.overlay}>
                    <a className={styles.caseBtn} href={p.caseStudy}>
                      View Case Study
                    </a>
                  </div>
                )}
              </a>

              <div className={grid.body}>
                <div className={grid.category}>{p.category}</div>

                <h3 className={grid.title}>
                  <a
                    className={`${grid.titleLink} ${styles.titleLink}`}
                    href={p.href}
                  >
                    {p.title}
                  </a>
                </h3>

                {/* NEW: description below title */}
                {p.description && <p className={styles.desc}>{p.description}</p>}

                {(p.date || p.read) && (
                  <div className={grid.meta}>
                    {p.date && <span className={grid.date}>{p.date}</span>}
                    {p.date && p.read && <span className={grid.dotSep}>•</span>}
                    {p.read && <span className={grid.read}>{p.read}</span>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
