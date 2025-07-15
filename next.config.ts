import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "picsum.photos", "res.cloudinary.com"],
  },
};

export default withBundleAnalyzer(nextConfig);
