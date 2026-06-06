"use client";
import { useEffect } from "react";

export function HydraCapture() {
  useEffect(() => {
    const orig = console.error;
    console.error = (...args: unknown[]) => {
      try {
        const text = args
          .map((a) => {
            if (typeof a === "string") return a;
            if (a && typeof a === "object" && "stack" in a) return String((a as Error).stack);
            try { return JSON.stringify(a); } catch { return String(a); }
          })
          .join(" || ");
        if (/Hydration|hydrat|didn't match/i.test(text)) {
          fetch("/api/__hydra", { method: "POST", body: text });
        }
      } catch {}
      orig.apply(console, args as []);
    };
    return () => { console.error = orig; };
  }, []);
  return null;
}
