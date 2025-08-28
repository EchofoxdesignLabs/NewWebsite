// src/pages/Work.jsx
import React from "react";
import BlogCardList from "../components/features/Blogs/BlogCardList";
import { WORKS } from "../components/features/work/WorkPosts";
import styles from "./styles/Work.module.css";

export default function Work() {
  return (
    <div className={styles.page}>
      <section className={styles.heroSpacing}>
        <div className={styles.inner}>
          <p className={styles.kicker}><span className={styles.dotSmall} /> all works</p>
          <h1 className={styles.title}>Fusing striking design with cutting-edge tech.</h1>
        </div>
      </section>

      {/* show full list of works, pass posts prop */}
      <main>
        <BlogCardList
          posts={WORKS}
          kicker="All works"
          ctaHref={null}       // no CTA on the full page (optional)
          ctaLabel="view all works"
        />
      </main>
    </div>
  );
}
