'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from '../app/css/Modal.module.css';

export default function PrivacyModal({ isOpen, onClose, type = 'privacy' }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef(null);
  const scrollY = useRef(0);

  // Handle smooth scrolling for mouse wheel
  const handleWheel = useCallback((e) => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtTop = scrollTop === 0 && e.deltaY < 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
    
    // Only prevent default if we're not at the boundaries
    if (!isAtTop && !isAtBottom) {
      e.preventDefault();
      // Smooth scroll the content
      contentRef.current.scrollTop += e.deltaY * 0.8;
    }
  }, []);

  // Load content based on type
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/content/${type}.md`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading content:', error);
        setContent(`# ${type === 'privacy' ? 'Privacy Policy' : 'Impressum'}\n\nContent could not be loaded.`);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadContent();
    }
  }, [isOpen, type]);

  // Handle ESC key and scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => e.key === 'Escape' && onClose();
    
    // Store current scroll position
    scrollY.current = window.scrollY;
    
    // Lock body scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.width = '100%';
    
    // Add event listeners
    window.addEventListener('keydown', handleEsc);
    if (contentRef.current) {
      contentRef.current.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      // Cleanup
      window.removeEventListener('keydown', handleEsc);
      if (contentRef.current) {
        contentRef.current.removeEventListener('wheel', handleWheel);
      }
      
      // Restore body scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollY.current);
    };
  }, [isOpen, onClose, handleWheel]);

  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div 
        className={`${styles.modalContent} ${styles.privacyModal}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        
        <div 
          ref={contentRef}
          className={styles.scrollableContent}
          style={{ 
            padding: '2rem',
            color: '#f0f0f0',
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      </div>
    </div>
  );
}
