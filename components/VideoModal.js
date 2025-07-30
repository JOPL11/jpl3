'use client';

import { useEffect, useState } from 'react';
import styles from '../app/css/VideoModal.module.css';

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  // Check for existing consent when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const savedConsent = localStorage.getItem('cookieConsent');
      setHasConsent(savedConsent === 'true');
      setShowConsentBanner(savedConsent === null);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConsent = (consent) => {
    localStorage.setItem('cookieConsent', String(consent));
    setHasConsent(consent);
    setShowConsentBanner(false);
    window.dispatchEvent(new Event('cookieConsent'));
    
    if (!consent) {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Extract video ID from Vimeo URL
  const getVideoId = (url) => {
    const match = url.match(/(?:vimeo\.com\/(\d+))|(?:vimeo\.com\/video\/(\d+))/);
    return match && (match[1] || match[2]);
  };

  if (!isOpen) return null;

  const videoId = getVideoId(videoUrl);
  const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&controls=1&title=0&byline=0&portrait=0&badge=0&transparent=0`;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button 
          className={styles.closeButton} 
          onClick={onClose} 
          aria-label="Close video"
        >
          &times;
        </button>
        
        {showConsentBanner && (
          <div className={styles.consentBanner}>
            <p>This video is hosted on Vimeo. To watch it, you need to accept our cookie policy.</p>
            <div className={styles.consentButtons}>
              <button 
                className={styles.rejectButton}
                onClick={() => handleConsent(false)}
              >
                Reject
              </button>
              <button 
                className={styles.acceptButton}
                onClick={() => handleConsent(true)}
              >
                Accept & Watch Video
              </button>
            </div>
          </div>
        )}

        {hasConsent && (
          <div className={styles.videoContainer}>
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Video Player"
            />
          </div>
        )}
      </div>
    </div>
  );
}
