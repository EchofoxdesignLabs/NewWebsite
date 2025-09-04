import React from "react";
import styles from "./styles/StrategyCards.module.css";

export default function StrategyCards({ cardData = [] }) {
  return (
    <section className={styles.strategySection}>
      {cardData.map((card, index) => (
        <div key={index} className={styles.card}>
          {/* Image container for the zoom effect */}
          <div className={styles.imageContainer}>
            <img src={card.image} alt={card.title} className={styles.image} />
          </div>

          {/* Text content */}
          <div className={styles.textContainer}>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.description}>{card.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}