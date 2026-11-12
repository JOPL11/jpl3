'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styles from '../css/Modal.module.css';

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

  const handleWheel = useCallback((e) => {
    const el = contentRef.current;
    if (!el) return;
    e.preventDefault();
    const { scrollTop, scrollHeight, clientHeight } = el;
    const isAtTop = scrollTop === 0 && e.deltaY < 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
    if (!isAtTop && !isAtBottom) el.scrollTop += e.deltaY * 0.8;
  }, []);

  // Scroll lock + ESC + bleed killer: once per open, not per swap
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === 'Escape' && onCloseRef.current();
    const killBleed = (e) => e.preventDefault();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('wheel', killBleed, { passive: false });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('wheel', killBleed);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.activeElement?.blur?.();
    };
  }, [isOpen]);

  // Wheel listener must re-attach to each new top panel's scroll node
  useEffect(() => {
    if (!isOpen) return;
    const el = contentRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [isOpen, topKey, handleWheel]);

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
            <div
              ref={isTop ? contentRef : undefined}
              className="scrollableContent"
              style={{ overflowY: 'auto', overflowX: 'visible !important', height: '100%', width: '100%' }}
            >
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
}