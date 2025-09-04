'use client';
import { useState, useCallback } from 'react';
import styles from '../css/ThrowableImages.module.css';

const IMAGES = [
  '/images/throwable/merc77.jpg',
  '/images/throwable/merc99.jpg',
  '/images/throwable/merc66.jpg',
 '/images/throwable/merc55.jpg',
// '/images/throwable/merc1.jpg',
].map((src, index) => ({
  id: index,
  src,
  rotation: [-3, 2, -2, 1, -2][index],
  zIndex: 5 - index,
}));

const ThrowableImages = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [positions, setPositions] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState(0);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches ? e.touches[0] : e;
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setCurrentPos({ x: 0, y: 0 });
    setCurrentRotation(IMAGES[activeIndex].rotation);
    setIsDragging(true);
    e.preventDefault();
  }, [activeIndex]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    setCurrentPos({ x: deltaX, y: deltaY });
    
    // Slight rotation based on drag distance
    const rotation = IMAGES[activeIndex].rotation + (deltaX / 20);
    setCurrentRotation(rotation);
    e.preventDefault();
  }, [isDragging, startPos, activeIndex]);

  const handleTouchEnd = useCallback((e) => {
    if (!isDragging) return;
    
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
  }, [isDragging, currentPos, activeIndex]);

  const resetStack = useCallback(() => {
    setActiveIndex(0);
    setCurrentPos({ x: 0, y: 0 });
    setCurrentRotation(IMAGES[0].rotation);
  }, []);

  return (
    <div className={styles.container}>
      <div 
        className={styles.stackContainer}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            <img
              src={img.src}
              alt={`Image ${index + 1}`}
              draggable="false"
            />
          </div>
        ))}
      </div>
      
      {activeIndex > 0 && (
        <button 
          onClick={resetStack}
          className={styles.resetButton}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          Reset Stack
        </button>
      )}
    </div>
  );
};

export default ThrowableImages;