'use client';

import { useEffect, useState } from 'react';
import styles from '../app/css/PrivacyModal.module.css';

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
        <h2 className={styles.modalContentH2}>Privacy Policy</h2>
        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.modalContentH3}>Information We Collect</h3>
            <p>We are committed to your privacy. The only information we collect and store is:</p>
            <ul>
              <li>When you contact us through our contact form, we collect:
                <ul className={styles.sublist}>
                  <li>Your email address</li>
                  <li>Your message content</li>
                </ul>
              </li>
              <li>No analytics or tracking scripts are used on this website</li>
              <li>Our hosting provider (Vercel) maintains server logs for operational purposes, but we do not access or store this data</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.modalContentH3}>How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries</li>
              <li>Improve our services based on your feedback</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.modalContentH3}>Data Storage</h3>
            <p>We use minimal, strictly necessary technologies:</p>
            <ul>
              <li><strong>Form Submissions</strong>:
                <ul className={styles.sublist}>
                  <li>Your message is sent directly to Jan Peiro&apos;s email via a serverless function</li>
                  <li>The data is not stored in any database</li>
                  <li>Email records are kept for as long as necessary to handle your inquiry</li>
                </ul>
              </li>
              <li><strong>Self-hosted Assets</strong>: All fonts and assets are served directly from our domain</li>
            </ul>

            <h3 className={styles.modalContentH3} style={{ marginTop: '1.5rem' }}>Third-Party Services</h3>
            <p>This website may include embedded content from:</p>
            <ul>
              <li><strong>Vimeo</strong>: For video content. When you view embedded videos, Vimeo may collect data about your interaction. <a href="https://vimeo.com/privacy" target="_blank" rel="noopener noreferrer">View Vimeo&apos;s privacy policy</a></li>
            </ul>
          </section>

          <section className={styles.section} style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h2 className={styles.modalContentH2}>Terms of Service</h2>
            <p>By using this website, you agree to the following terms:</p>
            <ul>
              <li>You will not use this site for any unlawful purpose</li>
              <li>You will not attempt to gain unauthorized access to any part of the site</li>
              <li>You are responsible for any content you submit through the contact form</li>
              <li>We reserve the right to modify these terms at any time</li>
            </ul>
            <p>Last updated: August 22, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}
