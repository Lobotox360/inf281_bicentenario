import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // You can adjust this if you need to limit the path
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/**', // You can adjust this if you need to limit the path
      },
    ],
  },
};

export default nextConfig;
