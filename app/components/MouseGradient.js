'use client';

import { useEffect, useState } from 'react';

const MouseGradient = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a small delay before showing to prevent flash of unstyled content
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 mix-blend-overlay"
      style={{
        opacity: isVisible ? 1 : 0,
        background: `radial-gradient(
          800px circle at ${mousePosition.x}px ${mousePosition.y}px,
          rgba(99, 179, 237, 0.3),
          rgba(99, 102, 241, 0.2) 30%,
          rgba(79, 70, 229, 0.1) 50%,
          transparent 70%
        )`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

export default MouseGradient;