import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // تجاهل أخطاء TypeScript أثناء البناء
    ignoreBuildErrors: true,
  },
};

export default nextConfig;