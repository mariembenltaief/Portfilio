import { useState, useEffect, useMemo } from "react";
import { fetchAllPortfolioData } from "../services/portfolioService";
import { safeArray }             from "../utils/formatters";
import { resolveSocialLinks }    from "../utils/linkHelpers";

/**
 * usePortfolioData
 * Fetches all public portfolio data once on mount.
 * Returns loading state, raw entities, computed stats, and resolved social links.
 */
export function usePortfolioData() {
  const [loading,      setLoading]      = useState(true);
  const [visiteur,     setVisiteur]     = useState(null);
  const [cours,        setCours]        = useState([]);
  const [publications, setPublications] = useState([]);
  const [projets,      setProjets]      = useState([]);
  const [liens,        setLiens]        = useState([]);
  const [articlesBlog, setArticlesBlog] = useState([]);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllPortfolioData();
        if (cancelled) return;

        if (data.visiteur)  setVisiteur(data.visiteur);
        setCours(safeArray(data.cours));
        setPublications(safeArray(data.publications));
        setProjets(safeArray(data.projets));
        setLiens(safeArray(data.liens));
        setArticlesBlog(safeArray(data.articlesBlog));
      } catch (err) {
        if (!cancelled) setError(err.message || "Fetch error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };   // cleanup: avoid state updates after unmount
  }, []);

  /** Computed stats derived from fetched arrays */
  const stats = useMemo(() => ({
    total_cours:        cours.length,
    total_publications: publications.length,
    total_projets:      projets.length,
  }), [cours, publications, projets]);

  /** Social link objects ready for rendering */
  const socialLinks = useMemo(() => resolveSocialLinks(liens), [liens]);

  return {
    loading,
    error,
    visiteur,
    cours,
    publications,
    projets,
    liens,
    articlesBlog,
    stats,
    socialLinks,
  };
}