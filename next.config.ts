import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Cache-Control", value: "no-store" },
    ] }];
  },
};
export default nextConfig;
