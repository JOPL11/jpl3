'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import styles from './LoadingOverlay.module.css';

export default function LoadingOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    // Auto-hide after 1.5 seconds regardless of device
    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsLoading(false);
    }, 10);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  if (!isLoading) return null;

  return (
    <div className={`${styles.loadingOverlay} ${!isVisible ? styles.hidden : ''}`}>
      <div className={styles.loadingContent}>
        <div className={styles.welcomeMessage}>Zing!</div>
      </div>
    </div>
  );
}
