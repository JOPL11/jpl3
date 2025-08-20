/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdna.artstation.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.artstation.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnb.artstation.com',
      },
    ],
    // Add local development domains
    domains: ['localhost'],
    // Add image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
