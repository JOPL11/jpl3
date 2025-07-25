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
                  <li>When you contact us through our contact form, we collect:
                    <ul className={styles.sublist}>
                      <li>Your name</li>
                      <li>Your email address</li>
                      <li>Your message content</li>
                      <li>Your IP address (for spam prevention)</li>
                      <li>Timestamp of your submission</li>
                    </ul>
                  </li>
                  <li>No analytics or tracking scripts are used on this website</li>
                  <li>Our hosting provider (Vercel) may collect basic request logs (IP address, browser type, pages visited) for security and operational purposes</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h3 className={styles.modalContentH3}>How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Respond to your inquiries and provide support</li>
                  <li>Prevent spam and ensure website security</li>
                  <li>Improve our website based on user feedback</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h3 className={styles.modalContentH3}>Data Storage</h3>
                <p>We use minimal, strictly necessary technologies:</p>
                <ul>
                  <li><strong>Form Submissions</strong>: When you submit the contact form:
                    <ul className={styles.sublist}>
                      <li>Your message is sent directly to Jan Peiro&apos;s email via a serverless function</li>
                      <li>The data is not stored in any database</li>
                      <li>Email records are kept for as long as necessary to handle your inquiry</li>
                      <li>You can request deletion of your data by sending an email to the address provided in the response to your inquiry</li>
                    </ul>
                  </li>
                  <li><strong>Self-hosted Fonts</strong>: All fonts are downloaded at build time and served directly from our domain with no external requests or tracking</li>
                </ul>
                <p>We do not use any cookies, tracking pixels, or analytics services.</p>
                <p>Our hosting provider (Vercel) may collect basic request logs (IP address, browser type, pages visited) for security and operational purposes, but this data is not shared with us or any third parties for tracking or marketing purposes.</p>
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
