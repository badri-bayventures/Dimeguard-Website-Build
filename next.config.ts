import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.replit.dev", "*.repl.co", "*.replit.app", "*.kirk.replit.dev", "*.picard.replit.dev", "*.janeway.replit.dev", "*.spock.replit.dev"],
  async headers() {
    if (process.env.NODE_ENV === "production") return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
