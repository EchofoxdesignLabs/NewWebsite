// src/features/work/Scene.jsx - Optimized Scene Component
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useScroll, OrbitControls } from '@react-three/drei';
import { EffectComposer, DepthOfField, SMAA } from '@react-three/postprocessing';
import { productsWithData } from './productsData';
import { useProjectStore } from './useProjectStore';
import * as THREE from 'three';
import gsap from 'gsap';

function Model() {
  const { scene } = useGLTF('/assets/models/bakedfinal25.glb');
  const setProjects = useProjectStore((state) => state.setProjects);
  
  useEffect(() => {
    const projectNames = productsWithData.map(p => p.name);
    const targetObjects = [];
    
    scene.traverse((child) => {
      if (projectNames.includes(child.name)) {
        targetObjects.push(child);
        // Optimize materials for performance
        if (child.material) {
          child.material.precision = 'lowp';
          if (child.material.map) {
            child.material.map.generateMipmaps = false;
          }
        }
      }
    });
    
    setProjects(targetObjects);
  }, [scene, setProjects]);
  
  return <primitive object={scene} scale={5} />;
}

function CameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef();
  const [focusDistance, setFocusDistance] = useState(0);
  const animationRef = useRef(null);
  
  const projects = useProjectStore((state) => state.projects);
  const currentIndex = useProjectStore((state) => state.currentTargetIndex);
  
  useEffect(() => {
    if (projects.length === 0 || !controlsRef.current) return;
    
    // Kill any existing animation to prevent conflicts
    if (animationRef.current) {
      animationRef.current.kill();
    }
    
    const { object, targetOffset, cameraPosition } = projects[currentIndex];
    const targetPos = new THREE.Vector3();
    object.getWorldPosition(targetPos).add(new THREE.Vector3(...targetOffset));
    const camPos = new THREE.Vector3(...cameraPosition);
    
    const focusProxy = { value: focusDistance };

    animationRef.current = gsap.timeline()
      .to(camera.position, { 
        ...camPos, 
        duration: 1.0, // Slightly faster for smoother experience
        ease: 'power2.out' 
      }, 0)
      .to(controlsRef.current.target, { 
        ...targetPos, 
        duration: 1.0, 
        ease: 'power2.out' 
      }, 0)
      .to(focusProxy, {
        value: camPos.distanceTo(targetPos),
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => setFocusDistance(focusProxy.value),
      }, 0);

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [currentIndex, projects, camera, focusDistance]);

  return (
    <>
      <OrbitControls 
        ref={controlsRef} 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
      <EffectComposer>
        <SMAA />
        <DepthOfField 
          focusDistance={focusDistance} 
          focalLength={0.02} 
          bokehScale={2} 
          height={480} 
        />
      </EffectComposer>
    </>
  );
}

export default function Scene() {
  const scroll = useScroll();
  const setCurrentTargetIndex = useProjectStore((state) => state.setCurrentTargetIndex);
  const lastIndexRef = useRef(-1);
  
  // Throttle scroll updates for better performance
  const throttledUpdate = useMemo(() => {
    let lastTime = 0;
    return (callback) => {
      const now = Date.now();
      if (now - lastTime >= 16) { // ~60fps
        lastTime = now;
        callback();
      }
    };
  }, []);

  useFrame(() => {
    throttledUpdate(() => {
      // Improved scroll calculation with better boundary handling
      const totalPages = productsWithData.length;
      const scrollProgress = scroll.offset;
      
      // Calculate current page with better boundary conditions
      let currentPage;
      if (scrollProgress <= 0) {
        currentPage = 0;
      } else if (scrollProgress >= 1) {
        currentPage = totalPages - 1;
      } else {
        // Use a more precise calculation with proper rounding
        const rawPage = scrollProgress * (totalPages - 1);
        currentPage = Math.round(rawPage);
      }
      
      // Only update if the index has actually changed
      if (currentPage !== lastIndexRef.current) {
        lastIndexRef.current = currentPage;
        setCurrentTargetIndex(currentPage);
      }
    });
  });

  return (
    <>
      <ambientLight intensity={2.2} />
      <fog attach="fog" args={['#111111', 10, 80]} />
      <Model />
      <CameraRig />
    </>
  );
}

// Preload with error handling
useGLTF.preload('/assets/models/bakedfinal25.glb');