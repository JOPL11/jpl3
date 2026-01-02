'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import styles from './LoadingOverlay.module.css';

export default function LoadingOverlay() {
  const { isLoading, setIsLoading } = useLoading();
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Start fade out after 1 second
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
      
      // After fade out completes, update loading state and unmount
      const removeTimer = setTimeout(() => {
        if (setIsLoading) setIsLoading(false);
        setShouldRender(false);
      }, 500); // Match this with your CSS transition duration

      return () => clearTimeout(removeTimer);
    }, 2000);

    return () => {
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
      <div style={{ 
     
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{   top: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/images/logoAnima/J.svg" 
            alt="J" 
            className={styles.letterJ}
          />
          <img 
            src="/images/logoAnima/P.svg" 
            alt="P" 
            className={styles.letterP}
          />
        </div>
        <div style={{ 
          fontSize: '1rem',
          fontWeight: '200',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          
        </div>
      </div>
    </div>
  );
}