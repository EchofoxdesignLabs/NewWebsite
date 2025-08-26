import { useGLTF, useTexture } from "@react-three/drei";
import { SERVICES_COLUMNS } from "../components/features/sevices/ServiceColumns"; // Adjust path if needed

// This function's only job is to trigger the download of all critical assets.
export function preloadAssets() {
  // Preload the heavy 3D models
  useGLTF.preload("/assets/models/fox24.glb");
  useGLTF.preload("/assets/models/bakedfinal25.glb");

  // Preload the font for the 3D text in the footer
  // Note: useFont doesn't have a preload method, but it is cached. 
  // Loading the GLTF that uses it effectively preloads it too.

  // Preload all hover images from the Services section
  const serviceImages = SERVICES_COLUMNS.flatMap((c) => c.items.map((i) => i.image));
  useTexture.preload(serviceImages);

  // Add any other critical images you want in the loading screen here
  // For example:
  // useTexture.preload(['/images/showreel-poster.jpg']);
}