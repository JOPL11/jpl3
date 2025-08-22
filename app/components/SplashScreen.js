'use client';

import { useEffect, useState, useRef } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { useLoading } from '../contexts/LoadingContext';
import GlowingCubes from './GlowingCubes';

// Extend Three.js with post-processing components
extend({ EffectComposer, RenderPass, UnrealBloomPass });

function Scene() {
  const { scene, camera, gl } = useThree();
  const composer = useRef();
  
  // Set the background color #0f172a
  useEffect(() => {
    scene.background = new THREE.Color(0x0f172a); // Dark blue color
  }, [scene]);
  
  // Set up the bloom effect
  useEffect(() => {
    if (!composer.current) return;
    
    const currentComposer = composer.current;
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.15, // strength
      0.2, // radius
      0.05  // threshold
    );
    
    currentComposer.addPass(new RenderPass(scene, camera));
    currentComposer.addPass(bloomPass);
    
    return () => {
      if (currentComposer) {
        currentComposer.passes = [];
      }
    };
  }, [scene, camera]);
  
  // Use the effect composer for rendering
  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1); // Render after the default render pass
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <SplashScreenScene />
      <GlowingCubes />
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
      </effectComposer>
    </>
  );
}

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsMounted(true);
    
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
    
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsLoading(false);
        onComplete?.();
      }, 100);
      return () => clearTimeout(timer);
    }
    
    // Start fade in after a small delay to ensure the component is mounted
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    const loadTimer = setTimeout(() => {
      setAssetsLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(loadTimer);
    };
  }, [onComplete, setIsLoading]);

  useEffect(() => {
    if (!assetsLoaded || isIOS) return;
    
    const fadeOutDuration = 2000; 
    const minDisplayTime = 4000; 
    
    const fadeOutTimer = setTimeout(() => {
      // Start fade out
      setIsVisible(false);
      
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
        setIsLoading(false);
        onComplete?.();
      }, fadeOutDuration);
      
      return () => clearTimeout(removeTimer);
    }, minDisplayTime);

    return () => clearTimeout(fadeOutTimer);
  }, [assetsLoaded, isIOS, onComplete, setIsLoading]);

  if (!shouldRender || isIOS || !isMounted) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 1s ease-in-out',
      pointerEvents: isVisible ? 'auto' : 'none',
    }}>
      <Canvas 
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

function SplashScreenScene() {
  const meshRef = useRef();
  const cameraRef = useRef();
  //const gradientTexture = useTexture('/images/jp.svg');
  const animationStarted = useRef(false);
  const startTime = useRef(0);
  
  const cubes = useRef([]);
  
  if (cubes.current.length === 0) {
    const columns = 15;
    const rows = 21;
    const layers = 5;
    const zSpacing = 11.0; // Increased from implicit ~2.0 to 3.0
    
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        for (let layer = 0; layer < layers; layer++) {
          if (Math.random() > 0.1) {
            const size = 0.01 + Math.random() * 0.9;
            
            cubes.current.push({
              position: [
                (col / columns - 0.5) * 33, 
                (row / rows - 0.5) * 22,    
                -2 - layer * zSpacing - Math.random() * 6.3, 
              ],
              size: size,
            });
          }
        }
      }
    }
  }

  useFrame(({ clock, camera }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
    
    if (!animationStarted.current) {
      animationStarted.current = true;
      startTime.current = clock.getElapsedTime();
      return;
    }
    
    const elapsedTime = clock.getElapsedTime() - startTime.current;
    
    if (elapsedTime < 4) {
      const progress = elapsedTime / 4; 
      const startX = 0;
      const endX = -0.25;
      const startY = 0;
      const endY = -2.5;
      const startZ = 20;
      const endZ = -60;
      camera.position.x = startX + (endX - startX) * progress;
      camera.position.y = startY + (endY - startY) * progress;
      camera.position.z = startZ + (endZ - startZ) * progress;
    }
  });

  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={[0, 0, 22]} 
        fov={75}
        zoom={1} 
      />
      
      <ambientLight intensity={0.3} />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
      />
      
      
      {cubes.current.map((cube, index) => (
        <mesh
          key={index}
          position={cube.position}
        >
          <boxGeometry args={[cube.size, cube.size, cube.size]} />
          <meshStandardMaterial 
            color="#63b3ed" 
            metalness={0.9}  
            roughness={0.2}  
            envMapIntensity={1}
          />
        </mesh>
      ))}
      <ambientLight intensity={1.1} color={0xffffff}/>
      <directionalLight 
        position={[0, 0, 5]} 
        intensity={1.1}
        castShadow
      />
      <pointLight position={[0, 10, 10]} intensity={4} />

    </>
  );
}