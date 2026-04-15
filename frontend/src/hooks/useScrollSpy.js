import { useState, useEffect } from "react";
import { NAV_IDS } from "../constants/nav";

/**
 * useScrollSpy
 * Tracks which section is currently visible in the viewport.
 * @param {string[]} ids  — ordered list of section element IDs to observe
 * @param {number}   threshold — IntersectionObserver threshold (0–1)
 * @returns {string} id of the currently active section
 */
export function useScrollSpy(ids = NAV_IDS, threshold = 0.3) {
  const [active, setActive] = useState(ids[0] ?? "hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, threshold]);

  return active;
}