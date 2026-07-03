import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/diamondalttin",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
