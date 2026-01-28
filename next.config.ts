import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "u9a6wmr3as.ufs.sh" },
      { protocol: "https", hostname: "scontent.fagt6-1.fna.fbcdn.net" },
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
