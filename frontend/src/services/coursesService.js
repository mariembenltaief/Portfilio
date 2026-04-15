// services/coursesService.js
// Fetch layer for GET /api/cours with optional filters.

const API_BASE = "http://localhost:5000/api";

/**
 * Fetch all public courses with optional query filters.
 * @param {{ type?, niveau?, annee?, visible? }} filters
 * @returns {Promise<Array>} always resolves to an array
 */
export const fetchCours = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type)    params.set("type",    filters.type);
  if (filters.niveau)  params.set("niveau",  filters.niveau);
  if (filters.annee)   params.set("annee",   filters.annee);
  params.set("visible", "true"); // always fetch only public courses

  const url = `${API_BASE}/cours?${params.toString()}`;
  const res  = await fetch(url);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();

  // API returns { success, courses } or { data } or raw array
  if (Array.isArray(json))          return json;
  if (Array.isArray(json.courses))  return json.courses;
  if (Array.isArray(json.data))     return json.data;
  return [];
};