'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import styles from './LoadingOverlay.module.css';

export default function LoadingOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const { isLoading, setIsLoading } = useLoading();
  const [showPressSpace, setShowPressSpace] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setIsVisible(false);
      setIsLoading(false);
      // Remove the event listener after first space press
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [setIsLoading]);

  useEffect(() => {
    // Show "Press Space" message after a short delay
    const showSpaceTimer = setTimeout(() => {
      setShowPressSpace(true);
    }, 1000);

    // Add keydown event listener
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      clearTimeout(showSpaceTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isLoading) return null;

  return (
    <div 
      className={`${styles.loadingOverlay} ${!isVisible ? styles.hidden : ''}`}
      onClick={() => {
        // Also allow click to dismiss as a fallback
        setIsVisible(false);
        setIsLoading(false);
      }}
    >
      <div className={styles.loadingContent}>
        <div className={styles.welcomeMessage}>
          Down For Maintenance
          {showPressSpace && (
            <div className={styles.pressSpace}>
              Press SPACE to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
