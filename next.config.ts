import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["http://localhost:3000", "picsum.photos", "res.cloudinary.com"],
  },
};

export default nextConfig;
