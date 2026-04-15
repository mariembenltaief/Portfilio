// hooks/useAproposData.js
// Fetches skills + parcours from the API in parallel.
// Returns safe arrays and loading/error state.

import { useState, useEffect } from "react";
import { fetchAproposData }    from "../services/aproposService";

/**
 * useAproposData
 *
 * @returns {{
 *   skills:   Array<{id,label,icon,pct,ordre}>,
 *   parcours: Array<{id,period,titre,lieu,ordre}>,
 *   loading:  boolean,
 *   error:    string|null,
 *   reload:   () => void,
 * }}
 */
export function useAproposData() {
  const [skills,   setSkills]   = useState([]);
  const [parcours, setParcours] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tick,     setTick]     = useState(0);   // increment to force reload

  const reload = () => setTick((t) => t + 1);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const { skills: sk, parcours: pa } = await fetchAproposData();
        if (cancelled) return;
        setSkills(Array.isArray(sk) ? sk : []);
        setParcours(Array.isArray(pa) ? pa : []);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Fetch error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [tick]);

  return { skills, parcours, loading, error, reload };
}