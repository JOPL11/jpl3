'use client';

import styles from '../css/PrivacyModal.module.css';

export default function PrivacyContent() {
  return (
    <>
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
            <li>We use Vercel Web Analytics to measure aggregate, anonymized traffic to this site. This tool does not use cookies, does not store any information on your device, and does not track you across websites or over time</li>
            <li>Our hosting provider (Vercel) maintains server logs for operational purposes, but we do not access or store this data</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.modalContentH3}>How We Use Your Information</h3>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your inquiries</li>
            <li>Understand aggregate site usage (e.g., which pages are most visited) so we can improve the site</li>
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
            <li><strong>Analytics</strong>:
              <ul className={styles.sublist}>
                <li>Vercel Web Analytics processes aggregated, anonymized usage data</li>
                <li>No cookies are set and no persistent identifiers are stored on your device</li>
                <li>Any temporary identifiers are discarded within 24 hours</li>
                <li>The legal basis for this processing is our legitimate interest in understanding how the site is used</li>
              </ul>
            </li>
            <li><strong>Self-hosted Assets</strong>: All fonts and assets are served directly from our domain</li>
          </ul>

          <h3 className={styles.modalContentH3} style={{ marginTop: '1.5rem' }}>Third-Party Services</h3>
          <p>This website may include embedded content from:</p>
          <ul>
            <li><strong>MUX</strong>: For video delivery. We have disabled all telemetry and tracking on our MUX integration. <a href="https://www.mux.com/privacy" target="_blank" rel="noopener noreferrer">View MUX&apos;s privacy policy</a></li>
            <li><strong>Vercel</strong>: For hosting and analytics. Vercel processes data on our behalf under a data processing agreement. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">View Vercel&apos;s privacy policy</a></li>
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
          <p>Last updated: October 30, 2026</p>
        </section>
      </div>
    </>
  );
}