'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show banner if user hasn't made a choice yet
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookieConsent');
      if (consent === null) {
        setVisible(true);
      }
    }
  }, []);

  const acceptCookies = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'accepted');
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <p>
          We use cookies to load fonts and process form submissions. By continuing to use this site, you consent to our use of these necessary cookies. 
          <Link href="/privacy" className={styles.link}>Learn more</Link>
        </p>
        <button onClick={acceptCookies} className={styles.button}>
          I understand
        </button>
      </div>
    </div>
  );
}
