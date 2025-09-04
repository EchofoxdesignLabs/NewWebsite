import React from "react";
import styles from "./styles/OtherWorksSection.module.css";

export default function OtherWorks({
  posts = [],
  limit,
  kicker = "all works",
}) {
  const shown = typeof limit === "number" ? posts.slice(0, limit) : posts;

  return (
    <section className={styles.blogs} aria-label={kicker}>
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span className={styles.dotSmall} /> {kicker}
        </p>

        {<h2 className={styles.titleTxt}>Explore More Case Studies</h2>}
        {<p className={styles.descriptionTxt}>The products we design are either in your phone or powering what's inside</p>}

        <div className={styles.grid}>
          {shown.map((p) => (
            <article key={p.id} className={styles.card}>
              <a className={styles.imageWrap} href={p.caseStudy} aria-label={p.title}>
                <img className={styles.image} src={p.img} alt={p.title} />
                {/* overlay button (shows only when caseStudy exists) */}
                {p.caseStudy && (
                  <div className={styles.overlay}>
                    <span className={styles.caseBtn} >
                      View Case Study
                    </span>
                  </div>
                )}
              </a>
              

              <div className={styles.body}>
                <div className={styles.category}>{p.category}</div>

                <h3 className={styles.title}>
                  <a className={styles.titleLink} href={p.caseStudy}>
                    {p.title}
                  </a>
                </h3>
                <p className={styles.cardDescription}>{p.description}</p>

                <div className={styles.meta}>
                  <span className={styles.date}>{p.date}</span>
                  <span className={styles.dotSep}>•</span>
                  <span className={styles.read}>{p.read}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}