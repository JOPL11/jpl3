'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import styles from './LoadingOverlay.module.css';
import Image from 'next/image';

export default function LoadingOverlay() {
  const { isLoading, setIsLoading } = useLoading();
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [logoVisible, setLogoVisible] = useState(true);
  const [lineVisible, setLineVisible] = useState(false);
useEffect(() => {
  // Start logo fade out after 1.5 seconds
  const logoFadeTimer = setTimeout(() => {
    // Logo fade out logic here (we'll add this)
    setLogoVisible(false);
    setLineVisible(false);
  }, 1000);
  const lineFadeTimer = setTimeout(() => {
    setLineVisible(true);
  }, 300);
  // Start background fade out after 2 seconds (after logo starts fading)
  const fadeOutTimer = setTimeout(() => {
    setIsVisible(false);
    
    // After fade out completes, update loading state and unmount
    const removeTimer = setTimeout(() => {
      if (setIsLoading) setIsLoading(false);
      setShouldRender(false);
    }, 500);
    return () => clearTimeout(removeTimer);
  }, 2000); // Give logo 0.5s head start
  return () => {
    clearTimeout(logoFadeTimer);
    clearTimeout(lineFadeTimer);
    clearTimeout(fadeOutTimer);
  };
}, [setIsLoading]);

  if (!shouldRender) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#0f172a', 
      zIndex: 9999, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      opacity: isVisible ? 1 : 0, 
      transition: 'opacity 0.5s ease-out',
      pointerEvents: isVisible ? 'auto' : 'none'
    }}>
      <div className={styles.animaContent} style={{     
        width: '100%',
        height: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div className={styles.logoWrapperContainer}>
        <div className={styles.logoAnimationContainer} style={{ 
          opacity: logoVisible ? 1 : 0,
          transition: 'opacity 0.5s ease-out'
        }}>
                  <Image 
              src="/images/logoAnima/J.svg" 
              alt="J" 
              className={styles.letterJ}
              width={50}  // Add appropriate width
              height={50} // Add appropriate height
            />
            <Image 
              src="/images/logoAnima/P.svg" 
              alt="P" 
              className={styles.letterP}
              width={50}  // Add appropriate width
              height={50} // Add appropriate height
            />
          <div></div>
        </div>
   
        </div>
            <div className={styles.staticLine} style={{ 
              opacity: lineVisible ? 1 : 0,
              width: lineVisible ? '40px' : '0',
              transition: 'opacity 0.3s ease-out 0.3s, width 0.3s ease-out 0.5s', // Add 0.3s delay
              transitionDelay: lineVisible ? '0.2s' : '0.1s' // Fade in after 0.3s, fade out immediately
            }}></div>
      </div>
     
    </div>
    
  );
}