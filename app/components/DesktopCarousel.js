'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../css/DesktopCarousel.module.css';

const getImageSource = (src) => {
  if (!src) return '';
  // If it's an absolute URL, use as is
  if (src.startsWith('http') || src.startsWith('//') || src.startsWith('data:')) {
    return src;
  }
  // If it's a path without a leading slash, add one
  if (!src.startsWith('/')) {
    return `/${src}`;
  }
  return src;
};

export default function DesktopCarousel({ title, description, images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Debug log when images change
  useEffect(() => {
    console.log('Images in DesktopCarousel:', images);
    if (images.length > 0 && images[0]?.src) {
      console.log('First image src:', images[0].src);
    }
  }, [images]);

  // Check if we're on desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      const isDesktopView = window.innerWidth > 1024;
      console.log('Is desktop view:', isDesktopView);
      setIsDesktop(isDesktopView);
    };
    
    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    return () => window.removeEventListener('resize', checkIfDesktop);


    
  }, []);  



  useEffect(() => {
    const modal = document.querySelector('.modalContent');
    if (modal) {
      modal.style.overflow = 'hidden';
      return () => {
        modal.style.overflow = '';
      };
    }
  }, []);

  const handleImageError = (e) => {
    console.error('Failed to load image:', e.target.src);
    setImageError(true);
  };

  const goToNext = () => {
    setImageError(false);
    setCurrentIndex((prevIndex) => 
      prevIndex >= images.length ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setImageError(false);
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? images.length : prevIndex - 1
    );
  };

  if (!isDesktop) {
    console.log('Not in desktop view, not rendering carousel');
    return null;
  }

  // Calculate the actual image index (0 is description, 1+ are images)
  const currentImageIndex = currentIndex - 1;
  const currentImage = images[currentImageIndex];
  const imageSrc = currentImage?.src || '';

  console.log('Rendering carousel. Current index:', currentIndex, 
    'Image index:', currentImageIndex, 
    'Image src:', imageSrc);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselContent}>
        {currentIndex === 0 ? (
          <div className={styles.descriptionSlide}>
            <div className={styles.descriptionContent}>
              <div className={styles.descriptionTextContent}>
                <h3>{title}</h3>
                <div 
                  className={styles.descriptionText}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
              {images.length > 0 && images[0]?.src && !imageError && (
                <div className={styles.descriptionImage}>
                  <Image
                    src={images[0].src}
                    alt={images[0]?.alt || 'Project hero image'}
                    width={600}
                    height={400}
                    className={styles.heroImage}
                    priority={true}
                    onError={handleImageError}
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.imageSlide}>
            {currentImage?.src && !imageError ? (
              <>
                <Image
                  src={imageSrc}
                  alt={currentImage?.alt || 'Project image'}
                  width={1200}
                  height={800}
                  className={styles.carouselImage}
                  priority={currentIndex === 1}
                  key={`image-${currentImageIndex}`}
                  onError={handleImageError}
                  unoptimized={process.env.NODE_ENV === 'development'}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </>
            ) : (
              <div className={styles.imagePlaceholder}>
                <p>Image not found or failed to load</p>
                <p>Source: {currentImage?.src || 'No source provided'}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.navigation}>
        <button 
          onClick={goToPrevious}
          className={styles.navButton}
          aria-label="Previous image"
        >
          ◀
        </button>
        
        <div className={styles.pagination}>
          <button 
            className={`${styles.paginationDot} ${currentIndex === 0 ? styles.active : ''}`}
            onClick={() => setCurrentIndex(0)}
            aria-label="Go to description"
          />
          {images.map((img, index) => (
            <button 
              key={index}
              className={`${styles.paginationDot} ${currentIndex === index + 1 ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index + 1)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={goToNext}
          className={styles.navButton}
          aria-label="Next image"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
