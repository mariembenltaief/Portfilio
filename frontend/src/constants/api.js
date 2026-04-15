// ─── API Configuration ────────────────────────────────────────
export const API_BASE = "http://localhost:5000/api";

export const ENDPOINTS = {
  // ── Profil public ─────────────────────────────────────────
  visiteur:     `${API_BASE}/visiteurs/public`,

  // ── Contenu académique (public) ───────────────────────────
  cours:        `${API_BASE}/cours`,
  publications: `${API_BASE}/publications`,
  projets:      `${API_BASE}/projets-recherche`,
  liens:        `${API_BASE}/liens-externes`,
  blog:         `${API_BASE}/articles-blog`,

  // ── À propos (public) ─────────────────────────────────────
  skills:       `${API_BASE}/apropos/skills`,
  parcours:     `${API_BASE}/apropos/parcours`,

  // ── Contact ───────────────────────────────────────────────
  contact:      `${API_BASE}/contact`,
};

// ─── Authenticated endpoints (dashboard) ─────────────────────
export const AUTH_ENDPOINTS = {
  // Skills CRUD
  mySkills:        `${API_BASE}/apropos/skills/me`,
  createSkill:     `${API_BASE}/apropos/skills`,
  updateSkill: (id) => `${API_BASE}/apropos/skills/${id}`,
  deleteSkill: (id) => `${API_BASE}/apropos/skills/${id}`,
  reorderSkills:   `${API_BASE}/apropos/skills/reorder`,

  // Parcours CRUD
  myParcours:       `${API_BASE}/apropos/parcours/me`,
  createParcours:   `${API_BASE}/apropos/parcours`,
  updateParcours: (id) => `${API_BASE}/apropos/parcours/${id}`,
  deleteParcours: (id) => `${API_BASE}/apropos/parcours/${id}`,
  reorderParcours:  `${API_BASE}/apropos/parcours/reorder`,
};