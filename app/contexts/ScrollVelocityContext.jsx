'use client';

import { createContext, useContext, useEffect, useRef } from 'react';

const ScrollVelocityContext = createContext(null);

export function ScrollVelocityProvider({ children }) {
  const velocityRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    lastYRef.current = window.scrollY;
    lastTRef.current = performance.now();

    const tick = (now) => {
      const y = window.scrollY;
      const dt = now - lastTRef.current;

      if (dt > 0) {
        // px per ms, scaled down so the shader numbers stay human
        const raw = (y - lastYRef.current) / dt;
        // smooth toward new value so quick wheel flicks don't spike
        velocityRef.current += (raw - velocityRef.current) * 0.15;
        // decay when idle
        velocityRef.current *= 0.92;
      }

      lastYRef.current = y;
      lastTRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <ScrollVelocityContext.Provider value={velocityRef}>
      {children}
    </ScrollVelocityContext.Provider>
  );
}

export function useScrollVelocity() {
  const ctx = useContext(ScrollVelocityContext);
  if (!ctx) {
    throw new Error('useScrollVelocity must be used inside <ScrollVelocityProvider>');
  }
  return ctx; // returns a ref — read .current inside R3F useFrame
}