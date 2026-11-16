'use client';

import { useState, useEffect } from 'react';
import styles from '../css/LangSwitcher.module.css';

const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'ar', label: 'AR', full: 'العربية', rtl: true },
  { code: 'ch', label: '中文', full: '中文' },
];

export default function LangSwitcher({ onChange }) {
  const [lang, setLang] = useState('en');

  // restore on mount
  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved && LANGS.some(l => l.code === saved)) {
      setLang(saved);
      document.documentElement.lang = saved;
      onChange?.(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (code) => {
    setLang(code);
    localStorage.setItem('lang', code);
    document.documentElement.lang = code;
    const isRTL = LANGS.find(l => l.code === code)?.rtl;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    onChange?.(code);
  };

  return (
    <nav className={styles.switcher} aria-label="Language">
      {LANGS.map(({ code, label, full }) => (
        <button
          key={code}
          type="button"
         // onClick={() => pick(code)}
          className={`${styles.lang} ${lang === code ? styles.active : ''}`}
          aria-label={full}
          aria-pressed={lang === code}
          lang={code}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}