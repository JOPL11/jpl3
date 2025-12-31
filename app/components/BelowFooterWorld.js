// In app/components/BelowFooterWorld.js
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRef, Suspense } from 'react';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh position={[0, 5, -5]}>
        <boxGeometry args={[5, 155, 1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      <Environment preset="city" />
    </>
  );
}

export default function BelowFooterWorld() {
  const containerRef = useRef();
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const sectionHeight = viewportHeight * 10; // 5x viewport height
  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: `${sectionHeight}px`,
        background: '#0a0a0a', // Solid dark background
        overflow: 'hidden',
      }}
    >
      {/* Thin gradient at the very top */}
    <div style={{
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '200vh',
  background: 'linear-gradient(to bottom, #000000 0%, #080808 15%, #0a0a0a 25%, #0a0a0a 100%)',
  zIndex: 1,
  pointerEvents: 'none'
}} />
      
      <Canvas
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 2,
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
       {/* Foreground gradient overlay (new) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '200vh',
        background: 'linear-gradient(to top, transparent 0%, transparent 50%, #000000 100%)',
        zIndex: 11, // Higher z-index to be in front of the canvas
        pointerEvents: 'none'
      }} />
      {/* Content sections that will appear as you scroll */}
      <div style={{
        position: 'absolute',
        top: '100vh',
        left: 0,
        width: '100%',
        height: `${sectionHeight - viewportHeight}px`,
        zIndex: 3,
        pointerEvents: 'none',
      }}>
        {/* Add your scrolling content here */}
      </div>
      
      {/* Gradient overlay at the bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(to top, #0a0a0a, transparent)',
        pointerEvents: 'none',
        zIndex: 4,
      }} />
    </div>
  );
}