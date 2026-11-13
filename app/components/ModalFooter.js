'use client';

import styles from '../css/page.module.css';
import { useModal } from './ModalContext';
import PrivacyContent from './PrivacyContent';

export default function ModalFooter() {
  const { openModal, closeModal } = useModal();

  // Scroll the modal's own scroller (not the window) back to the top
  const scrollModalToTop = (e) => {
    const scroller = e.currentTarget.closest('.scrollableContent');
    scroller?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Contact lives on the page behind the modal: close first, then scroll
  const goToContact = () => {
    closeModal();
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 1700); // close animation is 1600ms
  };

  return (
    <footer className={`${styles.footer} ${styles.modalFooter}`} role="contentinfo">
      <div className={styles.footerContainer}>
        <nav className={styles.footerLinks} role="navigation" aria-label="Footer navigation">
          <button
            onClick={scrollModalToTop}
            className={styles.backToTopFooter}
            aria-label="Back to top"
          >
            ↑
          </button>
          <div style={{ fontSize: '1.2rem' }}>
            <p>&copy; {new Date().getFullYear()} Jan Peiro</p>
          </div>
          <button
            onClick={() => openModal(<PrivacyContent />, 'privacyModal')}
            className={styles.footerLink}
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => openModal(<PrivacyContent scrollToTerms />, 'privacyModal')}
            className={styles.footerLink}
            aria-label="Terms of Service"
          >
            Terms of Service
          </button>
          <button
            onClick={goToContact}
            className={styles.footerLink}
            aria-label="Contact"
          >
            Contact
          </button>
          <a
            href="/assets/CV_2026_JanPeiro.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
            aria-label="Curriculum Vitae"
            style={{ textAlign: 'left', display: 'inline-block' }}
          >
            CV
          </a>
        </nav>
      </div>
    </footer>
  );
}