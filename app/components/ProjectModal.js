'use client';

import Image from 'next/image';
import styles from '../Modal.module.css';

export default function ProjectModal({ title, description, images, clientLogo }) {
  return (
    <div className={styles.projectModal}>
      <div className={styles.modalHeader}>
        <h2>{title}</h2>
        {clientLogo && (
          <div className={styles.clientLogo}>
            <Image
              src={clientLogo}
              alt="Client Logo"
              width={80}
              height={40}
              className={styles.logoImage}
            />
          </div>
        )}
      </div>
      <div 
        className={styles.modalDescription}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className={styles.modalImages}>
        {images.map((img, index) => (
          <div key={index} className={styles.modalImageContainer}>
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={600}
              className={styles.modalImage}
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
