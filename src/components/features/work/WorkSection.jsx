import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import WorkScene from "./WorkScene";
import Overlay from "./Overlay";
import { productsWithData } from "./productsData";
import styles from "./styles/Work.module.css";

export default function WorkSection() {
  const pages = productsWithData.length;
  const sectionRef = useRef(null); // <-- pass section DOM to WorkScene

  return (
    <section
      ref={sectionRef}
      data-work-section
      className={styles.workSectionWrapper}
      style={{ height: `${pages * 100}vh` }}
    >
      {/* Sticky viewport that pins for the duration of the section */}
      <div className={styles.workStickyViewport}>
        {/* 3D Canvas fills the sticky viewport */}
        <div className={styles.workCanvasLayer} aria-hidden="true">
          <Canvas
            gl={{ antialias: true,        // rely on SMAA, saves memory
                alpha: false,
                powerPreference: "high-performance", }}
            dpr={[1, 1.5]}
            camera={{ fov: 24, near: 0.01, far: 100000, position: [0, 5, 20] }}
            onCreated={({ gl }) => gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))}
          >
            {/* pass section element so the scene can decide when to hijack wheel */}
            <WorkScene sectionEl={sectionRef} />
          </Canvas>
        </div>

        {/* Overlay text inside the same sticky viewport */}
        <div className={styles.workOverlaySticky}>
          <Overlay />
        </div>
      </div>

      {/* Anchors to provide N viewports of scroll within this section */}
      <div className={styles.workAnchors}>
        {productsWithData.map((p) => (
          <div key={p.name} className={styles.workAnchor} />
        ))}
      </div>
    </section>
  );
}
