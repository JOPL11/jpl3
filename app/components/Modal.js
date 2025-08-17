// components/Modal.js
'use client';

import { useEffect, useRef } from 'react';
import styles from '../css/Modal.module.css';

export default function Modal({ isOpen, onClose, children, fullBleed = false }) {
  const modalRef = useRef(null);
  const scrollY = useRef(0);

  // Close modal on ESC key and handle scroll locking
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    
    if (isOpen) {
      // Store the current scroll position
      scrollY.current = window.scrollY;
      
      // Add event listener for ESC key
      document.addEventListener('keydown', handleEsc);
      
      // Lock the body scroll without affecting layout
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';

      
      
      return () => {
        // Cleanup function to restore scroll position
        document.removeEventListener('keydown', handleEsc);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY.current);
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