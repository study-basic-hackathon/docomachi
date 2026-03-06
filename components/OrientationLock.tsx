"use client";

import { useEffect } from "react";

const SMARTPHONE_BREAKPOINT = 768;

/**
 * On smartphone-sized viewports, try to lock orientation to landscape.
 * Falls back to no-op if API is unavailable (e.g. desktop, or browser restriction).
 * Tablet/desktop: no lock, layout adapts to orientation (FR-009).
 */
export function OrientationLock() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isNarrow = window.innerWidth < SMARTPHONE_BREAKPOINT;
    if (!isNarrow) return;
    const lock = (window as Window & { screen?: { orientation?: { lock?: (s: string) => Promise<void> } } }).screen?.orientation?.lock;
    if (typeof lock !== "function") return;
    lock("landscape").catch(() => {
      // Ignore: fullscreen may be required, or API unsupported
    });
  }, []);
  return null;
}
