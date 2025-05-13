import type { NextConfig } from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
