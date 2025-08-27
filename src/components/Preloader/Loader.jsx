import React from 'react';
import { useProgress } from '@react-three/drei';
import styles from './styles/Loader.module.css';

export default function Loader() {
  // This hook from Drei automatically tracks all loading assets
  const { active, progress } = useProgress();

  return (
    // The overlay has a fade-out animation that is triggered
    // by the 'loaded' class when loading is no longer active.
    <div className={`${styles.overlay} ${!active ? styles.loaded : ''}`}>
      <div className={styles.center}>
        <div className={styles.barWrap}>
          <div className={styles.bar} style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div className={styles.progressText}>{Math.round(progress)}%</div>
      </div>
    </div>
  );
}