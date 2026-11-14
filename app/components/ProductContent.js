'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import AnimatedText from './AnimatedText';
import ThrowableImages from './ThrowableImages';
import ModalFooter from './ModalFooter';
import styles from '../css/page.module.css';

export default function ProductContent() {
  const productHeadingRef = useRef(null);

  // Heading animation, timed to the slide-up (same as the other section modals)
  useEffect(() => {
    const t = setTimeout(() => {
      try { productHeadingRef.current?.animate?.(); } catch (e) { console.error(e); }
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className={`${styles.content} ${styles.modalColumn}`}>
        <h2>
          <AnimatedText ref={productHeadingRef}>Product Prototype Case</AnimatedText>
        </h2>
        <div style={{ height: '0.1rem', marginBottom: '3rem' }}>Tap or click the images.</div>

        <div className={styles.divider3}></div>
        <div className={styles.introText}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', paddingTop: '3rem' }}>
            Project: <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#acfeff' }}>&nbsp;Mercedes Benz dealership award.</span>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
            Client: <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#acfeff' }}>&nbsp;Sieber &amp; Wolf&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>

            <Image src="/images/agencies/sw_neu_white.png" alt="Sieber & Wolf" width={33} height={16} />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
            My Task: <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#acfeff', marginBottom: '3rem', display: 'block', lineHeight: '1.4' }}>Invent a new type of dealership award for Mercedes Benz. I thought up the concept, designed the whole piece including UI and put together a working tech-stack for a fully functional prototype.</span>
          </div>
        </div>
        <ThrowableImages />
      </div>

      <ModalFooter />
    </>
  );
}