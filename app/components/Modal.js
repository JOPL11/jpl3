// components/Modal.js
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styles from '../css/Modal.module.css';

export default function Modal({ isOpen, onClose, children, fullBleed = false }) {
  const modalRef = useRef(null);
  const scrollY = useRef(0);
  const contentRef = useRef(null);

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
  
  // Set up the content ref with the modal content element
  const setContentRef = (node) => {
    contentRef.current = node;
    
    // If we have a node and it's the first time setting it up,
    // add the scrollable class and styles
    if (node) {
      node.classList.add('scrollableContent');
      node.style.overflowY = 'auto';
      node.style.height = '100%';
    }
  };

  // Handle ESC key and scroll locking
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    
    if (isOpen) {
      // Store current scroll position
      scrollY.current = window.scrollY;
      
      // Add event listeners
      window.addEventListener('keydown', handleEsc);
      
      // Lock body scroll while maintaining layout
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.width = '100%';
      
      // Add wheel event listener for smooth scrolling
      const contentElement = contentRef.current;
      if (contentElement) {
        contentElement.addEventListener('wheel', handleWheel, { passive: false });
      }
      
      return () => {
        // Cleanup
        window.removeEventListener('keydown', handleEsc);
        
        if (contentElement) {
          contentElement.removeEventListener('wheel', handleWheel);
        }
        
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
  }, [isOpen, onClose, handleWheel]);

  // Simple children renderer that wraps content in a scrollable container
  const renderChildren = () => {
    if (!children) return null;
    
    // If children is a function, call it with the content ref
    if (typeof children === 'function') {
      return (
        <div ref={setContentRef} className="scrollableContent">
          {children({ contentRef })}
        </div>
      );
    }
    
    // Otherwise, wrap the children in a scrollable container
    return (
      <div ref={setContentRef} className="scrollableContent">
        {children}
      </div>
    );
  };

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
        {renderChildren()}
      </div>
    </div>
  );
}