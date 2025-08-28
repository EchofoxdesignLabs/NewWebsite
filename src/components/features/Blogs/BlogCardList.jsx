// src/components/features/Blogs/BlogCardList.jsx
import React from "react";
import styles from "./styles/Blogs.module.css";
import ViewAllCTA from "./ViewAllCTA";
import { POSTS } from "./Posts";
import CurvedCTA from "../../UI/CTA/CurvedCTA";

/**
 * BlogCardList - configurable list used both on homepage and on the full page.
 *
 * Props:
 *  - posts: array of post objects (defaults to POSTS)
 *  - limit: number to limit displayed items (optional)
 *  - kicker: string for the small label (defaults to "Blogs")
 *  - ctaHref: href for the CTA button (optional)
 *  - ctaLabel: label for CTA (defaults to "view all blogs")
 */
export default function BlogCardList({
  posts = POSTS,
  limit,
  kicker = "Blogs",
  ctaHref = "/blogs",
  ctaLabel = "view all blogs",
}) {
  const shown = typeof limit === "number" ? posts.slice(0, limit) : posts;

  return (
    <section className={styles.blogs} aria-label={kicker}>
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span className={styles.dotSmall} /> {kicker}
        </p>

        <div className={styles.grid}>
          {shown.map((p) => (
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

        {ctaHref && (
          <div className={styles.ctaWrap}>
            {/* <ViewAllCTA href={ctaHref}>{ctaLabel}</ViewAllCTA> */}
            <CurvedCTA as="link" to="/work" size="lg">
              view all blogs
            </CurvedCTA>
          </div>
        )}
      </div>
    </section>
  );
}
