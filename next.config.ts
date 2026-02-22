import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "roaundehzzooxheewfec.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "a.espncdn.com",
        pathname: "/i/teamlogos/**",
      },
    ],
  },
};

export default nextConfig;
