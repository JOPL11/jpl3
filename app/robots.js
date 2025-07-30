export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Add any disallow rules here if needed
      // disallow: '/private/',
    },
    sitemap: 'https://janpeiro.vercel.app/sitemap.xml',
  };
}
