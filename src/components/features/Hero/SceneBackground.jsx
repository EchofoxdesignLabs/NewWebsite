// src/components/SceneBackground.jsx
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function SceneBackground({ color = "#fafafa" }) {
  const { scene } = useThree();
  useEffect(() => {
    const prev = scene.background;
    scene.background = new THREE.Color(color);
    return () => {
      scene.background = prev;
    };
  }, [scene, color]);
  return null;
}
