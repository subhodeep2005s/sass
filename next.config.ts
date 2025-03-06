import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during the build process
  },
  images: {
    domains: ["res.cloudinary.com"], // Allow Cloudinary images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allow all images from Cloudinary
      },
    ],
  },
};

export default nextConfig;
