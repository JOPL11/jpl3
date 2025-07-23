import { Inter } from 'next/font/google';
import "./globals.css";
import { ModalProvider } from './components/ModalContext';
import CookieBannerWrapper from '../components/CookieBannerWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
  preloadUrls: [
    'https://rsms.me/inter/font-files/InterDisplay.var.woff2',
  ],
});

export const metadata = {
  title: "My Next.js Site",
  description: "A modern website built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="https://rsms.me/inter/font-files/InterDisplay.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <ModalProvider>
          {children}
          <CookieBannerWrapper />
        </ModalProvider>
      </body>
    </html>
  );
}
