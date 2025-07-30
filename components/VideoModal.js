'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import styles from '../app/css/VideoModal.module.css';

// Helper function to check if cookies are enabled
const areCookiesEnabled = () => {
  try {
    localStorage.setItem('test-cookie', '1');
    const enabled = localStorage.getItem('test-cookie') === '1';
    localStorage.removeItem('test-cookie');
    return enabled;
  } catch (e) {
    return false;
  }
};

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsConsent, setNeedsConsent] = useState(true);
  const iframeRef = useRef(null);
  const isMounted = useRef(true);

  // Check for existing consent
  const checkConsent = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    // First check if we can access localStorage
    const canAccessStorage = areCookiesEnabled();
    
    // If we can't access storage, we need to show the banner
    if (!canAccessStorage) {
      return { hasConsent: false, showBanner: true };
    }
    
    // Try to get the consent from localStorage
    try {
      const savedConsent = localStorage.getItem('cookieConsent');
      return {
        hasConsent: savedConsent === 'true',
        showBanner: savedConsent === null
      };
    } catch (e) {
      // If we can't access localStorage, show the banner
      return { hasConsent: false, showBanner: true };
    }
  }, []);

  // Check for existing consent when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const consentState = checkConsent();
      setHasConsent(consentState.hasConsent);
      setShowConsentBanner(consentState.showBanner);
      setIsLoading(false);
      
      // Set a flag if we need to show consent banner
      setNeedsConsent(consentState.showBanner);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, checkConsent]);

  const handleConsent = useCallback((consent) => {
    if (!isMounted.current) return;
    
    try {
      // Try to save consent to localStorage
      localStorage.setItem('cookieConsent', String(consent));
      
      // Update state
      setHasConsent(consent);
      setShowConsentBanner(false);
      setNeedsConsent(false);
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('cookieConsent'));
      
      if (!consent) {
        onClose();
      } else if (iframeRef.current) {
        // Force reload the iframe after consent
        const src = iframeRef.current.src;
        if (src) {
          iframeRef.current.src = '';
          setTimeout(() => {
            if (isMounted.current && iframeRef.current) {
              iframeRef.current.src = src;
            }
          }, 100);
        }
      }
    } catch (e) {
      console.error('Failed to save consent:', e);
      // If we can't save consent, still try to show the video
      setHasConsent(true);
      setShowConsentBanner(false);
      setNeedsConsent(false);
    }
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Extract video ID from Vimeo URL
  const getVideoId = useCallback((url) => {
    if (!url) return '';
    const match = url.match(/(?:vimeo\.com\/(\d+))|(?:vimeo\.com\/video\/(\d+))/);
    return match && (match[1] || match[2] || '');
  }, []);

  // Get the embed URL with privacy-enhanced mode for better Chrome compatibility
  const getEmbedUrl = useCallback((url) => {
    const videoId = getVideoId(url);
    if (!videoId) return '';
    
    // Use dnt=1 for privacy and no tracking
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&controls=1&title=0&byline=0&portrait=0&badge=0&transparent=0&dnt=1`;
  }, [getVideoId]);

  if (!isOpen) return null;

  const embedUrl = getEmbedUrl(videoUrl);
  const showVideo = hasConsent && !showConsentBanner && !isLoading && embedUrl;

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

        {showVideo && (
          <div className={styles.videoContainer}>
            <iframe
              ref={iframeRef}
              key={`video-${getVideoId(videoUrl)}`}
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Video Player"
              style={{ 
                opacity: 1,
                backgroundColor: '#000',
                border: 'none',
                display: 'block'
              }}
              loading="eager"
              onLoad={() => {
                if (iframeRef.current) {
                  iframeRef.current.style.opacity = '1';
                }
              }}
              onError={() => {
                if (iframeRef.current) {
                  // Try reloading with a small delay
                  setTimeout(() => {
                    if (iframeRef.current) {
                      const src = iframeRef.current.src;
                      iframeRef.current.src = '';
                      setTimeout(() => {
                        if (iframeRef.current) {
                          iframeRef.current.src = src;
                        }
                      }, 100);
                    }
                  }, 500);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
