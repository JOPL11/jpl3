// components/Modal.js
'use client';

import { useEffect, useRef } from 'react';
import styles from '../css/Modal.module.css';

export default function Modal({ isOpen, onClose, children, fullBleed = false }) {
  const modalRef = useRef(null);
  const scrollY = useRef(0);
  const htmlRef = useRef(null);
  const bodyRef = useRef(null);

  // Close modal on ESC key and handle scroll locking
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    
    if (isOpen) {
      // Pause Locomotive Scroll if it exists
      if (window.lenis) {
        window.lenis.stop();
      }
      
      // Store the current scroll position
      scrollY.current = window.scrollY;
      
      // Store the current styles
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      const htmlStyle = window.getComputedStyle(document.documentElement);
      const bodyStyle = window.getComputedStyle(document.body);
      
      // Store the current styles for restoration
      const stylesToRestore = {
        html: {
          overflow: htmlStyle.overflow,
          position: htmlStyle.position,
          height: htmlStyle.height,
          width: htmlStyle.width,
          paddingRight: htmlStyle.paddingRight
        },
        body: {
          overflow: bodyStyle.overflow,
          position: bodyStyle.position,
          top: bodyStyle.top,
          left: bodyStyle.left,
          right: bodyStyle.right,
          paddingRight: bodyStyle.paddingRight
        }
      };
      
      // Lock the scroll
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.paddingRight = `${scrollBarWidth}px`;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      // Add event listener for ESC key
      document.addEventListener('keydown', handleEsc);
      
      return () => {
        // Remove event listener
        document.removeEventListener('keydown', handleEsc);
        
        // Restore styles
        Object.entries(stylesToRestore.html).forEach(([prop, value]) => {
          document.documentElement.style[prop] = value;
        });
        
        Object.entries(stylesToRestore.body).forEach(([prop, value]) => {
          document.body.style[prop] = value;
        });
        
        // Restore scroll position
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY.current);
          
          // Resume Locomotive Scroll if it exists
          if (window.lenis) {
            setTimeout(() => {
              window.lenis.start();
              window.lenis.scrollTo(0, { immediate: true });
            }, 0);
          }
        });
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} ref={modalRef} role="dialog" aria-modal="true">
      <div 
        className={`${styles.modalContent} ${fullBleed ? styles.fullBleed : ''}`} 
        onClick={(e) => e.stopPropagation()} 
        tabIndex="-1"
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}