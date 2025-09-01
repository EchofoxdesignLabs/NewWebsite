import React, { useEffect, useRef } from "react";

/**
 * An invisible component whose only job is to preload a video
 * and call an onReady callback when it's sufficiently buffered.
 */
export default function VideoPreloader({ src, onReady }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onReady) return;

    // This event fires when the browser can play the video through to the end
    // without having to stop for buffering.
    const onCanPlayThrough = () => {
      onReady(); // Signal that the video is ready!
    };

    video.addEventListener('canplaythrough', onCanPlayThrough);
    
    // Some browsers are slower, so we'll also use a fallback
    const onLoadedData = () => {
      // Small timeout to give it a moment to buffer
      setTimeout(onReady, 500);
    };
    video.addEventListener('loadeddata', onLoadedData);

    return () => {
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('loadeddata', onLoadedData);
    };
  }, [src, onReady]);

  // This video is never visible to the user
  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      style={{ display: 'none' }}
      aria-hidden="true"
    />
  );
}