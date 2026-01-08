"use client";

import { useState } from 'react';
import styles from '../css/ContactForm.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    gdprConsent: false
  });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    gdprConsent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '', gdprConsent: false });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.contactForm4}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.formInput}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.formInput}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          className={styles.formTextarea}
        />
      </div>
      
      <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
        <input
          type="checkbox"
          id="gdprConsent"
          name="gdprConsent"
          checked={formData.gdprConsent}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={styles.checkboxInput}
        />
        <label htmlFor="gdprConsent" className={styles.checkboxLabel}>
          I understand that by submitting this form, I am providing my name, email address, and message to Jan Peiro for the purpose of responding to my inquiry. I consent to the processing of this data in accordance with the{' '}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              const event = new CustomEvent('openPrivacyModal');
              window.dispatchEvent(event);
            }}
            className={styles.privacyLink}
          >
            Privacy Policy
          </a>{' '}*
        </label>
        {touched.gdprConsent && !formData.gdprConsent && (
          <p className={styles.errorText}>You must agree to the privacy policy to continue</p>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading || !formData.gdprConsent}
        className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
      
      {status && <p className={styles.status}>{status}</p>}
    </form>
  );
}
