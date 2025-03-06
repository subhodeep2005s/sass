// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true, // Disable ESLint during the build process
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during the build process
  },
  images: {
    domains: ["res.cloudinary.com"], // Allow Cloudinary images
  },
};

export default nextConfig;
