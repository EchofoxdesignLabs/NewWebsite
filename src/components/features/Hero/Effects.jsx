// src/components/Effects.jsx
import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  EffectComposer
} from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { AnaglyphShader } from "../../../shaders/AnaglyphShader";
import { WhiteOverlayShader } from "../../../shaders/WhiteOverlayShader";
import * as THREE from "three";

/**
 * Effects
 * Props:
 *  - hover: boolean  // controls intensity of the anaglyph effect
 */
export default function Effects({ hover = false }) {
  const composerRef = useRef();
  const anaglyphRef = useRef();
  const overlayRef = useRef();
  const { gl, scene, camera, size } = useThree();

  // Create composer on mount
  useEffect(() => {
    // Important: use the same canvas/context as R3F
    const composer = new EffectComposer(gl);
    composer.setSize(size.width, size.height);
    composerRef.current = composer;

    // Render pass (scene -> composer)
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Anaglyph / color-shift pass
    const anaglyphPass = new ShaderPass(AnaglyphShader);
    composer.addPass(anaglyphPass);
    anaglyphRef.current = anaglyphPass;

    // White overlay pass
    const overlayPass = new ShaderPass(WhiteOverlayShader);
    overlayPass.uniforms.opacity.value = 0.3;
    composer.addPass(overlayPass);
    overlayRef.current = overlayPass;

    // Ensure composer uses same pixel ratio as R3F canvas for crispness
    composer.setPixelRatio(Math.min(gl.getPixelRatio(), 2));

    // Cleanup on unmount
    return () => {
      try {
        composer.dispose();
      } catch (err) {
        // ignore
      }
      composerRef.current = null;
      anaglyphRef.current = null;
      overlayRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);

  // Resize handler: keep composer sized to canvas
  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
  }, [size.width, size.height]);

  // useFrame: update uniforms and render composer
  useFrame((state, delta) => {
    if (!composerRef.current) return;

    // Smoothly interpolate intensity toward target
    const targetIntensity = hover ? 2.5 : 0.0;
    if (anaglyphRef.current) {
      const cur = anaglyphRef.current.uniforms.intensity.value;
      // lerp with a smoothing factor similar to your original (.1 in animate)
      anaglyphRef.current.uniforms.intensity.value = cur + (targetIntensity - cur) * 0.1;
    }

    // If you want to animate overlay opacity dynamically, do it here:
    if (overlayRef.current) {
      overlayRef.current.uniforms.opacity.value = 0.2; // or lerp to some target
    }

    // Render the composer instead of the default renderer output
    composerRef.current.render(delta);
    // Prevent R3F from also auto-rendering the scene. This is a commonly used pattern:
    // R3F performs the default render at priority 0; this composer renders at the end of the frame here.
    // We don't explicitly stop the R3F render — in practice calling composer.render here replaces the final pixels.
  }, 1); // run at a slightly later priority to ensure scene objects are updated first

  return null; // no actual JSX, this component only manages postprocessing
}
