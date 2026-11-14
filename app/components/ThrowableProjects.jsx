'use client';
import { useState, useCallback, useRef } from 'react';
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
  // Scope all DOM work to THIS instance. document.querySelector would also
  // match another copy of the stack elsewhere on the page (e.g. under a modal).
  const stackRef = useRef(null);

  const handleClick = useCallback(() => {
    if (isAnimating || !stackRef.current) return;

    setIsAnimating(true);

    const cards = Array.from(stackRef.current.children);
    const card = cards[activeIndex];

    // Animate the current card out
    if (card) {
      card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
      card.style.transform = `translate(500px, -200px) rotate(30deg)`;
      card.style.opacity = '0';
    }

    // Move to next image after animation
    setTimeout(() => {
      const newIndex = (activeIndex + 1) % IMAGES.length;

      // Wrapped around: animate the whole stack back in from the left, staggered
      if (newIndex === 0) {
        cards.forEach((c, idx) => {
          c.style.transition = 'none';
          c.style.transform = 'translateX(-1000px)';
          c.style.opacity = '0';

          void c.offsetHeight; // force reflow

          setTimeout(() => {
            c.style.transition = `transform 0.5s ease-out ${idx * 100}ms, opacity 0.5s ease ${idx * 100}ms`;
            c.style.transform = `rotate(${IMAGES[idx].rotation}deg)`;
            c.style.opacity = '1';
          }, 10);
        });
      } else if (card) {
        // Normal transition: put the thrown card back in place, hidden
        card.style.transition = 'none';
        card.style.transform = `rotate(${IMAGES[activeIndex].rotation}deg)`;
        card.style.opacity = '0.8';
        void card.offsetHeight;
      }

      setActiveIndex(newIndex);
      setIsAnimating(false);
    }, 300);
  }, [activeIndex, isAnimating]);

  return (
    <div className={styles.container}>
      <div ref={stackRef} className={styles.stackContainer} onClick={handleClick}>
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