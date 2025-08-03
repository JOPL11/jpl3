'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      // Start fade out animation
      setIsVisible(false);
      
      // Remove from DOM after animation completes
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      
      return () => clearTimeout(removeTimer);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.splashScreen} ${!isVisible ? styles.fadeOut : ''}`}>
      <Image 
        src="/images/jp.svg"
        alt="Jan Peiro Logo"
        width={150}
        height={150}
        className={styles.logo}
        priority
      />
    </div>
  );
}
