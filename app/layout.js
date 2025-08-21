import { Inter } from 'next/font/google';
import "./globals.css";
import { ModalProvider } from './components/ModalContext';
import dynamic from 'next/dynamic';
//import CookieBanner from './components/CookieBanner';           <CookieBanner /> 
import SplashScreen from './components/SplashScreen';
import ScriptLoader from './components/ScriptLoader';




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


export const metadata = {
  title: {
    default: 'Jan Peiro - Creative Developer',
    template: '%s | Jan Peiro',
  },
  description: 'Portfolio of Jan Peiro - Creative Developer.',
  keywords: ['Jan Peiro', 'Creative Developer', 'Motion Designer', '3D Animation', 'Web Development', 'Germany', 'Portfolio'],
  authors: [{ name: 'Jan Peiro' }],
  creator: 'Jan Peiro',
  publisher: 'Jan Peiro',
  metadataBase: new URL('https://janpeiro.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jan Peiro - Creative Technologist.',
    description: 'Portfolio of Jan Peiro - Creative Developer.',
    url: 'https://janpeiro.vercel.app',
    siteName: 'Jan Peiro Portfolio',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jan Peiro Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jan Peiro - Creative Technologist',
    description: 'Portfolio of Jan Peiro - Creative Developer.',
    images: ['/images/og-image.jpg'],
    creator: '@janpeiro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/favicon.ico',
    apple: '/images/apple-touch-icon.png',
  },
  verification: {
    google: 'google-site-verification=iGLpuC-ydCLPjzPlxwOi7JVmXibniROkt6LEreUROtE',
    yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <ScriptLoader />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ModalProvider>
          <SplashScreen />
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
