// // import React, { useRef, useEffect, useState, useLayoutEffect, useCallback } from "react";
// // import styles from "./styles/Work.module.css";
// // import * as THREE from "three";
// // // FIXED: Corrected the main library import
// // import { Canvas, useFrame, useThree } from "@react-three/fiber";
// // import { OrbitControls } from "@react-three/drei";
// // import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// // import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// // import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// // import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// // import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
// // import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
// // import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
// // import gsap from "gsap";
// // import { productsWithData } from "./productsData";

// // /**
// //  * The 3D Scene content. All imperative Three.js logic is encapsulated here.
// //  */
// // function SceneContent({ setTextState }) {
// //   const { gl, camera, scene, size } = useThree();
// //   const controlsRef = useRef();
// //   const parallaxGroupRef = useRef(new THREE.Group());

// //   // Refs to hold mutable values without causing re-renders
// //   const composerRef = useRef();
// //   const bokehPassRef = useRef();
// //   const productTargetsRef = useRef([]);
// //   const currentIndexRef = useRef(0);
// //   const isAnimatingRef = useRef(false);
// //   const isHijackedRef = useRef(false);
// //   const mouseRef = useRef(new THREE.Vector2());
// //   const baseCameraPosRef = useRef(new THREE.Vector3());

// //   // Initial Scene Setup
// //   useLayoutEffect(() => {
// //     scene.background = new THREE.Color(0x111111);
// //     scene.fog = new THREE.Fog(0x111111, 10, 80);
// //     scene.add(new THREE.AmbientLight(0xffffff, 2.2));
// //     scene.add(parallaxGroupRef.current);
// //     baseCameraPosRef.current.copy(camera.position);
// //   }, [scene, camera]);

// //   // Post-processing Setup
// //   useEffect(() => {
// //     const composer = new EffectComposer(gl);
// //     const renderPass = new RenderPass(scene, camera);
// //     composer.addPass(renderPass);
// //     const bokehPass = new BokehPass(scene, camera, { focus: 60.0, aperture: 0.00005, maxblur: 0.006 });
// //     composer.addPass(bokehPass);
// //     const smaaPass = new SMAAPass(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio());
// //     composer.addPass(smaaPass);
// //     const outputPass = new OutputPass();
// //     composer.addPass(outputPass);
// //     composerRef.current = composer;
// //     bokehPassRef.current = bokehPass;

// //     return () => { composer.dispose(); };
// //   }, [gl, scene, camera, size]);

// //   // IMPROVEMENT: Wrap the main animation function in useCallback
// //   // This prevents it from being recreated on every render and ensures
// //   // other useEffects that depend on it don't run unnecessarily.
// //   const focusCameraOnTarget = useCallback((index, duration = 1) => {
// //     if (isAnimatingRef.current && duration > 0) return;
// //     isAnimatingRef.current = true;
// //     setTextState((s) => ({ ...s, visible: false }));

// //     const targetData = productTargetsRef.current[index];
// //     const { object, targetOffset, cameraPosition } = targetData;
// //     const targetPos = new THREE.Vector3();
// //     object.getWorldPosition(targetPos).add(new THREE.Vector3(...targetOffset));
// //     const camPos = new THREE.Vector3(...cameraPosition);
// //     const focusDistance = camPos.distanceTo(targetPos);

// //     gsap.timeline({
// //       onComplete: () => {
// //         baseCameraPosRef.current.copy(camPos);
// //         setTextState({ ...targetData, visible: true });
// //         setTimeout(() => (isAnimatingRef.current = false), 500);
// //       },
// //     })
// //     .to(camera.position, { ...camPos, duration, ease: "power2.out" }, 0)
// //     .to(controlsRef.current.target, { ...targetPos, duration, ease: "power2.out" }, 0)
// //     .to(bokehPassRef.current.uniforms.focus, { value: focusDistance, duration, ease: "power2.out" }, 0);
// //   }, [camera, setTextState]); // Dependencies for the callback

// //   // Model Loading
// //   useEffect(() => {
// //     const loader = new GLTFLoader();
// //     const dracoLoader = new DRACOLoader();
// //     dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
// //     loader.setDRACOLoader(dracoLoader);

// //     loader.load("assets/models/bakedfinal25.glb", (gltf) => {
// //       const model = gltf.scene;
// //       model.scale.set(5, 5, 5);
// //       const names = productsWithData.map((p) => p.name);
// //       model.traverse((child) => {
// //         const productData = productsWithData.find((p) => p.name === child.name);
// //         if (productData) {
// //           productTargetsRef.current.push({ object: child, ...productData });
// //         }
// //       });
// //       productTargetsRef.current.sort((a, b) => names.indexOf(a.name) - names.indexOf(b.name));
// //       parallaxGroupRef.current.add(model);
// //       if (productTargetsRef.current.length > 0) {
// //         focusCameraOnTarget(0, 0);
// //       }
// //     });
// //     return () => { dracoLoader.dispose(); };
// //   }, [focusCameraOnTarget]); // FIXED: Added dependency

