'use client';
import { useState, useCallback, useEffect } from 'react';
import styles from '../css/ThrowableImages.module.css';
import Image from 'next/image';
const IMAGES = [
  '/images/throwable/merc1.jpg',
  '/images/throwable/merc77.jpg',
  '/images/throwable/merc4.jpg',
  '/images/throwable/merc99.jpg',
  '/images/throwable/merc66.jpg',
  '/images/throwable/merc55b.jpg',
].map((src, index) => ({
  id: index,
  src,
  rotation: [-3, 2, -2, 1, -2][index % 5],
  zIndex: 5 - index,
}));
const ThrowableImages = ({ isActive = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const handleClick = useCallback(() => {
  if (isAnimating) return;
  
  setIsAnimating(true);
  
  // Animate the current card out
  const card = document.querySelector(`.${styles.throwable}:nth-child(${activeIndex + 1})`);
  if (card) {
    card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    card.style.transform = `translate(500px, -200px) rotate(30deg)`;
    card.style.opacity = '0';
  }
  
  // Move to next image after animation
  setTimeout(() => {
    setActiveIndex(prev => {
      const newIndex = (prev + 1) % IMAGES.length;
      
      // If we're resetting to the first image, animate them back in staggered
      if (newIndex === 0) {
        const cards = document.querySelectorAll(`.${styles.throwable}`);
        cards.forEach((card, idx) => {
          // Set initial position off-screen to the left
          card.style.transition = 'none';
          card.style.transform = 'translateX(-1000px)';
          card.style.opacity = '0';
          
          // Force reflow
          void card.offsetHeight;
          
          // Animate back in with staggered delay
          setTimeout(() => {
            card.style.transition = `transform 0.5s ease-out ${idx * 100}ms, opacity 0.5s ease ${idx * 100}ms`;
            card.style.transform = `rotate(${IMAGES[idx].rotation}deg)`;
            card.style.opacity = '1';
          }, 10);
        });
      } else {
        // For normal card transitions
        if (card) {
          card.style.transition = 'none';
          card.style.transform = `rotate(${IMAGES[prev].rotation}deg)`;
          card.style.opacity = '0.8';
          void card.offsetHeight;
        }
      }
      
      setIsAnimating(false);
      return newIndex;
    });
  }, 300);
}, [activeIndex, isAnimating]);
  return (
    <div className={styles.container}>
      <div className={styles.stackContainer} onClick={handleClick}>
        {IMAGES.map((img, index) => {
          const isActiveCard = index === activeIndex;
          const isLastCard = index === IMAGES.length - 1;
          
          return (
               <div
                  key={img.id}
                  className={`${styles.throwable} ${isActiveCard ? styles.active : ''}`}
                  style={{
                    zIndex: img.zIndex,
                    opacity: isActiveCard ? 1 : index < activeIndex ? 0 : 0.8,
                    transform: `rotate(${img.rotation}deg)`,
                    transition: 'transform 0.2s ease-out, opacity 0.3s ease',
                    cursor: isActiveCard ? 'pointer' : 'default',
                  }}
                >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={img.src}
                  alt={`Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={index === 0}
                  quality={100}
                  style={{ objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  pointerEvents: 'none'
                }}>
                  {index + 1}
                </div>
                {isLastCard && activeIndex > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    Click to view again
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ThrowableImages;