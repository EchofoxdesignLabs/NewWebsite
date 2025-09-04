import React from "react";
import styles from "./styles/ImageSection.module.css";

export default function ImageSection({
  title,
  description, // New prop for the description text
  textLayout = "singleColumn", // New prop to control layout: 'singleColumn' or 'twoColumn'
  imageSources,
  alt = "Full-width background image",
  height = 70,
  objectFit = "cover",
  textColor = "#ffffff", // New prop for text color, defaults to white
}) {
  const sectionStyle = {
    height: `${height}vh`,
  };

  const imageClassName = `${styles.image} ${styles[objectFit]}`;

  // Conditionally apply the correct layout class to the text container
  const textContainerClassName = `${styles.textContainer} ${styles[textLayout]}`;
  const textContainerStyle ={
    color:textColor
  };

  return (
    <section className={styles.imageSection} style={sectionStyle}>
      {/* A new container for all text, which handles the layout */}
      <div className={textContainerClassName} style={textContainerStyle}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <picture className={styles.imageContainer}>
        <source media="(min-width: 768px)" srcSet={imageSources.desktop} />
        <img src={imageSources.mobile} alt={alt} className={imageClassName} />
      </picture>
    </section>
  );
}