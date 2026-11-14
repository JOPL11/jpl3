'use client';

import { useEffect, useRef } from 'react';
import AnimatedText from './AnimatedText';
import styles from '../css/page.module.css';

export default function OverviewHeader() {
  const headingRef = useRef(null);

  // Same timing as the section modals: play as the panel finishes sliding in.
  useEffect(() => {
    const t = setTimeout(() => {
      try { headingRef.current?.animate?.(); } catch (e) { console.error(e); }
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <h2>
        <AnimatedText ref={headingRef}>Overview</AnimatedText>
      </h2>
      <div className={styles.divider3}></div>
    </>
  );
}