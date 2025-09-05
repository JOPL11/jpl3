'use client';

import { useEffect, useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

import { useLoading } from '../contexts/LoadingContext';

// Extend Three.js with post-processing components


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
      }, 10);
      return () => clearTimeout(timer);
    }
    
    // Start fade in after a small delay to ensure the component is mounted
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    const loadTimer = setTimeout(() => {
      setAssetsLoaded(true);
    }, 10);
    
    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(loadTimer);
    };
  }, [onComplete, setIsLoading]);

  useEffect(() => {
    if (!assetsLoaded || isIOS) return;
    
    const fadeOutDuration = 20; 
    const minDisplayTime = 10; 
    
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

      </Canvas>
    </div>
  );
}

function SplashScreenScene() {



  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={[0, 0, 22]} 
        fov={75}
        zoom={1} 
      />
    </>
  );
}