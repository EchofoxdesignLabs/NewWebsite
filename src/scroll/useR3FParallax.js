import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useScrollState } from "./ScrollProvider";

/**
 * Apply scroll-based parallax to a THREE.Object3D (group) or camera.
 * opts:
 *  - targetRef?: ref to a group (if omitted, uses camera)
 *  - strength: { x?:number, y?:number, z?:number } offsets per 1000px
 *  - lerp: smoothing 0..1 (0.1–0.2 feels nice)
 */
export function useR3FParallax({ targetRef, strength = { x:0, y:0.2, z:0 }, lerp = 0.12 } = {}) {
  const { camera } = useThree();
  const { y, rm } = useScrollState();
  const last = useRef({ x:0, y:0, z:0 });

  useEffect(() => {
    const obj = targetRef?.current || camera;
    if (!obj || rm) return;

    const tx = (y / 1000) * (strength.x || 0);
    const ty = (y / 1000) * (strength.y || 0);
    const tz = (y / 1000) * (strength.z || 0);

    last.current.x = last.current.x + (tx - last.current.x) * lerp;
    last.current.y = last.current.y + (ty - last.current.y) * lerp;
    last.current.z = last.current.z + (tz - last.current.z) * lerp;

    obj.position.x += (last.current.x - obj.position.x) * lerp;
    obj.position.y += (last.current.y - obj.position.y) * lerp;
    obj.position.z += (last.current.z - obj.position.z) * lerp;
  }, [y, rm, lerp, strength.x, strength.y, strength.z, targetRef]); // runs with provider updates
}
