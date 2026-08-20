import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/site.config";

/**
 * Site-wide offline gate — driven by `siteConfig.maintenance.enabled`.
 *
 * When enabled, every request is answered with HTTP 503 (+ Retry-After and
 * X-Robots-Tag: noindex) so search engines treat the outage as temporary and
 * do not index the holding page. Page routes are rewritten to the neutral
 * `/offline` page; API routes return a bare JSON 503 so nothing (chat, lead
 * capture, revalidation) runs while the site is held.
 *
 * When disabled this middleware is a pass-through.
 */
const RETRY_AFTER_SECONDS = String(24 * 60 * 60);

export function middleware(request: NextRequest) {
  if (!siteConfig.maintenance.enabled) return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      {
        status: 503,
        headers: {
          "Retry-After": RETRY_AFTER_SECONDS,
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const url = request.nextUrl.clone();
  url.pathname = "/offline";
  url.search = "";

  const response = NextResponse.rewrite(url, { status: 503 });
  response.headers.set("Retry-After", RETRY_AFTER_SECONDS);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Everything except Next's build assets, the icons, and the holding page
  // itself (the rewrite target). Public images etc. are intentionally gated.
  matcher: ["/((?!_next/|offline$|favicon\\.ico|icon\\.png|apple-icon\\.png).*)"],
};
