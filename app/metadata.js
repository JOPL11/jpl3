export const metadata = {
  title: {
    default: 'Jan Peiro - Creative Developer',
    template: '%s | Jan Peiro',
  },
  description: 'Creative Developer and Designer',
  keywords: ['Jan Peiro', 'Creative Developer', 'Motion Designer', '3D Animation', 'Web Development', 'Germany', 'Portfolio'],
  authors: [{ name: 'Jan Peiro' }],
  creator: 'Jan Peiro',
  publisher: 'Jan Peiro',
  metadataBase: new URL('https://janpeiro.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Jan Peiro - Creative Developer',
    description: 'Creative Developer and Designer',
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
  verification: {
    google: 'google-site-verification=iGLpuC-ydCLPjzPlxwOi7JVmXibniROkt6LEreUROtE',
  },
};
