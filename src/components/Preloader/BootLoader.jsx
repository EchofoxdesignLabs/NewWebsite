import React, { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import styles from "./styles/BootLoader.module.css";
import { useScrollLock } from "../../utils/useScrollLock";
export default function BootLoader({
  showreelReady,                     // boolean from Home -> App -> BootLoader
  minVisibleMs = 600,
  maxWaitMs = 25000,
  videoSrc = "/videos/loader.mp4",   // full-screen loader video
  videoPoster = "/videos/portal-empty.gif",
}) {
  const { active, progress } = useProgress();
  const threeDone = !active || progress >= 100;
  const allReady = threeDone && !!showreelReady;

  const [visible, setVisible] = useState(true);
  const firstShown = useRef(Date.now());
  // hard lock the page while loader is visible
  useScrollLock(visible);

  // extra guard: block scroll/touch/keyboard scrolling while visible
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

  useEffect(() => {
    const safety = setTimeout(() => setVisible(false), maxWaitMs);
    return () => clearTimeout(safety);
  }, [maxWaitMs]);

  useEffect(() => {
    if (!allReady) return;
    const elapsed = Date.now() - firstShown.current;
    const remain = Math.max(0, minVisibleMs - elapsed);
    const t = setTimeout(() => setVisible(false), remain);
    return () => clearTimeout(t);
  }, [allReady, minVisibleMs]);

  if (!visible) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      {/* Full-bleed video background */}
      <video
        className={styles.videoBg}
        src={videoSrc}
        poster={videoPoster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Optional dark scrim to keep UI readable */}
      <div className={styles.scrim} />

      {/* Progress HUD overlaid on top of the video */}
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
