import { Inter } from 'next/font/google';
import './globals.css';
import { ModalProvider } from './components/ModalContext';
import ScriptLoader from './components/ScriptLoader';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';
import ScrollToTop from './ScrollToTop';
import { metadata } from './metadata'; 
import { Analytics } from '@vercel/analytics/next';

const version = process.env.NEXT_PUBLIC_APP_VERSION || new Date().getTime();

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

export { metadata };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} translate="no">
      <head>
        <ScriptLoader version={version} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href={`/favicon.ico?v=${version}`} />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ScrollToTop />
        <LoadingProvider>
          <ModalProvider>
            <LoadingOverlay />
            {children}
          </ModalProvider>
        </LoadingProvider>
          <Analytics />
      </body>
    </html>
  );
}