'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from '../css/page.module.css';

export default function ProfileCarousel({ images, activeSize = 250, dormantSize = 120 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  // Responsive sizing
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentActiveSize = isMobile ? 160 : activeSize;
  const currentDormantSize = isMobile ? 70 : dormantSize;

  // Calculate item widths: active item gets full size, others get dormant size
  const getItemWidth = (index) => {
    return index === activeIndex ? currentActiveSize : currentDormantSize;
  };

  // Calculate the translateX to center the active item
  const getTranslateX = useCallback(() => {
    if (!containerRef.current) return 0;
    
    const containerWidth = containerRef.current.offsetWidth;
    let offset = 0;
    
    // Sum widths of all items before the active one
    for (let i = 0; i < activeIndex; i++) {
      offset += getItemWidth(i) + 12; // +12 for padding (6px each side)
    }
    
    // The active item's center position in the track
    const activeItemCenter = offset + (currentActiveSize / 2);
    
    // We want the active item centered in the container
    // But if it's the last item, don't scroll past the end
    const maxScroll = trackRef.current 
      ? trackRef.current.scrollWidth - containerWidth 
      : 0;
    
    let translateX = containerWidth / 2 - activeItemCenter;
    
    // Clamp so we don't show empty space on the right
    if (translateX < -maxScroll) translateX = -maxScroll;
    // Allow a little space on the left for the first item
    if (translateX > 0) translateX = 0;
    
    return translateX;
  }, [activeIndex, currentActiveSize, currentDormantSize]);

  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    setTranslateX(getTranslateX());
  }, [getTranslateX]);

  // Handle next/prev
  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(images.length - 1, index)));
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  // Wheel / scroll support to navigate the carousel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;
    let scrollTimeout;

    const handleWheel = (e) => {
      // Only horizontal wheel gestures or shift+wheel
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isScrolling) return;
        isScrolling = true;
        
        if (e.deltaX > 15) goNext();
        else if (e.deltaX < -15) goPrev();
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { isScrolling = false; }, 200);
      }
    };

    // Touch swipe support
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchStartX - touchEndX;
      const dy = touchStartY - touchEndY;
      
      // Only horizontal swipes
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        e.stopPropagation();
        if (dx > 0) goNext();
        else goPrev();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(scrollTimeout);
    };
  }, [activeIndex, images.length]);

  // Keyboard support
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.tabIndex = 0;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <div className={styles.profileCarouselOuter}>
      <div
        ref={containerRef}
        className={styles.profileCarousel}
        role="region"
        aria-label="Image carousel"
        aria-roledescription="carousel"
      >
        <div
          ref={trackRef}
          className={styles.profileCarouselTrack}
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className={`${styles.profileCarouselItem} ${i === activeIndex ? styles.active : ''}`}
              style={{
                width: `${getItemWidth(i)}px`,
                height: `${getItemWidth(i)}px`,
              }}
              onClick={() => goTo(i)}
              role="button"
              tabIndex={0}
              aria-label={`View image ${i + 1} of ${images.length}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goTo(i); }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={getItemWidth(i)}
                height={getItemWidth(i)}
                className={styles.profileCarouselImage}
                quality={100}
              />
            </div>
          ))}
        </div>

        {/* Arrows + Dots — unchanged, now positioned inside .profileCarousel
        {activeIndex > 0 && (
          <button
            className={`${styles.profileCarouselArrow} ${styles.left}`}
            onClick={goPrev}
            aria-label="Previous image"
          >‹</button>
        )}
        {activeIndex < images.length - 1 && (
          <button
            className={`${styles.profileCarouselArrow} ${styles.right}`}
            onClick={goNext}
            aria-label="Next image"
          >›</button>
        )}
        <div className={styles.profileCarouselDots} role="tablist" aria-label="Image navigation">
          {images.map((_, i) => (
            <button
              key={i}
              className={`${styles.profileCarouselDot} ${i === activeIndex ? styles.active : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>  */}
      </div>
    </div>
  );
}