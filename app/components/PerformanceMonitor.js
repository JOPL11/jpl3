// app/components/PerformanceMonitor.js
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export function usePerformanceMonitor() {
  const [quality, setQuality] = useState('high');
  const frames = useRef(0);

  const checkDevicePerformance = useCallback(() => {
    const isLowEndDevice = 
      !('hardwareConcurrency' in navigator) || 
      navigator.hardwareConcurrency <= 2 ||
      !('deviceMemory' in navigator) ||
      navigator.deviceMemory < 2;

    if (isLowEndDevice) {
      setQuality('low');
    }
  }, []);

  useEffect(() => {
    checkDevicePerformance();
    
    let frameId;
    let lastTime = performance.now();

    const updateFPS = (time) => {
      frames.current++;
      const delta = time - lastTime;
      
      if (delta >= 1000) {
        const currentFps = Math.round((frames.current * 1000) / delta);
        frames.current = 0;
        lastTime = time;
        
        if (currentFps < 25 && quality !== 'low') {
          setQuality('low');
        } else if (currentFps < 35 && quality !== 'medium' && quality !== 'low') {
          setQuality('medium');
        }
      }
      frameId = requestAnimationFrame(updateFPS);
    };

    frameId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(frameId);
  }, [quality, checkDevicePerformance]);

  return { 
    quality,
    isLowPerf: quality === 'low',
    isMediumPerf: quality === 'medium',
    isHighPerf: quality === 'high'
  };
}