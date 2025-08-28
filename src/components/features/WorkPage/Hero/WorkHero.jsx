// src/components/features/workPage/WorkHero.jsx
import React from "react";
import styles from "./styles/WorkHero.module.css";

export default function WorkHero() {
  return (
    <section className={styles.heroSpacing} aria-label="All works">
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span className={styles.dotSmall} /> all works
        </p>

        <h1 className={styles.title}>
          Fusing striking design with <br /> cutting-edge tech.
        </h1>
      </div>

      {/* optional subtle separator under hero */}
      <div className={styles.separator} />
    </section>
  );
}
