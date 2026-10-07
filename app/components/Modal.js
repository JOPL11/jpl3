// components/Modal.js
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styles from '../css/Modal.module.css';
import Image from 'next/image';

export default function Modal({
  isOpen,
  isClosing = false,
  onClose,
  children,
  fullBleed = false,
  className = '',
}) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Handle smooth scrolling for mouse wheel inside the modal content
const handleWheel = useCallback((e) => {
  if (!contentRef.current) return;

  // Always prevent scroll bleed to the page beneath
  e.preventDefault();

  const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
  const isAtTop = scrollTop === 0 && e.deltaY < 0;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;

  // Only scroll the modal content if not at the boundaries
  if (!isAtTop && !isAtBottom) {
    contentRef.current.scrollTop += e.deltaY * 0.8;
  }
}, []);

  // Delegates close to the context, which orchestrates the outro animation
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Set up the content ref with the modal content element
  const setContentRef = (node) => {
    contentRef.current = node;

    if (node) {
      node.classList.add('scrollableContent');
      node.style.overflowY = 'auto';
      node.style.height = '100%';
    }
  };

  // Body scroll lock, ESC handler, wheel listener — only while isOpen
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && handleClose();

    if (isOpen) {
      // Prevent layout shift when the scrollbar disappears
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      window.addEventListener('keydown', handleEsc);

      // Pure bleed-killer: swallow every wheel event on the window so the
    // page beneath the modal can never scroll, regardless of where the
    // cursor is.
    const killBleed = (e) => e.preventDefault();
    window.addEventListener('wheel', killBleed, { passive: false });

      // Simple, non-destructive scroll lock.
      // Preserves window.scrollY so programmatic scrolls still work
      // and no restoration is needed on cleanup.
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      const contentElement = contentRef.current;
      if (contentElement) {
        contentElement.addEventListener('wheel', handleWheel, { passive: false });
      }

      return () => {
        window.removeEventListener('keydown', handleEsc);
        if (contentElement) {
          contentElement.removeEventListener('wheel', handleWheel);
        }
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        

        // Drop focus from any modal elements
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      };
    }
  }, [isOpen, handleClose, handleWheel]);

  // Render children, wrapping them in a scrollable container
  const renderChildren = () => {
    if (!children) return null;

    if (typeof children === 'function') {
      return (
        <div ref={setContentRef} className="scrollableContent">
          {children({ contentRef })}
        </div>
      );
    }

    return (
      <div ref={setContentRef} className="scrollableContent">
        {children}
      </div>
    );
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={`${styles.modalContent} ${className} ${fullBleed ? styles.fullBleed : ''} ${isClosing ? styles.closing : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
  
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {renderChildren()}
      </div>
    </div>
  );
}