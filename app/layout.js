'use client';

import { Inter } from 'next/font/google';
import "./globals.css";
import { ModalProvider } from './components/ModalContext';
import dynamic from 'next/dynamic';
//import CookieBanner from './components/CookieBanner';           <CookieBanner /> 
//import SplashScreen from './components/SplashScreen';
import ScriptLoader from './components/ScriptLoader';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <ScriptLoader />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <LoadingProvider>
          <ModalProvider>
            <LoadingOverlay />
  
            {children}
          </ModalProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
