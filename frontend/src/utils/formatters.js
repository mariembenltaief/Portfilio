// ─── Formatters & Helpers ─────────────────────────────────────

/** Always returns a safe array — never null / undefined */
export const safeArray = (v) => (Array.isArray(v) ? v : []);

/** Format a date string according to locale */
export const formatDate = (d, locale = "fr-FR") => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
};

/** Scroll smoothly to a section by ID */
export const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

/**
 * Unified field accessors for API objects that may use different key names.
 * Keeps all fallback logic in one place — no duplication across components.
 */
export const field = {
  titre:   (o) => o?.intitule  || o?.titre    || o?.title || o?.nom || "—",
  type:    (o) => o?.type_cours || o?.type    || "",
  annee:   (o) => o?.annee_universitaire || o?.annee || o?.year || "",
  duree:   (o) => o?.duree_heures || o?.duree || null,
  revue:   (o) => o?.revue  || o?.journal     || o?.conference || null,
  auteurs: (o) => o?.auteurs || o?.authors    || null,
  desc:    (o) => o?.description || o?.resume || null,
  axe:     (o) => o?.axe_recherche || o?.axe  || o?.domaine || null,
  statut:  (o) => o?.statut || o?.status      || null,
};

/** Derive initials from a visiteur object */
export const getInitials = (visiteur) =>
  `${(visiteur?.prenom || "A")[0]}${(visiteur?.nom || "B")[0]}`.toUpperCase();