// src/utils/useAssetPreloader.js
import { useCallback, useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

/**
 * preloadAssets({ models, images, fonts, threeFonts, chunkImports })
 * - models: array of URLs (GLTF)
 * - images: array of image URLs
 * - fonts: array of CSS font descriptors to load via FontFace API e.g. "16px Redcollar"
 * - threeFonts: array of URLs to JSON font used by three.js FontLoader
 * - chunkImports: array of dynamic import functions to warm route chunks, e.g. () => import('../pages/About')
 *
 * Returns: { progress, done, error, start }
 */
export default function useAssetPreloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const totalRef = useRef(0);
  const loadedRef = useRef(0);

  const inc = useCallback(() => {
    loadedRef.current += 1;
    setProgress(Math.round((loadedRef.current / Math.max(1, totalRef.current)) * 100));
  }, []);

  const preloadImages = useCallback((images = []) => {
    totalRef.current += images.length;
    return Promise.all(
      images.map(
        (src) =>
          new Promise((res) => {
            const img = new Image();
            img.onload = () => { inc(); res(src); };
            img.onerror = () => { inc(); res(src); };
            img.src = src;
          })
      )
    );
  }, [inc]);

  const preloadGLTFs = useCallback((models = []) => {
    const loader = new GLTFLoader();
    totalRef.current += models.length;
    return Promise.all(
      models.map((url) =>
        new Promise((res) => {
          loader.load(
            url,
            (gltf) => { inc(); res(gltf); },
            undefined,
            () => { inc(); res(null); }
          );
        })
      )
    );
  }, [inc]);

  const preloadTextures = useCallback((textures = []) => {
    const loader = new TextureLoader();
    totalRef.current += textures.length;
    return Promise.all(
      textures.map((url) =>
        new Promise((res) => {
          loader.load(url, () => { inc(); res(url); }, undefined, () => { inc(); res(null); });
        })
      )
    );
  }, [inc]);
  // inside src/utils/useAssetPreloader.js (add near other preloadX functions)
  const preloadVideos = useCallback((videos = [], opts = {}) => {
    // opts.timeoutMs: optional per-video timeout (default 8000ms)
    const TIMEOUT = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 8000;
    const createVideoPromise = (url) =>
      new Promise((res) => {
        try {
          const v = document.createElement("video");
          v.preload = "auto";          // try to buffer
          v.muted = true;              // mute (helps autoplay)
          v.playsInline = true;
          v.src = url;
          // optional: if CORS or crossorigin needed, set v.crossOrigin = 'anonymous';

          let finished = false;
          const cleanup = () => {
            v.removeAttribute("src");
            v.load && v.load(); // clear buffer
            v.oncanplaythrough = null;
            v.onloadedmetadata = null;
            v.onerror = null;
          };

          const done = (ok) => {
            if (finished) return;
            finished = true;
            cleanup();
            res(ok ? { url, ready: true } : { url, ready: false });
          };

          // best: canplaythrough -> should be safe to play without buffering
          v.oncanplaythrough = () => done(true);
          // fallback: at least metadata loaded (we can still play, but may buffer)
          v.onloadedmetadata = () => {
            // resolve but note it's not fully buffered
            // resolve true if you prefer metadata-only: done(true)
            // here we resolve true (useful for small videos)
            done(true);
          };
          v.onerror = () => done(false);

          // safety timeout so a slow network won't hang loader
          const t = setTimeout(() => {
            clearTimeout(t);
            done(false);
          }, TIMEOUT);
          // start loading
          // append to DOM hidden only if needed (not required usually)
          // document.body.appendChild(v); v.style.display = 'none';
          // calling load() sometimes starts network request in some browsers
          v.load();
        } catch (e) {
          // If anything throws, just treat it as done (failed)
          res({ url, ready: false });
        }
      });

    totalRef.current += videos.length;
    return Promise.all(videos.map((u) => createVideoPromise(u).then(() => inc())));
  }, [inc]);

  const preloadThreeFonts = useCallback((threeFonts = []) => {
    const loader = new FontLoader();
    totalRef.current += threeFonts.length;
    return Promise.all(
      threeFonts.map((url) =>
        new Promise((res) => {
          loader.load(url, (font) => { inc(); res(font); }, undefined, () => { inc(); res(null); });
        })
      )
    );
  }, [inc]);

  const preloadCSSFonts = useCallback((fonts = []) => {
    // fonts array like: ['16px "Redcollar"', '16px Inter']
    totalRef.current += fonts.length;
    return Promise.all(
      fonts.map((f) =>
        // use FontFaceSet API when available
        (document.fonts && document.fonts.load ? document.fonts.load(f).then(() => inc()).catch(() => inc()) : Promise.resolve(inc()))
      )
    );
  }, [inc]);

  const preloadChunks = useCallback((chunks = []) => {
    totalRef.current += chunks.length;
    return Promise.all(
      chunks.map((fn) =>
        fn()
          .then(() => { inc(); })
          .catch(() => { inc(); })
      )
    );
  }, [inc]);

  const start = useCallback(async (opts = {}) => {
    loadedRef.current = 0;
    totalRef.current = 0;
    setProgress(0);
    setDone(false);
    setError(null);

    const { models = [], images = [], fonts = [], threeFonts = [], chunks = [], textures = [],videos = [] } = opts;

    try {
      // Start groups in parallel
      await Promise.allSettled([
        preloadImages(images),
        preloadGLTFs(models),
        preloadThreeFonts(threeFonts),
        preloadCSSFonts(fonts),
        preloadChunks(chunks),
        preloadTextures(textures),
        preloadVideos(videos || [], { timeoutMs: 9000 }),
      ]);

      // mark done
      setDone(true);
      setProgress(100);
    } catch (err) {
      setError(err);
    }
  }, [preloadImages, preloadGLTFs, preloadThreeFonts, preloadCSSFonts, preloadChunks, preloadTextures]);

  // small guard: if progress reaches 100 set done
  useEffect(() => {
    if (progress >= 100) setDone(true);
  }, [progress]);

  return { progress, done, error, start };
}
