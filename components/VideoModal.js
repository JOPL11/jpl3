'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
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

export default function VideoModal({ isOpen, onClose, videoUrl, images = [], currentImageIndex = 0, onNextImage, onPrevImage }) {
  ///const [isOpen, setIsOpen] = useState({});
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsConsent, setNeedsConsent] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(currentImageIndex);
  const iframeRef = useRef(null);
  const isMounted = useRef(true);
  const hasImages = images && images.length > 0;
  const hasVideo = !!videoUrl;

  // Sync activeImageIndex with prop changes
  useEffect(() => {
    setActiveImageIndex(currentImageIndex);
  }, [currentImageIndex]);

  
  const checkConsent = useCallback(() => {
    if (typeof window === 'undefined') return { hasConsent: false, showBanner: false };
    
    const canAccessStorage = areCookiesEnabled();
    if (!canAccessStorage) {
      return { hasConsent: false, showBanner: true };
    }
    
    try {
      const savedConsent = localStorage.getItem('cookieConsent');
      return {
        hasConsent: savedConsent === 'true',
        showBanner: savedConsent === null
      };
    } catch (e) {
      return { hasConsent: false, showBanner: true };
    }
  }, []);

  // Check for existing consent when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Only check consent for videos
      if (hasVideo) {
        const consentState = checkConsent();
        setHasConsent(consentState.hasConsent);
        setShowConsentBanner(consentState.showBanner);
        setNeedsConsent(consentState.showBanner);
      } else {
        setHasConsent(true);
        setShowConsentBanner(false);
        setNeedsConsent(false);
      }
      setIsLoading(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasVideo, checkConsent]);


  const handleConsent = useCallback((consent) => {
    if (!isMounted.current) return;
    
    try {
      localStorage.setItem('cookieConsent', String(consent));
      setHasConsent(consent);
      setShowConsentBanner(false);
      setNeedsConsent(false);
      window.dispatchEvent(new Event('cookieConsent'));
      
      if (!consent) {
        onClose();
      } else if (iframeRef.current) {
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

  const getVideoId = useCallback((url) => {
    if (!url) return '';
    const match = url.match(/(?:vimeo\.com\/(\d+))|(?:vimeo\.com\/video\/(\d+))/);
    return match && (match[1] || match[2] || '');
  }, []);

  const getEmbedUrl = useCallback((url) => {
    const videoId = getVideoId(url);
    if (!videoId) return '';
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&controls=1&title=0&byline=0&portrait=0&badge=0&transparent=0&dnt=1`;
  }, [getVideoId]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    const nextIndex = (activeImageIndex + 1) % images.length;
    setActiveImageIndex(nextIndex);
    if (onNextImage) onNextImage(nextIndex);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    const prevIndex = (activeImageIndex - 1 + images.length) % images.length;
    setActiveImageIndex(prevIndex);
    if (onPrevImage) onPrevImage(prevIndex);
  };

  if (!isOpen) return null;

  const embedUrl = getEmbedUrl(videoUrl);
  const showVideo = hasVideo && hasConsent && !showConsentBanner && !isLoading && embedUrl;
  const currentImage = images[activeImageIndex];

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button 
          className={styles.closeButton} 
          onClick={onClose} 
          aria-label="Close modal"
        >
          &times;
        </button>
        
        {hasVideo && showConsentBanner && (
          <div className={styles.consentBanner}>
            <p style={{ marginBottom: '1rem' }}>
              This video is hosted on Vimeo and may use cookies for analytics and personalization.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <div className={styles.consentButtons}>
              <button 
                style={{
                  padding: '0.6rem 1.5rem',  background: 'linear-gradient(180deg, #548da0 0%, #345f6d 100%)',
                  color: 'white'
                }}
                onClick={() => handleConsent(false)}
                className={styles.consentButton}
              >
                Reject
              </button>
              <button 
                style={{
                  padding: '0.6rem 1.5rem',  background: 'linear-gradient(180deg, #548da0 0%, #345f6d 100%)',
                  color: 'white'
                }}
                onClick={() => handleConsent(true)}
                className={`${styles.consentButton} ${styles.primaryButton}`}
              >
                Accept & Watch
              </button>
            </div>
            </div>
          </div>
        )}

        {showVideo && (
          <div className={styles.videoContainer}>
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className={styles.videoIframe}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Video player"
            />
          </div>
        )}

        {hasImages && (
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src={currentImage.src}
                alt={currentImage.alt || 'Gallery image'}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            
            {images.length > 1 && (
              <>
                <button 
                  className={styles.navButton} 
                  style={{ left: '10px' }}
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  ❮
                </button>
                <button 
                  className={styles.navButton} 
                  style={{ right: '10px' }}
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  ❯
                </button>
                <div className={styles.pagination}>
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.paginationDot} ${index === activeImageIndex ? styles.activeDot : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(index);
                      }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
