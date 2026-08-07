"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/site.config";

// Lazily loaded, client-only: the widget never enters the initial page
// bundle and adds no layout shift (the launcher is fixed-position).
const AssistantWidget = dynamic(() => import("./assistant-widget"), {
  ssr: false,
});

/** Routes the widget must never appear on (per the assistant spec). */
const EXCLUDED_PATHS = ["/privacy", "/terms"];

/**
 * Mount point for the site assistant. `siteConfig.assistant.enabled: false`
 * is the kill switch — it removes the widget entirely in one config change.
 */
export function AssistantMount() {
  const pathname = usePathname();
  if (!siteConfig.assistant.enabled) return null;
  if (EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)))
    return null;
  return <AssistantWidget />;
}
