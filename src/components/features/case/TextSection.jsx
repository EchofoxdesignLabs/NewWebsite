  import React from "react";
  import styles from "./styles/TextSection.module.css";

  export default function TextSection({ title, contentItems = [] }) {
  // Check if this should be a full-width, single-column layout
  const isHighlightLayout = contentItems.length > 0 && contentItems[0].type === 'highlight';

  // Conditionally apply a class to the content container
  const contentClassName = `
    ${styles.contentContainer} 
    ${isHighlightLayout ? styles.fullWidth : ""}
  `;

  return (
    <section className={styles.textSection}>
      {/* The main title is only rendered if it exists AND it's not a highlight layout */}
      {!isHighlightLayout && title && <h2 className={styles.title}>{title}</h2>}

      {/* The content container now gets a conditional class */}
      <div className={contentClassName}>
        {contentItems.map((item, index) => {
          const isHighlight = item.type === 'highlight';
          const descriptionClassName = `
            ${styles.description} 
            ${isHighlight ? styles.highlight : ""}
          `;

          return (
            <div key={index} className={styles.item}>
              {!isHighlight && item.subtitle && (
                <h3 className={styles.subtitle}>{item.subtitle}</h3>
              )}
              <p className={descriptionClassName}>{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}