// //   // Event Listeners and Animation Loop
// //   useEffect(() => {
// //     const onMouseMove = (event) => {
// //       mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
// //       mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
// //     };
// //     const onWheel = (event) => {
// //       if (!isHijackedRef.current) return;
// //       const scrollDirection = event.deltaY > 0 ? 1 : -1;
// //       const isAtFirst = currentIndexRef.current === 0;
// //       const isAtLast = currentIndexRef.current === productTargetsRef.current.length - 1;
// //       if ((isAtFirst && scrollDirection === -1) || (isAtLast && scrollDirection === 1)) return;
// //       event.preventDefault();
// //       if (isAnimatingRef.current) return;
// //       currentIndexRef.current += scrollDirection;
// //       focusCameraOnTarget(currentIndexRef.current, 1.2);
// //     };
// //     const canvas = gl.domElement;
// //     const observer = new IntersectionObserver(([entry]) => { isHijackedRef.current = entry.isIntersecting; }, { threshold: 0.5 });
    
// //     observer.observe(canvas);
// //     window.addEventListener("mousemove", onMouseMove);
// //     canvas.addEventListener("wheel", onWheel, { passive: false });
// //     return () => {
// //       observer.disconnect();
// //       window.removeEventListener("mousemove", onMouseMove);
// //       canvas.removeEventListener("wheel", onWheel);
// //     };
// //   }, [gl, focusCameraOnTarget]); // FIXED: Added dependency

// //   useFrame((state, delta) => {
// //     if (!isAnimatingRef.current) {
// //       const pf = 4;
// //       const targetX = baseCameraPosRef.current.x + mouseRef.current.x * pf;
// //       const targetY = baseCameraPosRef.current.y + mouseRef.current.y * pf;
// //       camera.position.x += (targetX - camera.position.x) * 0.05;
// //       camera.position.y += (targetY - camera.position.y) * 0.05;
// //     }
// //     controlsRef.current?.update();
// //     composerRef.current?.render(delta);
// //   }, 1);

// //   return <OrbitControls ref={controlsRef} enableDamping enableZoom={false} enableRotate={false} enablePan={false} />;
// // }


// // export default function Work() {
// //   const [textState, setTextState] = useState({
// //     title: "", category: "", description: "", link: "#", visible: false,
// //   });

// //   return (
// //     <section className={styles.workWrapper}>
// //       <Canvas
// //         gl={{ antialias: true, alpha: false }} // alpha: false is better for performance with post-processing
// //         camera={{ fov: 24, near: 0.01, far: 100000, position: [0, 5, 20] }}
// //       >
// //         <SceneContent setTextState={setTextState} />
// //       </Canvas>
// //       <div className={styles.textOverlay}>
// //         <div className={`${styles.textContent} ${textState.visible ? styles.isVisible : ""}`}>
// //           <p className={styles.productCategory}>{textState.category}</p>
// //           <h1 className={styles.productTitle}>{textState.title}</h1>
// //           <p className={styles.productDescription}>{textState.description}</p>
// //           <a href={textState.link || "#"} className={styles.exploreLink} target="_blank" rel="noopener noreferrer">
// //             Explore
// //           </a>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }


// // src/features/work/Work.jsx - Main Component
// import React, { Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { ScrollControls } from '@react-three/drei';
// import Scene from './Scene';
// import Overlay from './Overlay';
// import { productsWithData } from './productsData';
// import styles from './styles/Work.module.css';

// export default function Work() {
//   return (
//     <section className={styles.workWrapper}>
//       <Canvas
//         gl={{ 
//           antialias: true, 
//           alpha: false,
//           powerPreference: "high-performance", // Better GPU performance
//           stencil: false, // Disable stencil buffer if not needed
//           depth: true
//         }}
//         camera={{ fov: 24, near: 0.01, far: 100000, position: [0, 5, 20] }}
//         dpr={Math.min(window.devicePixelRatio, 2)} // Cap pixel ratio for performance
//       >
//         <Suspense fallback={null}>
//           <ScrollControls 
//             pages={productsWithData.length} 
//             damping={0.1} // Reduced for smoother scroll
//             maxSpeed={0.5} // Prevent too fast scrolling
//           >
//             <Scene />
//           </ScrollControls>
//         </Suspense>
//       </Canvas>
//       <Overlay />
//     </section>
//   );
// }