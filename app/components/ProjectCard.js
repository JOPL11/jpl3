'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';

export default function ProjectCard({ title, children, image, alt, link }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`${styles.projectCard} ${isExpanded ? styles.expanded : ''}`} role="gridcell" tabIndex="0">
      <h3>{title}</h3>
      <div className={`${styles.cardContent} ${isExpanded ? styles.showContent : ''}`}>
        {children}
      </div>
      <div className={styles.projectImage}>
        <Image 
          src={image} 
          alt={alt}
          width={800}
          height={600}
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          priority
        />
      </div>
      <div className={styles.cardActions}>
        <button 
          className={styles.moreButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.projectLink}
          >
            View Project
          </a>
        )}
      </div>
    </div>
  );
}
