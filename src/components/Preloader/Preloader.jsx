// src/components/Preloader/Preloader.jsx
import React, { useEffect } from "react";
import styles from "./styles/Preloader.module.css";

export default function Preloader({ progress = 0, onFinish, title = "Echofox" }) {
  useEffect(() => {
    if (progress >= 100) {
      // small delay so users see 100%
      const t = setTimeout(() => onFinish && onFinish(), 260);
      return () => clearTimeout(t);
    }
  }, [progress, onFinish]);

  return (
    <div className={styles.overlay} aria-hidden={progress >= 100}>
      <div className={styles.center}>
        <div className={styles.logo}>
          {/* Replace with your animated SVG/logo if you like */}
          <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden>
            <circle cx="36" cy="36" r="34" stroke="#ff4b2b" strokeWidth="3" fill="none" />
          </svg>
        </div>

        <div className={styles.title}>{title}</div>

        <div className={styles.barWrap}>
          <div className={styles.bar} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.progressText}>{progress}%</div>
      </div>
    </div>
  );
}
