// src/components/Fox.jsx
import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

/**
 * Fox component
 * Props:
 *  - onHoverChange?: (isHovered: boolean) => void
 *  - position / scale can be controlled via restProps if needed
 */
export default function Fox({ onHoverChange, ...restProps }) {
  const group = useRef(null);

  // load gltf and animations
  const { scene: gltfScene, animations } = useGLTF("/assets/models/fox24.glb");
  const { actions, mixer } = useAnimations(animations, group);

  const { camera, scene } = useThree();

  // interaction helpers
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // smoothing / targets
  const rawTarget = useRef(new THREE.Vector3(60, 110, 91));
  const smoothTarget = useRef(new THREE.Vector3(60, 120, 91));
  const SMOOTH_FACTOR = 0.02;

  const interSectionPoint = useRef(new THREE.Vector3());
  const planeNormal = useRef(new THREE.Vector3());
  const plane = useRef(new THREE.Plane());

  const headBoneRef = useRef(null);

  // hover state
  const isHoveredRef = useRef(false);
  const [, setHoverState] = useState(false); // local React state only if consumers need re-render

  // --- mapping settings (copied from your vanilla code) ---
  const outMin = 60;
  const outMax = 80;
  const inMin = 130;
  const inMax = 150;
  const inMinY = 35;
  const inMaxY = 58;
  const outMinY = 60;
  const outMaxY = 110;

  // Setup GLTF scene, material, animations, pointer handlers
  useEffect(() => {
    if (!gltfScene) return;

    // SINGLE white material reused across meshes to reduce allocations
    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 1,
    });

    // Replace all mesh materials with whiteMaterial and enable shadows if desired
    gltfScene.traverse((child) => {
      if (child.isMesh) {
        child.material = whiteMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // position + scale (tweak X to frame the fox on the right)
    // If you want the fox more to the right, change X (e.g. 85..95)
    gltfScene.position.set(50, 17, 0); 
    gltfScene.scale.set(6, 6, 6);

    // attach to our group (returned in JSX)
    if (group.current) {
      group.current.add(gltfScene);
    }

    // find the bone that controls the head (name from your GLTF)
    headBoneRef.current = gltfScene.getObjectByName("spine011_metarig");

    // start animations and snapshot actions for safe cleanup
    const localActions = actions ? { ...actions } : null;
    if (localActions) {
      Object.values(localActions).forEach((action) => {
        if (action && typeof action.play === "function") {
          action.timeScale = 0.5; // idle speed
          action.play();
        }
      });
    }

    // pointermove => project to plane and compute rawTarget
    const onPointerMove = (event) => {
      // normalized device coords
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Build a plane that faces the camera (same approach as your vanilla code)
      planeNormal.current.copy(camera.position).normalize();
      const planeTargetPoint = new THREE.Vector3(100, 100, 100).add(
        scene?.position || new THREE.Vector3()
      );
      plane.current.setFromNormalAndCoplanarPoint(planeNormal.current, planeTargetPoint);

      // Raycast and intersect plane to get a 3D point
      raycaster.current.setFromCamera(mouse.current, camera);
      raycaster.current.ray.intersectPlane(plane.current, interSectionPoint.current);

      const rawX = interSectionPoint.current.x;
      const rawY = interSectionPoint.current.y;

      // mapping + clamping (preserve exact behavior)
      const mappedY = THREE.MathUtils.mapLinear(rawY, inMinY, inMaxY, outMinY, outMaxY);
      const clampedY = THREE.MathUtils.clamp(mappedY, outMinY, outMaxY);

      const mappedX = THREE.MathUtils.mapLinear(rawX, inMin, inMax, outMin, outMax);
      const clampedX = THREE.MathUtils.clamp(mappedX, outMin, outMax);

      rawTarget.current.set(clampedX, clampedY, interSectionPoint.current.z);

      // Raycast against model to detect hover
      if (group.current) {
        const intersects = raycaster.current.intersectObject(group.current, true);
        const currentlyHovered = intersects.length > 0;
        if (currentlyHovered !== isHoveredRef.current) {
          isHoveredRef.current = currentlyHovered;

          // update animation speed on hover
          if (mixer) {
            try {
              mixer.timeScale = currentlyHovered ? 1.5 : 0.5;
            } catch (e) {
              // swallow if mixer not ready
            }
          }

          // notify parent and update local state
          setHoverState(currentlyHovered);
          if (typeof onHoverChange === "function") onHoverChange(currentlyHovered);
        }
      }
    };

    // attach the pointer listener
    window.addEventListener("pointermove", onPointerMove);

    // CLEANUP: remove listener, stop actions safely, remove scene and dispose material
    return () => {
      window.removeEventListener("pointermove", onPointerMove);

      if (localActions) {
        Object.values(localActions).forEach((action) => {
          if (action && typeof action.stop === "function") {
            try {
              action.stop();
            } catch (e) {
              // ignore
            }
          }
        });
      }

      if (mixer && typeof mixer.stopAllAction === "function") {
        try {
          mixer.stopAllAction();
        } catch (e) {
          // ignore
        }
      }

      // remove the gltfScene from the group to avoid duplicate nodes on remount
      if (group.current && gltfScene) {
        group.current.remove(gltfScene);
      }

      // dispose shared material
      try {
        whiteMaterial.dispose();
      } catch (e) {
        // ignore disposal error
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltfScene, actions, camera, scene, mixer]);

  // Per-frame updates: animations and head bone smoothing
  useFrame((state, delta) => {
    // update animation mixer
    if (mixer) {
      try {
        mixer.update(delta);
      } catch (e) {
        // ignore temporary mixer errors
      }
    }

    // smooth lookAt for the head bone
    if (headBoneRef.current) {
      smoothTarget.current.lerp(rawTarget.current, SMOOTH_FACTOR);

      // apply lookAt - headBoneRef is in world-space of the gltfScene,
      // lookAt expects world coordinates
      headBoneRef.current.lookAt(smoothTarget.current);

      // corrective rotation as in your original vanilla code
      headBoneRef.current.rotateX(Math.PI / 2);
    }
  });

  // Render group (the actual glTF scene is attached to group.current by useEffect)
  return <group ref={group} {...restProps} />;
}
