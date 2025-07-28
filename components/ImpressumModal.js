'use client';

import { useEffect } from 'react';
import styles from './PrivacyModal.module.css';

export default function ImpressumModal({ isOpen, onClose }) {
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
        <h2 className={styles.modalContentH2}>Impressum</h2>
        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.modalContentH3}>Angaben gemäß § 5 TMG</h3>
            <p>
              Jan Peiro<br />
              Kapuziner Strasse 3<br />
              67547 Worms
            </p>
            
            <h3 className={styles.modalContentH3}>Kontakt</h3>
            <p>
              Telefon: +49 (0) 1520 317-2291<br />
              E-Mail: jan.peiro@protonmail.com
            </p>
            
            <h3 className={styles.modalContentH3}>Umsatzsteuer-ID</h3>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
              Wird Nachgereicht
            </p>
            
            <h3 className={styles.modalContentH3}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
            <p>Jan Peiro (Anschrift wie oben)</p>
            
            <h3 className={styles.modalContentH3}>Haftung für Inhalte</h3>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            
            <h3 className={styles.modalContentH3}>Haftung für Links</h3>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            
            <p className={styles.lastUpdated}>Stand: Juli 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}
