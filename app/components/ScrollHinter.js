'use client';

import { useEffect, useState } from 'react';
import styles from '../css/ScrollHinter.module.css';

/**
 * Signals that a modal or page is scrollable.
 *
 * - Modal:  <ScrollHint targetRef={contentRef} watchKey={layer.contentKey} />
 *           (absolutely positioned inside the panel)
 * - Page:   <ScrollHint />   (watches the window, fixed to the viewport)
 *
 * Shows after `delay` ms, only if there is actually something to scroll,
 * fades out once the user scrolls past `threshold` px, and returns if they
 * scroll back to the top. Never intercepts pointer events.
 */
export default function ScrollHint({
  targetRef = null,
  watchKey = 0,        // change to re-attach (e.g. when a modal's content swaps)
  threshold = 40,      // px scrolled before the hint hides
  minOverflow = 80,    // px of scrollable content required to show at all
  delay = 2000,        // ms before first appearing (lets slide-ins finish)
  label = 'Scroll',
}) {
  const [visible, setVisible] = useState(false);



  
  useEffect(() => {
    const el = targetRef ? targetRef.current : null;
    if (targetRef && !el) return;

    const isWindow = !targetRef;
    const doc = document.documentElement;
    let armed = false;

    const metrics = () =>
      isWindow
        ? { top: window.scrollY, total: doc.scrollHeight, view: window.innerHeight }
        : { top: el.scrollTop, total: el.scrollHeight, view: el.clientHeight };

    const update = () => {
      if (!armed) return;
      const { top, total, view } = metrics();
      setVisible(total - view > minOverflow && top < threshold);
    };

    const timer = setTimeout(() => {
      armed = true;
      update();
    }, delay);

    const target = isWindow ? window : el;
    target.addEventListener('scroll', update, { passive: true });

    // Content (images, video) can change height after mount
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(isWindow ? doc : el);
      if (!isWindow && el.firstElementChild) ro.observe(el.firstElementChild);
    }

    return () => {
      clearTimeout(timer);
      target.removeEventListener('scroll', update);
      ro?.disconnect();
      setVisible(false);
    };
  }, [targetRef, watchKey, threshold, minOverflow, delay]);

  return (
    <div
      className={`${styles.hint} ${targetRef ? styles.inPanel : styles.inPage} ${
        visible ? styles.visible : ''
      }`}
      aria-hidden="true"
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.chevrons}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}