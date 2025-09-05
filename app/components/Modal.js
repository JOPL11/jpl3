// components/Modal.js
'use client';

import { useEffect, useRef } from 'react';
import styles from '../css/Modal.module.css';

export default function Modal({ isOpen, onClose, children, fullBleed = false }) {
  const modalRef = useRef(null);
  const scrollY = useRef(0);

  // Handle ESC key and scroll locking
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    
    if (isOpen) {
      // Store current scroll position
      scrollY.current = window.scrollY;
      
      // Add event listener for ESC key
      window.addEventListener('keydown', handleEsc);
      
      // Lock body scroll while maintaining layout
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Cleanup
        window.removeEventListener('keydown', handleEsc);
        
        // Restore body scroll and position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position after a small delay to allow DOM to update
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY.current);
        });
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        ref={modalRef}
        className={`${styles.modalContent} ${fullBleed ? styles.fullBleed : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}