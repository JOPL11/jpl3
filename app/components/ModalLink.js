'use client';

import { useModal } from './ModalContext';
import { useCallback } from 'react';
import styles from '../css/ModalLink.module.css';

export default function ModalLink({ 
  href, 
  children, 
  className = '', 
  title = 'External Content',
  ...props 
}) {
  const { openModal } = useModal();

  const handleClick = useCallback((e) => {
    e.preventDefault();
    openModal(
      <div className={styles.fullBleedModal}>
        <iframe 
          src={href}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#1a1a1a',
            minHeight: '70vh',
            minWidth: '100%',
            display: 'block',
            margin: 0,
            padding: 0
          }}
          title={title}
          allowFullScreen
          allow="fullscreen"
          loading="lazy"
        />
      </div>
    );
  }, [href, openModal, title]);

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
