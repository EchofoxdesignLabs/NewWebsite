// src/components/Lights.jsx
import React from "react";

/**
 * Lights component
 *
 * Recreates the lights from your vanilla three.js scene:
 *  - spotLight1 (soft grey, brighter)
 *  - spotLight2 (white, subtle)
 *  - directional light (sun-like)
 *  - point 'fill' light (soft)
 *  - ambient light (global)
 *
 * Props:
 *  - enableShadows: boolean = true  // toggle shadows
 *  - ambientIntensity: number = 2.2
 */
export default function Lights({
  enableShadows = true,
  ambientIntensity = 2.2,
}) {
  return (
    <>
      {/* SpotLight 1 — soft grey key light */}
      <spotLight
        color={0x959595}
        intensity={2}
        distance={240}
        decay={0.1}
        position={[0, 60, 20]}
        castShadow={enableShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        // Small bias to reduce shadow acne
        shadow-bias={-0.0005}
      />

      {/* SpotLight 2 — white fill / rim */}
      <spotLight
        color={0xffffff}
        intensity={1}
        distance={240}
        decay={0.1}
        position={[50, -10, 80]}
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* Directional Light — main sun-like light */}
      <directionalLight
        color={0xffffff}
        intensity={1}
        position={[100, 140, 40]}
        castShadow={enableShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        // Configure directional shadow camera so shadows cover your model area
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-bias={-0.0005}
      />

      {/* Point light as a soft fill */}
      <pointLight
        color={0xffffff}
        intensity={0.2}
        distance={200}
        position={[40, 25, 0]}
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* Ambient (global) light */}
      <ambientLight color={0xffffff} intensity={ambientIntensity} />
    </>
  );
}
