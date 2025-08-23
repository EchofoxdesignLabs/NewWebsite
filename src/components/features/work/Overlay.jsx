import React, { useEffect, useState } from 'react';
import { useProjectStore } from './useProjectStore';
import styles from './styles/Work.module.css';

export default function Overlay() {
  const projects = useProjectStore((s) => s.projects);
  const currentIndex = useProjectStore((s) => s.currentTargetIndex);
  
  // State for the data that is CURRENTLY being displayed
  const [displayedProject, setDisplayedProject] = useState(projects?.[currentIndex]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // When the index changes, first fade out
    setVisible(false);

    const fadeOutTimer = setTimeout(() => {
      // After fading out, update the content that will be shown
      setDisplayedProject(projects?.[currentIndex]);
      // Then, trigger the fade in
      setVisible(true);
    }, 450); // This should match your CSS transition duration

    return () => clearTimeout(fadeOutTimer);
  }, [currentIndex, projects]);

  if (!displayedProject) return null;

  return (
    <div className={styles.textOverlay} aria-live="polite">
      <div className={`${styles.textContent} ${visible ? styles.visible : ''}`}>
        <p className={styles.productCategory}>{displayedProject.category}</p>
        <h1 className={styles.productTitle}>{displayedProject.title}</h1>
        <p className={styles.productDescription}>{displayedProject.description}</p>
        <a
          href={displayedProject.link}
          className={styles.exploreLink}
          data-text="Explore"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore
        </a>
      </div>
    </div>
  );
}