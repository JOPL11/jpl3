'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './css/LogoGrid.module.css';
import { COMPANY_DESCRIPTIONS } from '../data/companyDescriptions';
import DOMPurify from 'dompurify';

export default function LogoGrid() {
  const [logos, setLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const tooltipRefs = useRef({});

  // Load logos on component mount
  useEffect(() => {
    const loadLogos = async () => {
      try {
        const response = await fetch('/api/logos');
        if (!response.ok) throw new Error('Failed to fetch logos');
        const logoFiles = await response.json();
        setLogos(logoFiles);
      } catch (error) {
        console.error('Error loading logos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogos();
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeTooltip && !tooltipRefs.current[activeTooltip]?.contains(event.target)) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [activeTooltip]);

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['br', 'strong', 'em', 'a', 'p', 'span'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
      })
    };
  };

  const handleLogoClick = (e, logo) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTooltip(activeTooltip === logo ? null : logo);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading client logos...</div>;
  }

  if (logos.length === 0) {
    return <div className={styles.empty}>No logos found</div>;
  }

  return (
    <div className={styles.logoGrid}>
      {logos.map((logo) => (
        <div 
          key={logo} 
          className={`${styles.logoItem} ${activeTooltip === logo ? styles.active : ''}`}
          ref={el => tooltipRefs.current[logo] = el}
        >
          <div 
            className={styles.tooltip}
            onClick={(e) => handleLogoClick(e, logo)}
            onTouchStart={(e) => handleLogoClick(e, logo)}
            role="button"
            tabIndex={0}
            aria-expanded={activeTooltip === logo}
            aria-label={`Show details for ${logo.split('.')[0]}`}
          >
            <Image
              src={`/images/mini/${logo}`}
              alt={logo.split('.')[0]}
              width={150}
              height={150}
              className={styles.logo}
            />
            <span 
                className={`${styles.tooltipText} ${activeTooltip === logo ? styles.visible : ''}`}
                role="tooltip"
                dangerouslySetInnerHTML={createMarkup(
                COMPANY_DESCRIPTIONS[logo] || `Under Construction`
                )}
            />

            </div>
        </div>
      ))}
    </div>
  );
}