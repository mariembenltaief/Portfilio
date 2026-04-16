// services/portfolioService.js
// Central data-access layer for the entire portfolio frontend.
// All fetch calls go through here — never directly from components.

import { ENDPOINTS, AUTH_ENDPOINTS } from "../constants/api";

// ═══════════════════════════════════════════════════════════════
// INTERNAL UTILITIES  — defined FIRST so every function below
// can reference them without hitting the temporal dead zone.
// ═══════════════════════════════════════════════════════════════

/**
 * Coerce any value to a safe, non-null array.
 * null / undefined / non-array  →  []
 */
const toArray = (v) => (Array.isArray(v) ? v : []);

// ═══════════════════════════════════════════════════════════════
// CORE FETCHERS
// ═══════════════════════════════════════════════════════════════

/**
 * Generic authenticated POST / PUT / PATCH / DELETE fetcher.
 * Returns parsed JSON or null on failure — never throws.
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

/**
 * Generic public GET — returns parsed JSON or null, never throws.
 * Does NOT attempt envelope-unwrapping; each public fetcher below
 * does its own explicit unwrap so there is no key-order ambiguity.
 */
const get = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════
// PUBLIC ENDPOINT FETCHERS
// Each one knows exactly which envelope key its API returns.
// ═══════════════════════════════════════════════════════════════

export const fetchVisiteur = async () => {
  const json = await get(ENDPOINTS.visiteur);
  if (!json) return null;
  // Accept { visiteur: {} } | { enseignant: {} } | the object itself
  if (json.visiteur   && typeof json.visiteur   === "object") return json.visiteur;
  if (json.enseignant && typeof json.enseignant === "object") return json.enseignant;
  if (json.data       && typeof json.data       === "object") return json.data;
  // If the response looks like the profile object directly, return it
  if (json.nom || json.prenom || json.email) return json;
  return null;
};

export const fetchCours = async () => {
  const json = await get(ENDPOINTS.cours);
  if (Array.isArray(json))           return json;
  if (Array.isArray(json?.courses))  return json.courses;
  if (Array.isArray(json?.cours))    return json.cours;
  if (Array.isArray(json?.data))     return json.data;
  return [];
};

export const fetchPublications = async () => {
  const json = await get(ENDPOINTS.publications);
  if (Array.isArray(json))                return json;
  if (Array.isArray(json?.publications))  return json.publications;
  if (Array.isArray(json?.data))          return json.data;
  return [];
};

export const fetchProjets = async () => {
  const json = await get(ENDPOINTS.projets);
  if (Array.isArray(json))           return json;
  if (Array.isArray(json?.projets))  return json.projets;
  if (Array.isArray(json?.projects)) return json.projects;
  if (Array.isArray(json?.data))     return json.data;
  return [];
};

export const fetchLiens = async () => {
  const json = await get(ENDPOINTS.liens);
  if (Array.isArray(json))        return json;
  if (Array.isArray(json?.liens)) return json.liens;
  if (Array.isArray(json?.links)) return json.links;
  if (Array.isArray(json?.data))  return json.data;
  return [];
};

export const fetchBlog = async () => {
  const json = await get(ENDPOINTS.blog);
  if (Array.isArray(json))              return json;
  if (Array.isArray(json?.blogPosts))   return json.blogPosts;
  if (Array.isArray(json?.articles))    return json.articles;
  if (Array.isArray(json?.posts))       return json.posts;
  if (Array.isArray(json?.data))        return json.data;
  return [];
};

/** GET /api/apropos/skills → { success, skills: [...] } */
export const fetchSkills = async () => {
  const json = await get(ENDPOINTS.skills);
  if (Array.isArray(json))          return json;
  if (Array.isArray(json?.skills))  return json.skills;
  if (Array.isArray(json?.data))    return json.data;
  return [];
};

/** GET /api/apropos/parcours → { success, parcours: [...] } */
export const fetchParcours = async () => {
  const json = await get(ENDPOINTS.parcours);
  if (Array.isArray(json))            return json;
  if (Array.isArray(json?.parcours))  return json.parcours;
  if (Array.isArray(json?.data))      return json.data;
  return [];
};

// ─── Batch loader ─────────────────────────────────────────────

/**
 * Fetch ALL public portfolio data in one parallel batch.
 * Every field is guaranteed to be a safe value — never null.
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
    visiteur:     visiteur ?? null,
    cours:        toArray(cours),
    publications: toArray(publications),
    projets:      toArray(projets),
    liens:        toArray(liens),
    articlesBlog: toArray(blog),
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

// ── Skills CRUD ───────────────────────────────────────────────

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

// ── Parcours CRUD ─────────────────────────────────────────────

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