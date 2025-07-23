'use client';

import { useEffect } from 'react';
import styles from './VideoModal.module.css';

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
      </div>
    </div>
  );
}
