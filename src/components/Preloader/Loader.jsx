import React from 'react';
import { useProgress } from '@react-three/drei';
import styles from './styles/Loader.module.css';

export default function Loader() {
  const { active, progress } = useProgress();

  return (
    // The overlay fades out when loading is complete (when 'active' becomes false)
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