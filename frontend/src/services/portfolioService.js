// services/portfolioService.js
// Central data-access layer for the entire portfolio frontend.
// All fetch calls go through here — never directly from components.

import { ENDPOINTS, AUTH_ENDPOINTS } from "../constants/api";

// ═══════════════════════════════════════════════════════════════
// CORE FETCHER
// ═══════════════════════════════════════════════════════════════

/**
 * Known API envelope keys.
 * The backend sometimes wraps the payload in { courses: [...] }
 * or { data: [...] }. We unwrap automatically.
 */
const ENVELOPE_KEYS = [
  "data",
  "enseignant", "visiteur",
  "cours", "course", "courses",
  "publications",
  "projets", "projects",
  "posts", "articles", "blogPosts",
  "liens", "links",
  "skills",
  "parcours",
];

/**
 * Generic GET fetcher.
 * - Unwraps known envelope keys
 * - Returns null on network error or non-OK status (never throws)
 *
 * @param {string} url
 * @returns {Promise<any | null>}
 */
const fetcher = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    if (!json || typeof json !== "object") return json;

    // Unwrap single-key envelopes like { courses: [...] }
    for (const key of ENVELOPE_KEYS) {
      if (key in json) return json[key];
    }

    return json;
  } catch {
    return null;
  }
};

/**
 * Generic authenticated POST / PUT / DELETE fetcher.
 * Returns parsed JSON or null on failure.
 *
 * @param {string} url
 * @param {"POST"|"PUT"|"PATCH"|"DELETE"} method
 * @param {object|null} body
 * @param {string} token  JWT Bearer token
 * @returns {Promise<any | null>}
 */
const authFetcher = async (url, method, body, token) => {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════
// PUBLIC ENDPOINTS
// ═══════════════════════════════════════════════════════════════

export const fetchVisiteur     = () => fetcher(ENDPOINTS.visiteur);
export const fetchCours        = () => fetcher(ENDPOINTS.cours);
export const fetchPublications = () => fetcher(ENDPOINTS.publications);
export const fetchProjets      = () => fetcher(ENDPOINTS.projets);
export const fetchLiens        = () => fetcher(ENDPOINTS.liens);
export const fetchBlog         = () => fetcher(ENDPOINTS.blog);
export const fetchSkills       = () => fetcher(ENDPOINTS.skills);
export const fetchParcours     = () => fetcher(ENDPOINTS.parcours);

// ─── Batch loader ─────────────────────────────────────────────

/**
 * Fetch ALL public portfolio data in one parallel batch.
 * Every field is guaranteed to be a safe value (array or object),
 * never null — components can destructure without null-checks.
 *
 * @returns {Promise<{
 *   visiteur:     object | null,
 *   cours:        any[],
 *   publications: any[],
 *   projets:      any[],
 *   liens:        any[],
 *   articlesBlog: any[],
 *   skills:       any[],
 *   parcours:     any[],
 * }>}
 */
export const fetchAllPortfolioData = async () => {
  const [
    visiteur,
    cours,
    publications,
    projets,
    liens,
    blog,
    skills,
    parcours,
  ] = await Promise.all([
    fetchVisiteur(),
    fetchCours(),
    fetchPublications(),
    fetchProjets(),
    fetchLiens(),
    fetchBlog(),
    fetchSkills(),
    fetchParcours(),
  ]);

  return {
    visiteur:     visiteur   ?? null,
    cours:        toArray(cours),
    publications: toArray(publications),
    projets:      toArray(projets),
    liens:        toArray(liens),
    articlesBlog: toArray(blog?.blogPosts ?? blog),
    skills:       toArray(skills),
    parcours:     toArray(parcours),
  };
};

// ─── Contact form ─────────────────────────────────────────────

/**
 * POST a contact message.
 * @param {{ name: string, email: string, message: string }} payload
 * @returns {Promise<boolean>} true if the server accepted it
 */
export const sendContactMessage = async (payload) => {
  try {
    const res = await fetch(ENDPOINTS.contact, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATED ENDPOINTS  (dashboard / admin)
// ═══════════════════════════════════════════════════════════════

// ── Skills CRUD ──────────────────────────────────────────────

export const fetchMySkills = (token) =>
  authFetcher(AUTH_ENDPOINTS.mySkills, "GET", null, token);

export const createSkill = (token, body) =>
  authFetcher(AUTH_ENDPOINTS.createSkill, "POST", body, token);

export const updateSkill = (token, id, body) =>
  authFetcher(AUTH_ENDPOINTS.updateSkill(id), "PUT", body, token);

export const deleteSkill = (token, id) =>
  authFetcher(AUTH_ENDPOINTS.deleteSkill(id), "DELETE", null, token);

export const reorderSkills = (token, ids) =>
  authFetcher(AUTH_ENDPOINTS.reorderSkills, "PATCH", { ids }, token);

// ── Parcours CRUD ────────────────────────────────────────────

export const fetchMyParcours = (token) =>
  authFetcher(AUTH_ENDPOINTS.myParcours, "GET", null, token);

export const createParcours = (token, body) =>
  authFetcher(AUTH_ENDPOINTS.createParcours, "POST", body, token);

export const updateParcours = (token, id, body) =>
  authFetcher(AUTH_ENDPOINTS.updateParcours(id), "PUT", body, token);

export const deleteParcours = (token, id) =>
  authFetcher(AUTH_ENDPOINTS.deleteParcours(id), "DELETE", null, token);

export const reorderParcours = (token, ids) =>
  authFetcher(AUTH_ENDPOINTS.reorderParcours, "PATCH", { ids }, token);

// ═══════════════════════════════════════════════════════════════
// INTERNAL UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Coerce any value to a safe array.
 * null / undefined / non-array  →  []
 * @param {any} v
 * @returns {any[]}
 */
const toArray = (v) => (Array.isArray(v) ? v : []);