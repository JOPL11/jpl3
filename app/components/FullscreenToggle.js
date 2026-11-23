'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from '../css/FullscreenToggle.module.css';

const getFsElement = () =>
  document.fullscreenElement || document.webkitFullscreenElement || null;

/**
 * Browser fullscreen toggle.
 *   <FullscreenToggle />                    fixed to the viewport, bottom right
 *   <FullscreenToggle variant="panel" />    absolute inside a modal panel
 * Renders nothing where the Fullscreen API isn't available (e.g. iPhone Safari).
 */
export default function FullscreenToggle({ variant = 'page' }) {
  const [supported, setSupported] = useState(false);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const ok =
      !!(document.fullscreenEnabled || document.webkitFullscreenEnabled) &&
      !!(el.requestFullscreen || el.webkitRequestFullscreen);
    setSupported(ok);
    if (!ok) return;

    const sync = () => setIsFull(!!getFsElement());
    sync();
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
    };
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (getFsElement()) {
        await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        const el = document.documentElement;
        await (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      }
    } catch (e) {
      console.warn('[FullscreenToggle]', e);
    }
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      className={`${styles.toggle} ${variant === 'panel' ? styles.panel : styles.page}`}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      aria-label={isFull ? 'Exit fullscreen' : 'Enter fullscreen'}
      aria-pressed={isFull}
    >
      <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor"
           strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isFull ? (
          <>
            <polyline points="9 4 9 9 4 9" />
            <polyline points="15 4 15 9 20 9" />
            <polyline points="9 20 9 15 4 15" />
            <polyline points="15 20 15 15 20 15" />
          </>
        ) : (
          <>
            <polyline points="4 9 4 4 9 4" />
            <polyline points="20 9 20 4 15 4" />
            <polyline points="4 15 4 20 9 20" />
            <polyline points="20 15 20 20 15 20" />
          </>
        )}
      </svg>
    </button>
  );
}