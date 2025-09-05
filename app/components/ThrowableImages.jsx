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
  rotation: [-3, 2, -2, 1, -2][index],
  zIndex: 5 - index,
}));

const ThrowableImages = ({ isActive = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [positions, setPositions] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    console.log(`ThrowableImages is now ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
  }, [isActive]);

  const handleTouchStart = useCallback((e) => {
    if (!isActive) {
      console.log('Interaction blocked - ThrowableImages is not active');
      return;
    }
    console.log('ThrowableImages interaction started');
    const touch = e.touches ? e.touches[0] : e;
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setCurrentPos({ x: 0, y: 0 });
    setCurrentRotation(IMAGES[activeIndex].rotation);
    setIsDragging(true);
    e.preventDefault();
  }, [isActive, activeIndex]);

  const handleTouchMove = useCallback((e) => {
    if (!isActive || !isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    setCurrentPos({ x: deltaX, y: deltaY });
    
    // Slight rotation based on drag distance
    const rotation = IMAGES[activeIndex].rotation + (deltaX / 20);
    setCurrentRotation(rotation);
    e.preventDefault();
  }, [isActive, isDragging, startPos, activeIndex]);

  const handleTouchEnd = useCallback((e) => {
    if (!isActive || !isDragging) return;
    
    // Always throw the card offscreen in the direction it was being moved
    const directionX = Math.sign(currentPos.x) || 1; // Default to right if x is 0
    const directionY = Math.sign(currentPos.y) || 0;
    
    // Throw the card offscreen with consistent speed
    const throwDistance = window.innerWidth * 1.5;
    const throwX = directionX * throwDistance;
    const throwY = directionY * throwDistance * 0.5;
    
    // Apply throw animation
    setCurrentPos({ x: throwX, y: throwY });
    
    // Move to next image after a short delay for the throw animation
    setTimeout(() => {
      setActiveIndex(prev => Math.min(prev + 1, IMAGES.length - 1));
      setCurrentPos({ x: 0, y: 0 });
      setCurrentRotation(IMAGES[activeIndex + 1]?.rotation || 0);
    }, 200);
    
    setIsDragging(false);
  }, [isActive, isDragging, currentPos, activeIndex]);

  const resetStack = useCallback(() => {
    setActiveIndex(0);
    setCurrentPos({ x: 0, y: 0 });
    setCurrentRotation(IMAGES[0].rotation);
  }, []);

  const eventHandlers = isActive ? {
    onMouseDown: handleTouchStart,
    onMouseMove: handleTouchMove,
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleTouchEnd,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  } : {};

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.stackContainer} ${!isActive ? styles.disabled : ''}`}
        style={{ pointerEvents: isActive ? 'auto' : 'none' }}
        {...eventHandlers}
      >
        {IMAGES.map((img, index) => (
          <div
            key={img.id}
            className={`${styles.throwable} ${index < activeIndex ? styles.thrown : ''}`}
            style={{
              zIndex: img.zIndex,
              opacity: index === activeIndex ? 1 : index < activeIndex ? 0 : 0.8,
              transform: `translate(${index === activeIndex ? currentPos.x : 0}px, ${index === activeIndex ? currentPos.y : 0}px) rotate(${index === activeIndex ? currentRotation : img.rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out, opacity 0.1s ease'
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={img.src}
                alt={`Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                priority={index === 0}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {activeIndex > 0 && (
        <div className={styles.buttonContainer}>
          <button 
            onClick={resetStack}
            className={styles.resetButton}
            style={{
              margin: '2rem 0 0 -1rem',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Reset Pile
          </button>
        </div>
      )}
    </div>
  );
};

export default ThrowableImages;