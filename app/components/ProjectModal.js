'use client';

import Image from 'next/image';
import styles from '../Modal.module.css';

export default function ProjectModal({ title, description, images }) {
  return (
    <div className={styles.projectModal}>
      <h2>{title}</h2>
      <div className={styles.modalDescription}>
        {description}
      </div>
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
