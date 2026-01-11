// components/CookieBanner.js
'use client';

import { useState, useEffect } from 'react';
import styles from '../css/CookieBanner.module.css';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem('analyticsConsent');
    if (savedConsent === null) {
      setShowBanner(true);
    } else {
      setConsent(savedConsent === 'true');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('analyticsConsent', 'true');
    setConsent(true);
    setShowBanner(false);
    window.dispatchEvent(new Event('analyticsConsent'));
  };

  const handleReject = () => {
    localStorage.setItem('analyticsConsent', 'false');
    setConsent(false);
    setShowBanner(false);
    window.dispatchEvent(new Event('analyticsConsent'));
  };

  if (!showBanner) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <p>
          My site doesn't track you. No cookies, no fingerprinting, no bullshit. 
        </p>
        <div className={styles.buttons}>
          <button onClick={handleReject} className={styles.rejectButton}>
            Great!
          </button>
        </div>
      </div>
    </div>
  );
}