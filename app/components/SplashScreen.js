'use client';

import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
    
    if (isIOSDevice) {
      onComplete?.();
      return;
    }

    setIsMounted(true);
    
    const loadTimer = setTimeout(() => {
      setAssetsLoaded(true);
    }, 100);

    return () => clearTimeout(loadTimer);
  }, [onComplete]);

  useEffect(() => {
    if (!assetsLoaded) return;

    const fadeOutDuration = 1000; 
    const minDisplayTime = 3400; 
    
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
      
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
        onComplete?.();
      }, fadeOutDuration);
      
      return () => clearTimeout(removeTimer);
    }, minDisplayTime);

    return () => clearTimeout(fadeOutTimer);
  }, [assetsLoaded, onComplete]);

  if (!shouldRender || isIOS || !isMounted) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100% !important',
      height: '100% !important',
      maxWidth: '100vw',
      maxHeight: '100vh',
      zIndex: 9999,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 1s ease-in-out',
      pointerEvents: isVisible ? 'auto' : 'none',
      background: '#0f172a',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <Canvas 
        dpr={[1, 2]}
        gl={{ antialias: true }}
        style={{
          display: 'block',
          position: 'absolute',
          inset: '0',
          width: '100% !important',
          height: '100% !important',
          maxWidth: '100vw',
          maxHeight: '100vh',
          margin: 0,
          padding: 0,
          touchAction: 'none'
        }}
      >
        <SplashScreenScene />
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
    
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        for (let layer = 0; layer < layers; layer++) {
          if (Math.random() > 0.1) {
            const size = 0.01 + Math.random() * 0.9;
            
            cubes.current.push({
              position: [
                (col / columns - 0.5) * 33, 
                (row / rows - 0.5) * 22,    
                -2 - layer * 2 - Math.random() * 3.3, 
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
    
    if (elapsedTime < 3) {
      const progress = elapsedTime / 3; 
      const startX = 0;
      const endX = -0.25;
      const startY = 0;
      const endY = -2.5;
      const startZ = 22;
      const endZ = -14;
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
      <ambientLight intensity={1.9} color={0xffffff}/>
      <directionalLight 
        position={[0, 0, 5]} 
        intensity={1.5}
        castShadow
      />
      <pointLight position={[0, 10, 10]} intensity={4} />

    </>
  );
}