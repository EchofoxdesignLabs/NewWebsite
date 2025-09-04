import React from "react";
import styles from "./styles/HeroSection.module.css";

export default function HeroSection({
  kicker,
  title,
  meta = [],
  heroImage,
  heroAlt = "Hero image",
}) {
  return (
    // The main section is now just a wrapper
    <section className={styles.hero}>
      
      {/* 1. This inner container holds all the text and is NOT full-width */}
      <div className={styles.inner}>
        {kicker && (
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            <span className={styles.kickerText}>{kicker}</span>
          </div>
        )}
        <h1 className={styles.title}>{title}</h1>
        {meta.length > 0 && (
          <ul className={styles.metaGrid}>
            {meta.map((m) => (
              <li key={m.label} className={styles.metaItem}>
                <div className={styles.metaLabel}>{m.label}</div>
                <div className={styles.metaValue}>{m.value}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. The image figure is now outside the inner container, so it can be full-width */}
      {heroImage && (
        <figure className={styles.heroMedia}>
          <img src={heroImage} alt={heroAlt} className={styles.heroImg} />
        </figure>
      )}
    </section>
  );
}