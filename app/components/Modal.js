'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../css/Modal.module.css';
import Lenis from 'lenis';

export default function Modal({
  isOpen,
  isClosing = false,
  onClose,
  layers = [],
  fullBleed = false,
}) {
  const contentRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const topKey = layers.length ? layers[layers.length - 1].key : null;

  // Page scroll lock + ESC: once per open, not per swap.
  // (Wheel bleed is handled by overflow:hidden on html/body plus the page
  // Lenis being stopped in ModalContext, so no window wheel listener needed.)
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => e.key === 'Escape' && onCloseRef.current();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    window.addEventListener('keydown', handleEsc);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.activeElement?.blur?.();
    };
  }, [isOpen]);

  // One Lenis instance per top panel. Re-runs when a new panel mounts,
  // destroying the previous instance.
  useEffect(() => {
    if (!isOpen) return;
    const wrapper = contentRef.current;
    if (!wrapper || !wrapper.firstElementChild) return;

    const lenis = new Lenis({
      wrapper,
      content: wrapper.firstElementChild,
      lerp: 0.1,
      smoothWheel: true,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isOpen, topKey]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={() => onCloseRef.current()}
    >
      {layers.map((layer, i) => {
        const isTop = i === layers.length - 1;
        const body =
          typeof layer.content === 'function'
            ? layer.content({ contentRef })
            : layer.content;

        return (
          <div
            key={layer.key}
            className={[
              styles.modalContent,
              layer.className,
              fullBleed ? styles.fullBleed : '',
              isTop && isClosing ? styles.closing : '',
              !isTop ? styles.outgoing : '',
            ].join(' ')}
            onClick={(e) => e.stopPropagation()}
            aria-hidden={!isTop}
          >
            {isTop && (
              <button
                className={styles.closeButton}
                onClick={() => onCloseRef.current()}
                aria-label="Close modal"
              >
                &times;
              </button>
            )}
            {/* Scroller (wrapper) */}
            <div
              ref={isTop ? contentRef : undefined}
              className="scrollableContent"
              style={{ overflowY: 'auto', height: '100%', width: '100%' }}
            >
              {/* Lenis needs exactly one child to measure (content) */}
              <div>{body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}