'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../css/page.module.css';
import VideoModal from '../../components/VideoModal';

export default function VideoProjectCardCarousel({ 
  title, 
  children, 
  image, 
  alt, 
  videoUrl,
  text,
  projects // Optional array of projects for carousel
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // If projects prop is provided, use it. Otherwise, use the individual props as a single project.
  const projectList = projects || [{ title, children, image, alt, videoUrl, text }];
  const currentProject = projectList[currentIndex];

  const currentImages = currentProject.images || [];
  const hasImages = currentImages.length > 0;
  const hasVideo = !!currentProject.videoUrl;
  const hasSingleImage = !!currentProject.image;

  const handleNext = (e) => {
    e.stopPropagation();
    if (isAnimating || projectList.length <= 1) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === projectList.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (isAnimating || projectList.length <= 1) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projectList.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleLaunchModal = (e) => {
    e.stopPropagation();
    // If there are images, cycle to the next one
    if (hasImages && currentImages.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
    }
    setIsModalOpen(true);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div 
        className={`${styles.projectCard} ${isExpanded ? styles.expanded : ''}`} 
        role="gridcell" 
        tabIndex="0"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h3>{currentProject.title}</h3>
          {projectList.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {/* Navigation Bullets - Moved to the top */}
              <div style={{
                display: 'flex',
                gap: '6px',
                justifyContent: 'center',
                width: '100%',
                height: '2px',
                alignItems: 'center',
                marginBottom: '4px'  // Add some space between bullets and arrows
              }}>
                {projectList.map((_, index) => (
                  <div 
                    key={index}
                    style={{
                      width: index === currentIndex ? '20px' : '10px',
                      height: '2px',
                      backgroundColor: index === currentIndex ? 'currentColor' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderRadius: '1px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button 
                  onClick={handlePrev}
                  aria-label="Previous project"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{
                    width: 0,
                    height: 0,
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderRight: '16px solid currentColor',
                    margin: '2px 4px 0 0'
                  }} />
                </button>
                
                <button 
                  onClick={handleNext}
                  aria-label="Next project"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{
                    width: 0,
                    height: 0,
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderLeft: '16px solid currentColor',
                    margin: '2px 0 0 4px'
                  }} />
                </button>
              </div>
            </div>
          )}
        </div>
        {currentProject.text && (
          <div className={styles.additionalText}>
            {currentProject.text}
          </div>
        )}
        
        <div className={`${styles.cardContent} ${isExpanded ? styles.showContent : ''}`}>
          {currentProject.children}
        </div>
        <div className={styles.projectImage} style={{ position: 'relative' }}>
          {hasImages ? (
            <div 
              style={{ 
                width: '100%', 
                height: '150px', 
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={handleLaunchModal}
            >
              <Image 
                src={currentImages[0].src}
                alt={currentImages[0].alt}
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              {currentImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px'
                }}>
                  +{currentImages.length - 1} more
                </div>
              )}
            </div>
          ) : hasSingleImage ? (
            <Image 
              src={currentProject.image} 
              alt={currentProject.alt || currentProject.title || 'Project image'}
              width={800}
              height={600}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                objectPosition: 'center',
                cursor: hasVideo || hasImages ? 'pointer' : 'default'
              }}
              onClick={hasVideo || hasImages ? handleLaunchModal : undefined}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '150px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              No media available
            </div>
          )}
        </div>
        <div className={styles.cardActions}>
          <button 
            className={styles.moreButton}
            onClick={handleMoreClick}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
          <button 
            className={styles.viewProjectButton}
            onClick={handleLaunchModal}
          >
            Launch Video
          </button>
        </div>
      </div>
      
      <VideoModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        videoUrl={hasVideo ? currentProject.videoUrl : undefined}
        images={hasImages ? currentImages : []}
        currentImageIndex={currentImageIndex}
        onNextImage={handleNextImage}
        onPrevImage={handlePrevImage}
      />
    </>
  );
}
