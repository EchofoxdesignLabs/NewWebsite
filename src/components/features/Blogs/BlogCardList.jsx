import React from "react";
import styles from "./styles/Blogs.module.css";
import ViewAllCTA from "./ViewAllCTA";
import { POSTS } from "./Posts";



export default function BlogCardList() {
  return (
    <section className={styles.blogs} aria-label="Blogs">
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span className={styles.dotSmall} /> Blogs
        </p>

        <div className={styles.grid}>
          {POSTS.map((p) => (
            <article key={p.id} className={styles.card}>
              <a className={styles.imageWrap} href={p.href} aria-label={p.title}>
                <img className={styles.image} src={p.img} alt={p.title} />
              </a>

              <div className={styles.body}>
                <div className={styles.category}>{p.category}</div>

                <h3 className={styles.title}>
                  <a className={styles.titleLink} href={p.href}>
                    {p.title}
                  </a>
                </h3>

                <div className={styles.meta}>
                  <span className={styles.date}>{p.date}</span>
                  <span className={styles.dotSep}>•</span>
                  <span className={styles.read}>{p.read}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <ViewAllCTA href="/blogs">view all blogs</ViewAllCTA>
        </div>
      </div>
    </section>
  );
}
