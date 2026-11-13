'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../css/Modal.module.css';
import Lenis from 'lenis';
import { ScrollVelocityContext } from '../contexts/ScrollVelocityContext';

export default function Modal({
  isOpen,
  isClosing = false,
  onClose,
  layers = [],
  fullBleed = false,
}) {
  const contentRef = useRef(null);
  // Same shape as the page-level provider's ref: px/ms, smoothed, decaying.
  // DeformImage etc. read this instead of window scroll while a modal is open.
  const velocityRef = useRef(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const topLayer = layers.length ? layers[layers.length - 1] : null;
  const topKey = topLayer ? topLayer.key : null;
  const topContentKey = topLayer ? topLayer.contentKey : null;

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

    // Velocity sampling: identical algorithm to ScrollVelocityProvider, but
    // reading this panel's scroller instead of window.scrollY.
    let lastY = wrapper.scrollTop;
    let lastT = performance.now();
    velocityRef.current = 0;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const raw = (wrapper.scrollTop - lastY) / dt;
        velocityRef.current += (raw - velocityRef.current) * 0.15;
        velocityRef.current *= 0.92;
      }
      lastY = wrapper.scrollTop;
      lastT = now;

      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      velocityRef.current = 0;
    };
  }, [isOpen, topKey, topContentKey]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={() => onCloseRef.current()}
    >
      <ScrollVelocityContext.Provider value={velocityRef}>
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
              key={layer.contentKey}
              ref={isTop ? contentRef : undefined}
              className={`scrollableContent ${layer.swap ? styles.contentFade : ''}`}
              style={{ overflowY: 'auto', height: '100%', width: '100%' }}
            >
              {/* Lenis needs exactly one child to measure (content) */}
              <div>{body}</div>
            </div>
          </div>
        );
      })}
      </ScrollVelocityContext.Provider>
    </div>
  );
}