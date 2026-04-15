// hooks/useCours.js
// Independent course fetch hook.
// Does NOT depend on usePortfolioData — CoursSection owns its data.

import { useState, useEffect, useCallback } from "react";
import { ENDPOINTS } from "../constants/api";

// ─── Unwrap any API envelope shape ───────────────────────────
// Handles:
//   { success: true, courses: [...] }   ← your actual backend
//   { courses: [...] }
//   { cours:   [...] }
//   { data:    [...] }
//   [...]                               ← raw array
const unwrap = (json) => {
  if (Array.isArray(json))            return json;
  if (Array.isArray(json?.courses))   return json.courses;
  if (Array.isArray(json?.cours))     return json.cours;
  if (Array.isArray(json?.data))      return json.data;
  return [];
};

/**
 * useCours — fetches GET /api/cours?visible=true
 *
 * @returns {{
 *   cours:   any[],
 *   loading: boolean,
 *   error:   string | null,
 *   retry:   () => void,
 * }}
 */
export function useCours() {
  const [cours,   setCours]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tick,    setTick]    = useState(0);

  const retry = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${ENDPOINTS.cours}?visible=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
        const json = await res.json();
        if (!cancelled) setCours(unwrap(json));
      } catch (err) {
        if (!cancelled) setError(err?.message ?? "Erreur réseau");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [tick]);

  return { cours, loading, error, retry };
}