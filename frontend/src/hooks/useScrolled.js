import { useState, useEffect } from "react";

/**
 * useScrolled
 * Returns true once the page has scrolled past `threshold` pixels.
 * Used by Navbar to switch between transparent and solid background.
 */
export function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    handler(); // initialise on mount
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return scrolled;
}