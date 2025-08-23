// // CameraRig.jsx
// import React, { useRef, useEffect, useState } from 'react';
// import { useThree } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { useProjectStore } from './useProjectStore';
// import { EffectComposer, SMAA, DepthOfField } from '@react-three/postprocessing';
// import * as THREE from 'three';
// import gsap from 'gsap';

// /**
//  * CameraRig
//  *
//  * - Animates camera.position and controls.target when the current product index changes.
//  * - Optionally animates DepthOfField focus distance (enableDOF prop).
//  *
//  * Notes:
//  *   - DepthOfField is disabled by default (enableDOF=false). Toggle true only for final polish.
//  *   - GSAP timeline is used for smooth camera transitions.
//  */

// export default function CameraRig({ enableDOF = false }) {
//   const { camera } = useThree();
//   const controlsRef = useRef();
//   const projects = useProjectStore((s) => s.projects);
//   const currentIndex = useProjectStore((s) => s.currentTargetIndex);
//   const [focusDistance, setFocusDistance] = useState(10);

//   useEffect(() => {
//     if (!projects || projects.length === 0) return;
//     if (!controlsRef.current) return;

//     const project = projects[currentIndex];
//     if (!project || !project.object) return;

//     // Get world position of the target object and add optional offset
//     const targetPos = new THREE.Vector3();
//     try {
//       project.object.getWorldPosition(targetPos);
//     } catch (e) {
//       // in case object is not yet ready
//       console.warn('CameraRig: object.getWorldPosition error', e);
//     }

//     if (project.targetOffset) {
//       targetPos.add(new THREE.Vector3(...project.targetOffset));
//     }

//     // Desired camera position (from data) - fallback to current camera if absent
//     const camPos = project.cameraPosition
//       ? new THREE.Vector3(...project.cameraPosition)
//       : camera.position.clone();

//     // Animate camera + controls target
//     const tl = gsap.timeline();
//     tl.to(camera.position, {
//       x: camPos.x,
//       y: camPos.y,
//       z: camPos.z,
//       duration: 1.2,
//       ease: 'power2.out',
//       onUpdate: () => {
//         // ensure camera matrices update while GSAP mutates values
//         camera.updateMatrixWorld();
//       },
//     }, 0);

//     tl.to(controlsRef.current.target, {
//       x: targetPos.x,
//       y: targetPos.y,
//       z: targetPos.z,
//       duration: 1.2,
//       ease: 'power2.out',
//       onUpdate: () => {
//         controlsRef.current.update();
//       },
//     }, 0);

//     // If DOF enabled, animate focus distance to distance(camera, target)
//     if (enableDOF) {
//       const focusProxy = { value: camera.position.distanceTo(targetPos) };
//       tl.to(focusProxy, {
//         value: camera.position.distanceTo(targetPos),
//         duration: 1.2,
//         ease: 'power2.out',
//         onUpdate: () => setFocusDistance(focusProxy.value),
//       }, 0);
//     }

//     return () => {
//       tl.kill();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentIndex, projects, camera]);

//   return (
//     <>
//       <OrbitControls
//         ref={controlsRef}
//         enableZoom={false}
//         enablePan={false}
//         enableRotate={false}
//       />
//       <EffectComposer disableNormalPass={true}>
//         <SMAA />
//         {/* DepthOfField is expensive — disabled by default via enableDOF prop */}
//         {enableDOF && (
//           <DepthOfField
//             focusDistance={focusDistance}
//             focalLength={0.02}
//             bokehScale={1.6}
//             height={480}
//           />
//         )}
//       </EffectComposer>
//     </>
//   );
// }
