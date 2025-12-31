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

// Lazy load 3D component with fallback
const Logo3D = dynamic(
  () => import('./Logo3D'),
  { 
    ssr: false,
    loading: () => <div style={{ width: 250, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading 3D...</div>
  }
);

const Logo3DWrapper = memo(function Logo3DWrapper() {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  // Check WebGL support
  const checkWebGL = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }, []);

  // Initialize component
  useEffect(() => {
    // Set iOS device status
    const iosStatus = checkIfIOS();
    setIsIOSDevice(iosStatus);
    
    // Only check WebGL if not on iOS
    if (!iosStatus) {
      setHasWebGL(checkWebGL());
    }

    // Debug log
    if (process.env.NODE_ENV === 'development') {
      console.log('Logo3DWrapper: Mounted', { 
        isIOS: iosStatus, 
        hasWebGL: iosStatus ? 'N/A (iOS)' : hasWebGL 
      });
    }
  }, [checkWebGL]);

  // Render appropriate logo based on device and WebGL support
  if (isIOSDevice) {
    return <Logo2D />;
  }

  if (!hasWebGL) {
    return <Logo2D />;
  }

  return (
    <Suspense fallback={<Logo2D />}>
      <Logo3D />
    </Suspense>
  );
});

// Set display name for better debugging
Logo3DWrapper.displayName = 'Logo3DWrapper';

export default Logo3DWrapper;