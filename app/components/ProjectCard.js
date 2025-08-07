'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../css/page.module.css';
import { useModal } from './ModalContext';
import ProjectModal from './ProjectModal';
import ModalLink from './ModalLink';

export default function ProjectCard({ 
  title, 
  children, 
  image, 
  alt, 
  link,
  openInModal = false, // New prop for modal behavior
  client,
  text, // Additional text to display below client info
  modalContent, // { description: string, images: Array<{src: string, alt: string}> }
  logoWidth = 160,  // Default width
  logoHeight = 80,
  logoStyle = {},   // Default height
  className = ''    // Add className prop with default empty string
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openModal } = useModal();
  
  const handleViewProject = (e) => {
    e.stopPropagation();
    if (modalContent) {
      openModal(
        <ProjectModal 
          title={title}
          description={modalContent.description}
          images={modalContent.images || []}
          videos={modalContent.videos || []}
          clientLogo={client?.logo}
        />
      );
    }
  };

  return (
    <div className={`${styles.projectCard} ${isExpanded ? styles.expanded : ''} ${className}`} role="gridcell" tabIndex="0">
      <h3>{title}</h3>
      {client && (
        <a 
          href={client.website || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.clientInfo}
          onClick={(e) => e.stopPropagation()}
        >
          <span><strong>Client:</strong> {client.name}</span>
          {client.logo && (
            <div className={styles.clientLogo}>
              <Image 
                src={client.logo} 
                alt={`${client.name} logo`}
                width={logoWidth}
                height={logoHeight}
                className={styles.logoImage}
                style={{
                  ...logoStyle,  // Spread the custom styles first
                  width: logoStyle.width || 'auto',
                  height: logoStyle.height || '100%',
                  objectFit: 'contain',
                  marginLeft: '0px',
                }}
              />
            </div>
          )}
        </a>
      )}
      {text && (
        <div 
          className={styles.additionalText}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
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
        {modalContent && (
          <button 
            className={styles.viewProjectButton}
            onClick={handleViewProject}
          >
            View 
          </button>
        )}
        {link && !modalContent && (
          openInModal ? (
            <ModalLink 
              href={link}
              className={styles.projectLink}
              title={title}
            >
              Launch
            </ModalLink>
          ) : (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              Launch
            </a>
          )
        )}
      </div>
    </div>
  );
}
