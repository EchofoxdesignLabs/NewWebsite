import React, { useEffect, useRef } from "react";
import styles from "./styles/Marquee.module.css";
import { row1Images } from "./marqueeData";

function Track({ images, altPrefix = "logo", height }) {
  return (
    <div className={styles.track} aria-hidden="true">
      {images.map((src, i) => (
        <div className={styles.item} key={`${altPrefix}-${i}`}>
          <img
            src={src}
            alt={`${altPrefix}-${i + 1}`}
            height={parseInt(height, 10) || undefined}
          />
        </div>
      ))}
       <div className={styles.endGap} aria-hidden="true" />
    </div>
  );
}

/**
 * MarqueeRow
 * Renders two identical tracks inside a "scroller" that we translate -50%.
 * That guarantees a perfect loop with no visual seam or timing jump.
 */
function MarqueeRow({
  images,
  direction = "left",
  speed = 26,
  height = "102px",
  gap = "80px",
  pauseOnHover = false,
  altPrefix = "logo",
}) {
  const styleVars = {
    "--duration": `${speed}s`,
    "--gap": gap,
    "--item-height": height,
  };

  const rowClass =
    direction === "right"
      ? `${styles.row} ${styles.dirRight} ${pauseOnHover ? styles.pauseOnHover : ""}`
      : `${styles.row} ${styles.dirLeft} ${pauseOnHover ? styles.pauseOnHover : ""}`;

  return (
    <div className={rowClass} style={styleVars}>
      <div className={styles.maskLeft} aria-hidden="true" />
      <div className={styles.maskRight} aria-hidden="true" />

      {/* scroller contains TWO identical tracks */}
      <div className={styles.scroller}>
        <Track images={images} altPrefix={`${altPrefix}-a`} height={height} />
        <Track images={images} altPrefix={`${altPrefix}-b`} height={height} />
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
          el.classList.add(styles.isVisible);
        } else {
          el.classList.remove(styles.isVisible);
        }
      },
      { threshold: [0, 0.15, 0.5, 1] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.marqueeSection} ${styles.light}`}>
      <div className={styles.inner}>
        <div className={styles.rows}>
          <MarqueeRow images={row1Images} direction="left"  />
        </div>
      </div>
    </section>
  );
}
