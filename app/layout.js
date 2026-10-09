// app/layout.js
import localFont from 'next/font/local';
import './globals.css';
import { ModalProvider } from './components/ModalContext';
import ScriptLoader from './components/ScriptLoader';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';
import ScrollToTop from './ScrollToTop';
import { Analytics } from '@vercel/analytics/next';
import { ScrollVelocityProvider } from './contexts/ScrollVelocityContext';

const version = process.env.NEXT_PUBLIC_APP_VERSION || new Date().getTime();

// ─── Font ──────────────────────────────────────────────────
// InterVariable.ttf is a variable font containing all weights (100–900)
// and both upright + italic axes in a single file.
const inter = localFont({
  src: '../public/fonts/InterVariable.ttf',
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
});

const grotesk = localFont({
  src: '../public/fonts/NeueHaasDisplayMedium.ttf',
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
});

// ─── Site constants ────────────────────────────────────────
const SITE_URL = 'https://janpeiro.vercel.app';
const SITE_NAME = 'Jan Peiro';
const SITE_TITLE = 'Jan Peiro — Creative';
const SITE_DESCRIPTION =
  'Intersection of design, motion, and code.';

// ─── Metadata ──────────────────────────────────────────────
export const metadata = {
  metadataBase: new URL(SITE_URL),

  // Core
  title: {
    default: SITE_TITLE,
    template: '%s | Jan Peiro',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  keywords: [
    'Jan Peiro',
    'Creative Developer',
    'Motion Designer',
    '3D Animation',
    'Web Development',
    'WebGL',
    'Three.js',
    'React Three Fiber',
    'Interactive Design',
    'Portfolio',
    'Germany',
    'JPL',
    'Airbus Showroom',
    'Development',
    'Graphic Design',
    'Communications Design',
    'Next',
    'React Design',
  ],

  // Authorship
  authors: [{ name: 'Jan Peiro', url: SITE_URL }],
  creator: 'Jan Peiro',
  publisher: 'Jan Peiro',
  category: 'portfolio',
  classification: 'Creative Portfolio',

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },

  // Canonical
  alternates: {
    canonical: '/',
  },

  // Open Graph
  openGraph: {
    type: 'website',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jan Peiro — Creative Developer Portfolio',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    site: '@janpeiro',
    creator: '@janpeiro',
    title: 'Jan Peiro — Design / Motion / Code',
    description: 'Portfolio of Jan Peiro — Creative Developer.',
    images: ['/images/og-image.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (fill in later)
  verification: {
    // google: 'your-google-site-verification-token',
  },

  // Misc
  other: {
    google: 'notranslate',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'og:image:alt': 'Jan Peiro — Creative Developer Portfolio',
    'og:see_also': SITE_URL,
    'theme-color': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': SITE_NAME,
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#000000',
  },
};

// ─── Viewport (separate export in Next 14+) ────────────────
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'dark light',
};

// ─── Layout ────────────────────────────────────────────────
export default function RootLayout({ children }) {
  // Site-level structured data
  const jsonLdPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jan Peiro',
    url: SITE_URL,
    jobTitle: 'Creative Developer',
    description:
      'Creative Developer and Designer specializing in interactive web experiences, 3D animation, and motion design.',
    knowsAbout: [
      'Web Development',
      'Creative Coding',
      'Three.js',
      'React Three Fiber',
      'WebGL',
      'Motion Design',
      '3D Animation',
    ],
    sameAs: [
      // Add your real profile URLs here — LinkedIn, GitHub, Instagram, etc.
      // 'https://github.com/yourhandle',
      // 'https://www.linkedin.com/in/yourhandle',
      // 'https://twitter.com/janpeiro',
    ],
  };

  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Jan Peiro',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Jan Peiro',
    },
    image: `${SITE_URL}/images/og-image.jpg`,
  };

  const jsonLdProfile = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: SITE_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    mainEntity: {
      '@type': 'Person',
      name: 'Jan Peiro',
      jobTitle: 'Creative',
      url: SITE_URL,
    },
  };

  return (
    <html lang="en" className={inter.variable} translate="no">
      <head>
        <ScriptLoader version={version} />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProfile) }}
        />

        <link rel="icon" href={`/favicon.ico?v=${version}`} />
      </head>
   <body className={inter.className} suppressHydrationWarning={true}>
        <ScrollToTop />
        <ScrollVelocityProvider>
          <LoadingProvider>
            <ModalProvider>
              <LoadingOverlay />
              {children}
            </ModalProvider>
          </LoadingProvider>
        </ScrollVelocityProvider>
        <Analytics />
      </body>
    </html>
  );
}