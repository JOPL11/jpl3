'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../Modal.module.css';

export default function ProjectModal({ title, description, images = [], videos = [], clientLogo }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent === 'true') {
      setHasConsent(true);
    } else if (videos.length > 0 || images.some(img => 
      img.src?.includes('artstation.com') || 
      img.src?.includes('cdn.artstation.com') ||
      img.src?.includes('cdna.artstation.com') ||
      img.src?.includes('cdnb.artstation.com')
    )) {
      // Show consent banner if there are videos or ArtStation images
      setShowConsentBanner(true);
    }
  }, [videos, images]);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setHasConsent(true);
    setShowConsentBanner(false);
    window.dispatchEvent(new Event('cookieConsent'));
  };

  const handleReject = () => {
    setShowConsentBanner(false);
  };

  const renderVideo = (video, index) => {
    if (!hasConsent) return null;
    
    return video.embedUrl ? (
      <div key={`video-${index}`} className={styles.videoContainer}>
        <iframe
          src={video.embedUrl}
          title={video.title || `Video ${index + 1}`}
          className={styles.videoEmbed}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : (
      <div key={`video-${index}`} className={styles.videoContainer}>
        <video
          className={styles.videoPlayer}
          controls
          src={video.src}
          title={video.title || `Video ${index + 1}`}
        />
      </div>
    );
  };

  const renderImage = (img, index) => {
    if (!hasConsent && (
      img.src?.includes('artstation.com') || 
      img.src?.includes('cdn.artstation.com') ||
      img.src?.includes('cdna.artstation.com') ||
      img.src?.includes('cdnb.artstation.com')
    )) return null;

    return (
      <div key={`img-${index}`} className={styles.modalImageContainer}>
        <Image
          src={img.src}
          alt={img.alt}
          width={800}
          height={600}
          className={styles.modalImage}
          priority={index === 0 && videos.length === 0}
          loading={index === 0 && videos.length === 0 ? 'eager' : 'lazy'}
        />
      </div>
    );
  };

  return (
    <div className={styles.projectModal}>
      <div className={styles.modalHeader}>
        <h2>{title}</h2>
        {clientLogo && (
          <div className={styles.clientLogo}>
            <Image
              src={clientLogo}
              alt="Client Logo"
              width={80}
              height={40}
              className={styles.logoImage}
            />
          </div>
        )}
      </div>
      <div 
        className={styles.modalDescription}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className={styles.mediaContainer}>
        {showConsentBanner && (
          <div className={styles.consentBanner}>
            <p>This content is hosted on external platforms. By clicking &quot;I Understand&quot;, you consent to their cookie policies.</p>
            <div className={styles.consentButtons}>
              <button onClick={handleReject} className={styles.rejectButton}>
                Reject
              </button>
              <button onClick={handleAccept} className={styles.acceptButton}>
                I Understand
              </button>
            </div>
          </div>
        )}
        {videos.map(renderVideo)}
        {images.map(renderImage)}
      </div>
    </div>
  );
}
