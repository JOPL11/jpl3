// components/CookieBanner.js
'use client';

import { useState, useEffect } from 'react';
import styles from '../css/CookieBanner.module.css';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent === null) {
      setShowBanner(true);
    } else {
      setConsent(savedConsent === 'true');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setConsent(true);
    setShowBanner(false);
    window.dispatchEvent(new Event('cookieConsent'));
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false');
    setConsent(false);
    setShowBanner(false);
    window.dispatchEvent(new Event('cookieConsent'));
  };

  if (!showBanner) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <p>
          By viewing this portfolio, you understand that you are accessing content hosted on Vimeo and ArtStation, 
          and you consent to their respective cookie policies.
        </p>
        <div className={styles.buttons}>
          <button onClick={handleAccept} className={styles.acceptButton}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}