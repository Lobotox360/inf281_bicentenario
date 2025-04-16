import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com','static.vecteezy.com'],
  },
};
module.exports = nextConfig;
export default nextConfig;
