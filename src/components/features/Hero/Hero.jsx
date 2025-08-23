// src/components/Hero.jsx
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Fox from "./Fox";
import Lights from "./Lights";
import Effects from "./Effects";
import SceneBackground from "./SceneBackground";
import styles from "./styles/hero.module.css";

export default function Hero() {
  const [hover, setHover] = useState(false);

  return (
    <section className={styles.heroFullscreen}>
      {/* Header (DOM on top) */}
      

      {/* Fullscreen Canvas (behind DOM) */}
      <Canvas
        gl={{ antialias: true, alpha: false }}   // alpha:false => opaque canvas (we want scene.background)
        dpr={[1, 2]}
        camera={{
          fov: 13.9,
          near: 0.01,
          far: 100000,
          position: [180, 43, 90],
        }}
        className={styles.canvasFull}
      >
        <Suspense fallback={null}>
          {/* Set the scene background color exactly like your original */}
          <SceneBackground color="#fafafa" />

          <Lights />
          <Fox onHoverChange={(v) => setHover(v)} />
          <OrbitControls
            enableZoom={false}
            enableRotate={false}
            enablePan={false}
            target={[0, 24.65, 0]}
          />
          <Effects hover={hover} />
        </Suspense>
      </Canvas>

      {/* Page DOM content (sits above the canvas) */}
      <div className={styles.heroContent}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            Research. Design.<br />
            Development<span className={styles.dot}>.</span>
          </h1>
          <p className={styles.heroSub}>
            Innovation through extensive research, boundless originality,
            attention to detail & industry leading quality.
          </p>
        </div>
        {/* (Optional: add DOM elements for right side overlay if necessary) */}
      </div>
    </section>
  );
}
