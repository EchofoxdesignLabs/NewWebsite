// src/components/Preloader/BootLoader.jsx
import React, { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import styles from "./styles/BootLoader.module.css";
import { useScrollLock } from "../../utils/useScrollLock";

export default function BootLoader({
  showreelReady,
  minVisibleMs = 600,
  maxWaitMs = 25000,
  videoSrc = "/videos/loader.mp4",
}) {
  const { active, progress } = useProgress();
  const threeDone = !active || progress >= 100;
  const allReady = threeDone && !!showreelReady;

  const [visible, setVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false); // <-- fade-in flag
  const firstShown = useRef(Date.now());
  const videoRef = useRef(null);

  useScrollLock(visible);

  // Block wheel/touch/keyboard while visible
  useEffect(() => {
    if (!visible) return;
    const prevent = (e) => e.preventDefault();
    const onKey = (e) => {
      const keys = [" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"];
      if (keys.includes(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", onKey, { passive: false });
    return () => {
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);

  // Safety timeout to never get stuck
  useEffect(() => {
    const safety = setTimeout(() => setVisible(false), maxWaitMs);
    return () => clearTimeout(safety);
  }, [maxWaitMs]);

  // Hide when both (three + showreel) ready
  useEffect(() => {
    if (!allReady) return;
    const elapsed = Date.now() - firstShown.current;
    const remain = Math.max(0, minVisibleMs - elapsed);
    const t = setTimeout(() => setVisible(false), remain);
    return () => clearTimeout(t);
  }, [allReady, minVisibleMs]);

  // Fade the loader video in only after it starts playing a frame
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const show = () => setVideoVisible(true);
    const onLoadedData = () => {
      // Some browsers don’t fire 'playing' until interaction; show after a short delay if needed
      requestAnimationFrame(() => requestAnimationFrame(show));
    };

    v.addEventListener("playing", show);        // best case: first frame is rendering
    v.addEventListener("loadeddata", onLoadedData); // fallback: video decoded

    return () => {
      v.removeEventListener("playing", show);
      v.removeEventListener("loadeddata", onLoadedData);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      {/* Full-bleed black until video fades in */}
      <video
        ref={videoRef}
        className={`${styles.videoBg} ${videoVisible ? styles.videoReady : ""}`}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      <div className={styles.scrim} />

      <div className={styles.hud}>
        <div className={styles.barWrap}>
          <div
            className={styles.bar}
            style={{ transform: `scaleX(${(progress || 0) / 100})` }}
          />
        </div>
        <div className={styles.progressText}>
          {Math.round(progress || 0)}%
          {!showreelReady ? " • preparing video…" : ""}
        </div>
      </div>
    </div>
  );
}
