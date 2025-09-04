import React from "react";
import styles from "./styles/AboutSection.module.css";

export default function AboutSection({
  title,
  description,
  images = [],
  altTexts = [],
  imageLayout = "default",
}) {
    const layoutClass = imageLayout === 'overlap' ? styles.overlapLayout : '';
  return (
    <section className={styles.about}>
      {/* Text container remains the same */}
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>

      {/* The image grid now contains three direct children */}
      {images.length === 3 && (
        // The conditional layout class is added here
        <div className={`${styles.imageGrid} ${layoutClass}`}>
          {/* Left Column */}
          <figure className={styles.imageContainer}>
            <img src={images[0]} alt={altTexts[0] || ""} className={styles.image} />
          </figure>
          
          {/* Right Column */}
          <div className={styles.rightColumn}>
            <figure className={`${styles.imageContainer} ${styles.imageTopRight}`}>
              <img src={images[1]} alt={altTexts[1] || ""} className={styles.image} />
            </figure>
            <figure className={`${styles.imageContainer} ${styles.imageBottomRight}`}>
              <img src={images[2]} alt={altTexts[2] || ""} className={styles.image} />
            </figure>
          </div>
        </div>
      )}
    </section>
  );
}