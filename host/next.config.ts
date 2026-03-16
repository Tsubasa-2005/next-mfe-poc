import type { NextConfig } from "next";
import { getServerEnv } from "./env";

const remoteOrigin = getServerEnv().REMOTE_ORIGIN;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/remote",
        destination: `${remoteOrigin}/remote`,
      },
      {
        source: "/remote/:path+",
        destination: `${remoteOrigin}/remote/:path+`,
      },
      {
        source: "/remote-static/:path+",
        destination: `${remoteOrigin}/remote-static/:path+`,
      },
    ];
  },
};

export default nextConfig;
