'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MouseGradient = () => {
  const gradientRef = useRef();
  const position = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef();

  useEffect(() => {
    // Set initial position to center of screen
    position.current = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    };
    
    const handleMouseMove = (e) => {
      // Update target position immediately on mouse move
      targetPosition.current = { x: e.clientX, y: e.clientY };
      
      // If we don't have an animation running yet, start one
      if (!animationRef.current) {
        animateGradient();
      }
    };

    const handleResize = () => {
      // Update position on resize to keep gradient centered
      position.current = { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      };
    };

    const animateGradient = () => {
      // Use GSAP to smoothly animate towards the target position
      gsap.to(position.current, {
        x: targetPosition.current.x,
        y: targetPosition.current.y,
        duration: 1.5, // Adjust this value to control the lag/smoothness (higher = more lag)
        ease: 'power2.out',
        onUpdate: () => {
          // Update the gradient position
          if (gradientRef.current) {
            gradientRef.current.style.setProperty('--x', `${position.current.x}px`);
            gradientRef.current.style.setProperty('--y', `${position.current.y}px`);
          }
        },
        onComplete: () => {
          // Check if we need to keep animating
          const dx = targetPosition.current.x - position.current.x;
          const dy = targetPosition.current.y - position.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 1) {
            // If we're not at the target, keep animating
            animationRef.current = requestAnimationFrame(animateGradient);
          } else {
            // We've reached the target, clear the animation
            animationRef.current = null;
          }
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Initial animation
    const timer = setTimeout(() => {
      if (gradientRef.current) {
        gradientRef.current.style.opacity = '1';
      }
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={gradientRef}
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000 mix-blend-overlay opacity-0"
      style={{
        '--x': '50%',
        '--y': '50%',
        background: `radial-gradient(
          800px circle at var(--x, 50%) var(--y, 50%),
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