'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import SectionTracker from './SectionTracker';
import MouseGradient from './MouseGradient';
import AnimatedText from './AnimatedText';
import styles from '../app/css/page.module.css';
import PrivacyStyles from '../app/css/PrivacyModal.module.css';

// Dynamically import heavy components
const Logo3D = dynamic(() => import('./Logo3D'), {
  ssr: false,
  loading: () => (
    <Image 
      src="/images/jp.svg" 
      alt="" 
      width={380}
      height={380}
      className={styles.contentLogo}
      priority
      aria-hidden="true"
    />
  )
});

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '60vh', background: '#000' }} />
});

const PrivacyModal = dynamic(() => import('./PrivacyModal'), { ssr: false });
const ImpressumModal = dynamic(() => import('./ImpressumModal'), { ssr: false });

function useViewportWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

export default function ContentComponent() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);
  const [modalContent, setModalContent] = useState('privacy');
  const [activeSection, setActiveSection] = useState('welcome-heading');
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth < 768;

  // Your existing refs and effects here...
  const aboutHeadingRef = useRef(null);
  const skillsHeadingRef = useRef(null);
  const workHeadingRef = useRef(null);
  const contactHeadingRef = useRef(null);
  const projectsRef = useRef({});
  const facilityTextRef = useRef(null);
  const roadrichTextRef = useRef(null);

  // Map section IDs to their refs
  const sectionRefs = useMemo(() => ({
    'welcome-heading': aboutHeadingRef,
    'skills-heading': skillsHeadingRef,
    'work-heading': workHeadingRef,
    'contact-heading': contactHeadingRef,
    // Add other section refs as needed
  }), []);

  // Your existing component JSX here...
  return (
    <div className={styles.container}>
      {/* Your existing layout */}
      <div className={styles.contentLogo}>
        <Logo3D />
      </div>
      
      {/* Rest of your content */}
      <section id="welcome-heading" className={`${styles.content} ${styles.scrollTarget}`}>
        {/* Your sections */}
      </section>

      {/* Modals */}
      {showPrivacyModal && (
        <PrivacyModal 
          onClose={() => setShowPrivacyModal(false)}
          content={modalContent}
          onSwitchContent={() => setModalContent(modalContent === 'privacy' ? 'imprint' : 'privacy')}
        />
      )}
      
      {showImpressumModal && (
        <ImpressumModal 
          onClose={() => setShowImpressumModal(false)}
        />
      )}
    </div>
  );
}
