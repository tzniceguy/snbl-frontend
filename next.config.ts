import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows any hostname
        pathname: "/media/product-images/**",
      },
    ],
  },
};

export default nextConfig;
