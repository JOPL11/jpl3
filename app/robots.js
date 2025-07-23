export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Add any disallow rules here if needed
      // disallow: '/private/',
    },
    sitemap: 'https://jpl3.vercel.app/sitemap.xml',
  };
}
