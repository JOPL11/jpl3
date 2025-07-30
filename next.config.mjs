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
  },
};

export default nextConfig;
