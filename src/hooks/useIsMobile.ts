import { useState, useEffect } from "react";

/**
 * Returns true if the current viewport width is below 768px (md breakpoint).
 * Listens to window resize events and updates reactively.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
