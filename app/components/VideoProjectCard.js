'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import VideoModal from '../../components/VideoModal';

export default function VideoProjectCard({ 
  title, 
  children, 
  image, 
  alt, 
  videoUrl,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (e) => {
    e.preventDefault();
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
        className={`${styles.projectCard} ${isExpanded ? styles.expanded : ''}`} 
        role="gridcell" 
        tabIndex="0"
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <h3>{title}</h3>
        <div className={`${styles.cardContent} ${isExpanded ? styles.showContent : ''}`}>
          {children}
        </div>
        <div className={styles.cardActions}>
          <button 
            className={styles.moreButton}
            onClick={handleMoreClick}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
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
      </div>
      
      <VideoModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        videoUrl={videoUrl} 
      />
    </>
  );
}
