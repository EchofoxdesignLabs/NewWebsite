// // src/features/showreel/Showreel.jsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Showreel.module.css";
import Parallax from "../../../scroll/Parallax";

/**
 * Showreel best‑practices:
 * - Default muted to satisfy mobile autoplay policies.
 * - playsInline to avoid iOS full‑screen hijack.
 * - Pause when offscreen (IO) to save CPU/GPU/battery.
 * - Respect prefers-reduced-motion (no autoplay).
 * - Use multiple sources (webm + mp4) for better codecs.
 * - Preload metadata only; set a poster for faster LCP.
 * - Optional remember last mute state (localStorage).
 */
export default function Showreel({onReady}) {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  // 200vh = pinned for one viewport of scrolling. Tweak to taste.
  const sectionHeight = "200vh";
  const [isMuted, setIsMuted] = useState(() => {
    // Persist mute preference across visits (optional)
    try {
      const saved = localStorage.getItem("showreel_muted");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });

  const [canAutoplay, setCanAutoplay] = useState(true);

  // Respect reduced motion and data saver
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const saveData =
      typeof navigator !== "undefined" &&
      "connection" in navigator &&
      navigator.connection &&
      navigator.connection.saveData;

    setCanAutoplay(!prefersReducedMotion && !saveData);
  }, []);

  // Keep the video element in sync with state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    try {
      localStorage.setItem("showreel_muted", String(isMuted));
    } catch {}
  }, [isMuted]);
  //Check if the video is ready
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    let done = false;
    const finish = () => { if (!done) { done = true; onReady?.(); } };
    const onData = () => finish();
    const onCanPlay = () => finish();
    const onError = () => finish();
    const fallback = setTimeout(finish, 15000);
    v.addEventListener("loadeddata", onData);
    v.addEventListener("canplaythrough", onCanPlay);
    v.addEventListener("error", onError);
    return () => {
      clearTimeout(fallback);
      v.removeEventListener("loadeddata", onData);
      v.removeEventListener("canplaythrough", onCanPlay);
      v.removeEventListener("error", onError);
    };
  }, [onReady]);

  // IntersectionObserver: pause when offscreen, play when visible (if allowed)
  useEffect(() => {
    const v = videoRef.current;
    const el = sectionRef.current;
    if (!v || !el) return;

    const onIntersect = async (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
        if (canAutoplay) {
          try {
            await v.play();
          } catch {
            // e.g., user hasn’t interacted; ignore
          }
        }
      } else {
        v.pause();
      }
    };

    const io = new IntersectionObserver(onIntersect, {
      threshold: [0, 0.2, 0.5, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, [canAutoplay]);

  // Toggle sound (unmute/mute). Try to play if we just unmuted.
  const toggleMute = async () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    setIsMuted(next);
    if (!next) {
      try {
        await v.play();
      } catch {
        // If autoplay with sound is blocked, user can press again after interaction.
      }
    }
  };

  return (
    <section ref={sectionRef} className={styles.showreelContainer}>
      <Parallax speed={0.01} anchorRef={sectionRef} lerp={0.12}>
      <div className={styles.videoWrap}>
        <video
          ref={videoRef}
          className={styles.video}
          // Autoplay only when we’re allowed to (reduced-motion/data-saver aware)
          autoPlay={canAutoplay}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          // supply a lightweight poster for fast first paint (replace path)
          poster="/videos/showreel_poster.webp"
          // keep UX clean; we provide our own sound button
          controls={false}
          // avoids PiP button on some browsers
          disablePictureInPicture
        >
          {/* Prefer AV1/VP9 WebM first, then H.264 MP4 fallback */}
          <source src="/videos/showreel.webm" type="video/webm" />
        </video>

        {/* Sound toggle button */}
        <button
          type="button"
          className={`${styles.soundBtn} ${isMuted ? styles.muted : styles.unmuted}`}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute showreel" : "Mute showreel"}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {/* Inline SVG for crisp icon without external deps */}
          {isMuted ? (
            // muted icon
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
              <path d="M5 9v6h4l5 5V4L9 9H5z"></path>
              <path d="M16 9l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          ) : (
            // volume icon
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
              <path d="M5 9v6h4l5 5V4L9 9H5z"></path>
              <path d="M18.5 8.5a5 5 0 010 7M16.5 10.5a2 2 0 010 3" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
        </button>
      </div>
      </Parallax>

      {/* Optional overlay slot */}
      <div className={styles.overlay}>{/* put headings/badges here if needed */}</div>
    </section>
  );
}