'use client';

import { useEffect, useState } from 'react';

export default function ConsentBasedAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('analyticsConsent');
    if (savedConsent === 'true') {
      setHasConsent(true);
      loadAnalytics();
    }
    
    const handleConsentChange = () => {
      const consent = localStorage.getItem('analyticsConsent');
      if (consent === 'true') {
        setHasConsent(true);
        loadAnalytics();
      }
    };

    window.addEventListener('analyticsConsent', handleConsentChange);
    return () => window.removeEventListener('analyticsConsent', handleConsentChange);
  }, []);

  const loadAnalytics = () => {
    // Load Vercel Analytics script only when consent is given
    const script = document.createElement('script');
    script.src = 'https://va.vercel-scripts.com/v1/script.js';
    script.defer = true;
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything
}
