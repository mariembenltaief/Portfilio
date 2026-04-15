import { Icons } from "../components/ui/Icons";

/** Resolve the correct icon function for a link based on type or URL */
export const iconForLink = (type, url) => {
  const t = (type || "").toLowerCase();
  const u = (url  || "").toLowerCase();
  if (t === "github"         || u.includes("github"))   return Icons.github;
  if (t === "linkedin"       || u.includes("linkedin")) return Icons.linkedin;
  if (t === "email"          || u.includes("mailto"))   return Icons.mail;
  if (t === "google-scholar" || u.includes("scholar"))  return Icons.scholar;
  return Icons.globe;
};

/** Normalise a raw URL (add https:// if missing) */
export const normalizeUrl = (url) =>
  url?.startsWith("http") ? url : url ? `https://${url}` : null;

/**
 * Convert a raw liens-externes array into a resolved list of
 * { id, titre, url, iconFn } objects ready for rendering.
 */
export const resolveSocialLinks = (liens = []) =>
  liens
    .map((l) => {
      const raw = l.url || l.lien || l.link || "";
      if (!raw) return null;
      const href = normalizeUrl(raw);
      return {
        id:     l.id || href,
        titre:  l.titre || l.nom || l.type || href,
        href,
        iconFn: iconForLink(l.type, raw),
      };
    })
    .filter(Boolean);