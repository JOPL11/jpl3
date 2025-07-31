// components/Modal.js
'use client';

import { useEffect, useRef } from 'react';
import styles from '../css/Modal.module.css';

export default function Modal({ isOpen, onClose, children, fullBleed = false }) {
  const modalRef = useRef(null);

  // Close modal on ESC key and handle scroll locking
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      // Get the current body styles
      const bodyStyle = window.getComputedStyle(document.body);
      
      // Add event listener for ESC key
      document.addEventListener('keydown', handleEsc);
      
      // Lock the body scroll without affecting layout
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
      
      return () => {
        // Cleanup function to restore scroll position
        document.removeEventListener('keydown', handleEsc);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} ref={modalRef} role="dialog" aria-modal="true">
      <div className={`${styles.modalContent} ${fullBleed ? styles.fullBleed : ''}`} onClick={(e) => e.stopPropagation()} tabIndex="-1">
        <button className={styles.closeButton} onClick={onClose}  aria-label="Close modal" >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}