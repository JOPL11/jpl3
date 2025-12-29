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
    }, 1000);

    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, [setIsLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.loadingOverlay} ${!isVisible ? styles.hidden : ''}`}>
      <div className={styles.loadingContent}>
        <div className={styles.welcomeMessage}>
          Deploying...
        </div>
      </div>
    </div>
  );
}
