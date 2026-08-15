import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ducks.co.il" },
      { protocol: "https", hostname: "app.payper.co.il" },
    ],
  },
};

export default nextConfig;
