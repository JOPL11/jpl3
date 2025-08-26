'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Enhanced iOS detection with more device patterns and debug logging
const isIOS = () => {
  if (typeof window === 'undefined' || !window.navigator) {
    console.log('isIOS: Not in browser environment');
    return false;
  }
  
  const userAgent = window.navigator.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  // Enhanced debug logs
  console.log('Logo3DWrapper state:', {
    isIOSDevice,
    hasInteracted: false,
    webGLAvailable: false,
    windowDefined: typeof window !== 'undefined',
    navigatorDefined: typeof window !== 'undefined' && !!window.navigator,
    userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'N/A'
  });
  
  return isIOSDevice;
};

const Logo3D = dynamic(
  () => new Promise(resolve => 
    setTimeout(() => resolve(import('./Logo3D')), 2800)
  ),
  { ssr: false, loading: () => <div style={{ width: '250px', height: '250px' }} /> }
);

const Logo2D = dynamic(
  () => import('./Logo2D').then(mod => mod.default),
  { ssr: false, loading: () => <div style={{ width: 250, height: 250 }} /> }
);

export default function Logo3DWrapper() {
  console.log('Logo3DWrapper: Component mounting');
  const [hasWebGL, setHasWebGL] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isIOSDevice = isIOS();
  
  console.log('Logo3DWrapper: Initial state', {
    isIOSDevice,
    hasInteracted,
    hasWebGL,
    userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'N/A'
  });

  // Handle interaction on iOS
  useEffect(() => {
    console.log('Logo3DWrapper: Setting up interaction handlers');
    if (!isIOSDevice) {
      console.log('Logo3DWrapper: Not an iOS device, skipping interaction setup');
      return;
    }
    
    const handleInteraction = (event) => {
      console.log('Interaction detected:', {
        type: event.type,
        target: event.target?.tagName,
        currentTarget: event.currentTarget?.tagName,
        timestamp: Date.now()
      });
      setHasInteracted(true);
    };
    
    const events = [
      'mousedown', 
      'touchstart', 
      'click', 
      'keydown', 
      'scroll',
      'pointerdown',
      'touchend'
    ];
    
    console.log('Setting up interaction listeners for iOS');
    
    // Add event listeners with capture phase
    events.forEach(event => {
      try {
        document.addEventListener(event, handleInteraction, { 
          capture: true, 
          passive: true, 
          once: true 
        });
        console.log(`Added ${event} listener`);
      } catch (error) {
        console.error(`Error adding ${event} listener:`, error);
      }
    });
    

    return () => {
      console.log('Cleaning up interaction listeners');
      const events = ['mousedown', 'touchstart', 'click', 'keydown', 'scroll', 'pointerdown', 'touchend'];
      events.forEach(event => {
        try {
          document.removeEventListener(event, handleInteraction, { 
            capture: true, 
            passive: true 
          });
        } catch (error) {
          console.error(`Error removing ${event} listener:`, error);
        }
      });
    };
  }, [isIOSDevice]);
  
  // Debug log the current state
  useEffect(() => {
    console.log('Logo3DWrapper state:', { isIOSDevice, hasInteracted, hasWebGL });
  }, [isIOSDevice, hasInteracted, hasWebGL]);

  // Determine which logo to show
  const show3DLogo = !isIOSDevice || (isIOSDevice && hasInteracted && hasWebGL);
  
  console.log('Logo3DWrapper: Rendering decision', {
    isIOSDevice,
    hasInteracted,
    hasWebGL,
    show3DLogo
  });

  // Handle WebGL detection
  useEffect(() => {
    console.log('Logo3DWrapper: Setting up WebGL detection');
    if (typeof window === 'undefined') {
      console.log('Logo3DWrapper: Skipping WebGL detection (server-side)');
      return;
    }
    
    const checkWebGL = () => {
      console.log('Logo3DWrapper: Checking WebGL support');
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setHasWebGL(!!gl);
      } catch (e) {
        setHasWebGL(false);
      }
    };
    checkWebGL();
  }, [isIOSDevice]);

  // Show loading state while checking conditions
  if (isIOSDevice && !hasInteracted) {
    console.log('Rendering 2D logo - waiting for interaction');
    return <Logo2D />;
  }

  if (!hasWebGL) {
    console.log('WebGL not available, falling back to 2D logo');
    return <Logo2D />;
  }

  console.log('Rendering 3D logo');
  return (
    <Suspense fallback={<div style={{ width: 250, height: 250 }}>Loading 3D...</div>}>
      <Logo3D />
    </Suspense>
  );
}
