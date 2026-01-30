import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "u9a6wmr3as.ufs.sh" },
      { protocol: "https", hostname: "scontent.fagt6-1.fna.fbcdn.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? "" ,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL ?? "",
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET ?? "",
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
  },
};

export default nextConfig;
