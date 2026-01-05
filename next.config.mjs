/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable file hashing for better caching
  generateBuildId: async () => {
    return process.env.GIT_COMMIT_SHA || 'dev';
  },
  
  // Configure webpack for file hashing
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.filename = 'static/chunks/[name].[contenthash].js';
      config.output.chunkFilename = 'static/chunks/[name].[contenthash].js';
    }
    return config;
  },
  // Configure cache control - NO CACHING EVER
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Keep your existing image configurations
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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
export default nextConfig;