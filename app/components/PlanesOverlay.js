'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function PlanesOverlay() {
  const plane1Ref = useRef();
  const plane2Ref = useRef();
  const plane3Ref = useRef();
  const plane4Ref = useRef();
  const containerRef = useRef();

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Position each plane individually
      gsap.set(plane1Ref.current, {
        x: '200%',
        y: '0%',
        width: 200,
        height: 200,
        xPercent: -10,
        yPercent: -10,
        backgroundColor: '#222d38'
      });

      gsap.set(plane2Ref.current, {
        x: '150%',
        y: '200%',
        width: 200,
        height: 200,
        xPercent: -10,
        yPercent: -10,
        backgroundColor: '#222d38'
      });

      gsap.set(plane3Ref.current, {
        x: '90%',
        y: '60%',
        width: 100,
        height: 100,
        xPercent: -50,
        yPercent: -50,
        backgroundColor: '#222d38'
      });

      gsap.set(plane4Ref.current, {
        x: '90%',
        y: '90%',
        width: 100,
        height: 100,
        xPercent: -50,
        yPercent: -50,
        backgroundColor: '#222d38'
      });
    }, containerRef);

    // Cleanup
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div ref={plane1Ref} style={{
        position: 'absolute',
        backgroundColor: '#222d38',
        willChange: 'transform',
      }} />
      
      <div ref={plane2Ref} style={{
        position: 'absolute',
        backgroundColor: '#222d38',
        willChange: 'transform',
      }} />
      
      <div ref={plane3Ref} style={{
        position: 'absolute',
        backgroundColor: '#222d38',
        willChange: 'transform',
      }} />
      
      <div ref={plane4Ref} style={{
        position: 'absolute',
        backgroundColor: '#222d38',
        willChange: 'transform',
      }} />
    </div>
  );
}
