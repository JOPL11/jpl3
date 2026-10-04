'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../css/page.module.css';
import VideoModal from '../../components/VideoModal';

export default function VideoProjectCard({ 
  title, 
  children, 
  image, 
  alt, 
  videoUrl,
  text,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1651px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const expanded = isDesktop || isExpanded;

  const handleLaunchVideo = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className={`${styles.projectCard} ${expanded ? styles.expanded : ''}`} 
        role="gridcell" 
        tabIndex="0"
      >
        <h3>{title}</h3>
        {text && (
          <div className={styles.additionalText}>
            {text}
          </div>
        )}
        <div className={`${styles.cardContent} ${expanded ? styles.showContent : ''}`}>
          {children}
        </div>
        <div className={styles.projectImage}>
          <Image 
            src={image} 
            alt={alt}
            width={800}
            height={600}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
        <div className={styles.cardActions}>
          <button 
            className={styles.moreButton}
            onClick={handleMoreClick}
            aria-expanded={expanded}
          >
            {expanded ? 'Less' : 'More'}
          </button>
          <button 
            className={styles.viewProjectButton}
            onClick={handleLaunchVideo}
          >
            Launch Video
          </button>
        </div>
      </div>
      
      <VideoModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        videoUrl={videoUrl} 
      />
    </>
  );
}