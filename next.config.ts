import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.replit.dev", "*.repl.co", "*.replit.app", "*.kirk.replit.dev", "*.picard.replit.dev", "*.janeway.replit.dev", "*.spock.replit.dev", "*.riker.replit.dev", "*.worf.replit.dev", "*.sisko.replit.dev", "*.archer.replit.dev"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "**.notion-static.com" },
    ],
  },
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
