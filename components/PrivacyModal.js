'use client';

import { useEffect } from 'react';
import styles from './PrivacyModal.module.css';

export default function PrivacyModal({ isOpen, onClose, type = 'privacy' }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 className={styles.modalContentH2}>
          {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </h2>
        <div className={styles.content}>
          {type === 'privacy' ? (
            <>
              <section className={styles.section}>
                <h3 className={styles.modalContentH3}>Information We Collect</h3>
                <p>We collect minimal information to provide our services to you:</p>
                <ul>
                  <li>Information you provide when contacting us through our contact form (your email address and message content)</li>
                  <li>No analytics or tracking scripts are used on this website</li>
                  <li>Our hosting provider (Vercel) may collect basic request logs (IP address, browser type, pages visited) for security and operational purposes, but if he does, he doesn&apos;t share that with me. And honestly, I don&apos;t even want to see that kind of stuff.</li>
                  <li>I have no interest in it at all.</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h3 className={styles.modalContentH3}>How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve our website and services</li>
                  <li>Ensure the security of our website</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h3 className={styles.modalContentH3}>Cookies and Similar Technologies</h3>
                <p>We use necessary cookies to:</p>
                <ul>
                  <li>Load and display our custom fonts (InterDisplay)</li>
                  <li>Remember your cookie preferences</li>
                </ul>
                <p>These cookies are essential for the website to function properly and cannot be disabled.</p>
              </section>
            </>
          ) : (
            <section className={styles.section}>
              <h3 className={styles.modalContentH3}>Terms of Service</h3>
              <p>By using this website, you agree to the following terms:</p>
              <ul>
                <li>You will not use this site for any unlawful purpose</li>
                <li>You will not attempt to gain unauthorized access to any part of the site</li>
                <li>You are responsible for any content you submit through the contact form</li>
                <li>We reserve the right to modify these terms at any time</li>
              </ul>
              <p>Last updated: July 23, 2025</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
