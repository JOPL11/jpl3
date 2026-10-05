'use client';

import { useEffect, useState, memo, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// iOS detection function
const checkIfIOS = () => {
  if (typeof window === 'undefined' || !window.navigator) {
    return false;
  }
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// Memoized 2D logo component
const Logo2D = memo(() => (
  <div style={{ width: 250, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Image 
      src="/images/jp.svg" 
      alt="JP Logo 2D" 
      width={250}
      height={250}
      priority
    />
  </div>
));
Logo2D.displayName = 'Logo2D';
// Lazy load 3D component with fallback
const Logo3D = dynamic(
  () => import('./Logo3D'),
  { 
    ssr: false,
    loading: () => <div style={{ width: '100vw', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading 3D...</div>
  }
);

// Quick rollback switch: set to true to restore the old behaviour (2D image on iOS).
const FORCE_2D_ON_IOS = false;

const Logo3DWrapper = memo(function Logo3DWrapper() {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const handleContextLost = useCallback(() => setContextLost(true), []);

  // Check WebGL support
  const checkWebGL = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const ok = !!gl;
      // Release the probe context right away; iOS only allows a handful of live contexts
      gl?.getExtension?.('WEBGL_lose_context')?.loseContext();
      return ok;
    } catch (e) {
      return false;
    }
  }, []);

  // Initialize component
      useEffect(() => {
        // Set iOS device status
        const iosStatus = checkIfIOS();
        setIsIOSDevice(iosStatus);
        
        // Check WebGL on every device (iOS included now)
        const webglStatus = checkWebGL();
        setHasWebGL(webglStatus);
        // Debug log
        if (process.env.NODE_ENV === 'development') {
          console.log('Logo3DWrapper: Mounted', { 
            isIOS: iosStatus, 
            hasWebGL: webglStatus 
          });
        }
      }, [checkWebGL]);

  // Render appropriate logo based on device and WebGL support
  if (FORCE_2D_ON_IOS && isIOSDevice) {
    return <Logo2D />;
  }

  // 2D fallback: no WebGL, or the (iOS) GPU context was killed mid-session
  if (!hasWebGL || contextLost) {
    return <Logo2D />;
  }

  return (
    <Suspense fallback={<Logo2D />}>
      <Logo3D width="100vw" height={350} onContextLost={handleContextLost} />
    </Suspense>
  );
});

// Set display name for better debugging
Logo3DWrapper.displayName = 'Logo3DWrapper';

export default Logo3DWrapper;