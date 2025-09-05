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

const MIN_SWIPE_DISTANCE = 1; // Minimum distance in pixels to trigger throw
const THROW_VELOCITY_MULTIPLIER = 50; // How much faster the throw is than the swipe

const ThrowableImages = ({ isActive = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [positions, setPositions] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState(0);

  const resetStack = useCallback(() => {
    setActiveIndex(0);
    setCurrentPos({ x: 0, y: 0 });
    setCurrentRotation(IMAGES[0].rotation);
  }, []);

  const handleClick = useCallback((e, index) => {
    // Only reset if clicking on the last visible card
    if (index === activeIndex - 1 && activeIndex > 0) {
      e.stopPropagation();
      resetStack();
    }
  }, [activeIndex, resetStack]);

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
    
    const distance = Math.sqrt(currentPos.x * currentPos.x + currentPos.y * currentPos.y);
    
    if (distance < MIN_SWIPE_DISTANCE) {
      // If swipe distance is too small, just snap back to original position
      setCurrentPos({ x: 0, y: 0 });
      setCurrentRotation(IMAGES[activeIndex].rotation);
      setIsDragging(false);
      return;
    }
    
    // Calculate throw velocity based on swipe speed
    const throwX = currentPos.x * THROW_VELOCITY_MULTIPLIER;
    const throwY = currentPos.y * THROW_VELOCITY_MULTIPLIER;
    
    // Apply throw animation
    setCurrentPos({ x: throwX, y: throwY });
    
    // Only proceed to next card if the throw distance is significant
    if (distance >= MIN_SWIPE_DISTANCE) {
      // Move to next image after a short delay for the throw animation
      setTimeout(() => {
        setActiveIndex(prev => Math.min(prev + 1, IMAGES.length - 1));
        setCurrentPos({ x: 0, y: 0 });
        setCurrentRotation(IMAGES[activeIndex + 1]?.rotation || 0);
      }, 200);
    }
    
    setIsDragging(false);
  }, [isActive, isDragging, currentPos, activeIndex]);

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
        {IMAGES.map((img, index) => {
          const isLastVisible = index === activeIndex - 1;
          const isActiveCard = index === activeIndex;
          
          return (
            <div
              key={img.id}
              className={`${styles.throwable} ${index < activeIndex ? styles.thrown : ''} ${isLastVisible ? styles.lastVisible : ''}`}
              style={{
                zIndex: img.zIndex,
                opacity: isActiveCard ? 1 : index < activeIndex ? 0 : 0.8,
                transform: `translate(${isActiveCard ? currentPos.x : 0}px, ${isActiveCard ? currentPos.y : 0}px) rotate(${isActiveCard ? currentRotation : img.rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out, opacity 0.1s ease',
                cursor: isActiveCard ? (isDragging ? 'grabbing' : 'grab') : 'default',
                pointerEvents: isActiveCard ? 'auto' : 'none',
                touchAction: isActiveCard ? 'none' : 'auto',
              }}
              onClick={(e) => {
                if (isLastVisible) {
                  e.stopPropagation();
                  resetStack();
                }
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
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'white',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  pointerEvents: 'none'
                }}>
                  {index + 1}
                </div>
                {isLastVisible && (
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
                    Click to reset stack
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