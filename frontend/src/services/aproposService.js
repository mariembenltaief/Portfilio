// services/aproposService.js
// Uses ENDPOINTS / AUTH_ENDPOINTS from constants — no hardcoded URLs.

import { ENDPOINTS, AUTH_ENDPOINTS } from "../constants/api";

// ─── Helpers ─────────────────────────────────────────────────
const jsonHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${token}`,
});

const safeJson = async (res, fallback) => {
  if (!res.ok) return fallback;
  try { return await res.json(); } catch { return fallback; }
};

// ─── Public ───────────────────────────────────────────────────

/**
 * @returns {Promise<Array<{id,label,icon,pct,ordre}>>}
 */
export const fetchSkills = async () => {
  try {
    const res  = await fetch(ENDPOINTS.skills);
    const json = await safeJson(res, {});
    return Array.isArray(json?.skills) ? json.skills : [];
  } catch {
    return [];
  }
};

/**
 * @returns {Promise<Array<{id,period,titre,lieu,ordre}>>}
 */
export const fetchParcours = async () => {
  try {
    const res  = await fetch(ENDPOINTS.parcours);
    const json = await safeJson(res, {});
    return Array.isArray(json?.parcours) ? json.parcours : [];
  } catch {
    return [];
  }
};

/**
 * Fetch both in parallel — used by useAproposData.
 * @returns {Promise<{ skills: [], parcours: [] }>}
 */
export const fetchAproposData = async () => {
  const [skills, parcours] = await Promise.all([
    fetchSkills(),
    fetchParcours(),
  ]);
  return { skills, parcours };
};

// ─── Authenticated — Skills ───────────────────────────────────

export const fetchMySkills = (token) =>
  fetch(AUTH_ENDPOINTS.mySkills, { headers: jsonHeaders(token) })
    .then((r) => safeJson(r, { skills: [] }));

export const createSkill = (token, body) =>
  fetch(AUTH_ENDPOINTS.createSkill, {
    method:  "POST",
    headers: jsonHeaders(token),
    body:    JSON.stringify(body),
  }).then((r) => safeJson(r, {}));

export const updateSkill = (token, id, body) =>
  fetch(AUTH_ENDPOINTS.updateSkill(id), {
    method:  "PUT",
    headers: jsonHeaders(token),
    body:    JSON.stringify(body),
  }).then((r) => safeJson(r, {}));

export const deleteSkill = (token, id) =>
  fetch(AUTH_ENDPOINTS.deleteSkill(id), {
    method:  "DELETE",
    headers: jsonHeaders(token),
  }).then((r) => safeJson(r, {}));

export const reorderSkills = (token, ids) =>
  fetch(AUTH_ENDPOINTS.reorderSkills, {
    method:  "PATCH",
    headers: jsonHeaders(token),
    body:    JSON.stringify({ ids }),
  }).then((r) => safeJson(r, {}));

// ─── Authenticated — Parcours ─────────────────────────────────

export const fetchMyParcours = (token) =>
  fetch(AUTH_ENDPOINTS.myParcours, { headers: jsonHeaders(token) })
    .then((r) => safeJson(r, { parcours: [] }));

export const createParcours = (token, body) =>
  fetch(AUTH_ENDPOINTS.createParcours, {
    method:  "POST",
    headers: jsonHeaders(token),
    body:    JSON.stringify(body),
  }).then((r) => safeJson(r, {}));

export const updateParcours = (token, id, body) =>
  fetch(AUTH_ENDPOINTS.updateParcours(id), {
    method:  "PUT",
    headers: jsonHeaders(token),
    body:    JSON.stringify(body),
  }).then((r) => safeJson(r, {}));

export const deleteParcours = (token, id) =>
  fetch(AUTH_ENDPOINTS.deleteParcours(id), {
    method:  "DELETE",
    headers: jsonHeaders(token),
  }).then((r) => safeJson(r, {}));

export const reorderParcours = (token, ids) =>
  fetch(AUTH_ENDPOINTS.reorderParcours, {
    method:  "PATCH",
    headers: jsonHeaders(token),
    body:    JSON.stringify({ ids }),
  }).then((r) => safeJson(r, {}));