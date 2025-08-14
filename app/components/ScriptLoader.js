'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function ScriptLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ScriptLoader: Component mounted');
    console.log('Script paths:', {
      gsap: '/js/gsap.min.js',
      splitType: '/js/split-type.min.js'
    });
    
    // Check if scripts are already loaded
    if (window.gsap) {
      console.log('GSAP already loaded:', window.gsap);
    }
    
    if (window.SplitType) {
      console.log('SplitType already loaded:', window.SplitType);
      setIsLoaded(true);
    }
    
    return () => {
      console.log('ScriptLoader: Component unmounting');
    };
  }, []);

  const handleScriptError = (scriptName, error) => {
    console.error(`Failed to load ${scriptName}:`, error);
    setError(`Failed to load ${scriptName}. Please check the console for details.`);
  };

  return (
    <>
      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#ffebee' }}>
          {error}
        </div>
      )}
      <Script
        src="/js/gsap.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('GSAP loaded successfully');
          window.gsap = window.gsap || window.GSAP; // Handle different GSAP variable names
          console.log('GSAP version:', window.gsap?.version || 'Unknown');
        }}
        onError={(e) => handleScriptError('GSAP', e)}
      />
      <Script
        src="/js/split-type.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('SplitType loaded successfully');
          window.SplitType = window.SplitType || window.SplitType?.default;
          if (window.SplitType) {
            console.log('SplitType is available on window');
            setIsLoaded(true);
          } else {
            console.error('SplitType loaded but not properly exported');
            setError('SplitType loaded but not properly initialized');
          }
        }}
        onError={(e) => handleScriptError('SplitType', e)}
      />
    </>
  );
}
