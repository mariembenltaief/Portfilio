// src/utils/mapToCVData.js
// ─────────────────────────────────────────────────────────────────
// Single normalisation layer between raw API data and the CV system.
// ALL field-name resolution happens here — nowhere else.
// ─────────────────────────────────────────────────────────────────

const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v) => (v != null && v !== "" ? String(v) : "");
const num = (v, fallback = 0) => {
  const n = Number(v);
  return isNaN(n) ? fallback : Math.min(100, Math.max(0, n));
};

// ─── Skill normaliser ─────────────────────────────────────────
/**
 * Handles every possible shape a skill item can arrive as:
 *   - Full object:  { id, label, icon, pct, ordre }            ← backend canonical
 *   - String only:  "React"                                     ← legacy / mixed format
 *   - Partial obj:  { name: "React", level: 80 }               ← alternative naming
 *   - Soft skill:   { label: "Communication", pct: 0 }         ← no pct = soft skill
 */
const normaliseSkill = (raw) => {
  // String shorthand → convert to object with no percentage
  if (typeof raw === "string") {
    return { id: null, label: raw.trim(), icon: "◆", pct: null, ordre: 0 };
  }

  if (!raw || typeof raw !== "object") return null;

  const label = str(
    raw.label ?? raw.name ?? raw.titre ?? raw.competence ?? raw.skill ?? ""
  );
  if (!label) return null; // skip blank entries

  return {
    id:    raw.id   ?? null,
    label,
    icon:  str(raw.icon  ?? raw.emoji ?? "◆"),
    // pct null means "soft skill" (no percentage bar shown)
    // pct 0–100 means "technical skill" (bar shown)
    pct:   raw.pct != null ? num(raw.pct) : null,
    ordre: Number(raw.ordre ?? raw.order ?? 0) || 0,
  };
};

/**
 * Split a flat skills array into technical (pct is a number) and soft (pct is null).
 * Skills with pct >= 0 are treated as technical; pct == null as soft.
 */
const splitSkills = (rawSkills) => {
  const all = arr(rawSkills)
    .map(normaliseSkill)
    .filter(Boolean)
    .sort((a, b) => a.ordre - b.ordre);

  return {
    technical: all.filter((s) => s.pct !== null),
    soft:      all.filter((s) => s.pct === null),
  };
};

// ─── Visiteur normaliser ──────────────────────────────────────
const normaliseVisiteur = (v) => {
  if (!v || typeof v !== "object") {
    return { nom: "", prenom: "", email: "", grade: "", titre: "", bio: "", etablissement: "", specialite: "", photo: null };
  }
  return {
    nom:           str(v.nom           ?? v.last_name  ?? ""),
    prenom:        str(v.prenom        ?? v.first_name ?? ""),
    email:         str(v.email         ?? ""),
    grade:         str(v.grade         ?? ""),
    titre:         str(v.titre         ?? v.grade      ?? "Enseignant-Chercheur"),
    bio:           str(v.bio           ?? v.description ?? ""),
    etablissement: str(v.etablissement ?? v.institution ?? ""),
    specialite:    str(v.specialite    ?? v.specialty   ?? ""),
    photo:         v.photo ?? v.photo_url ?? null,
  };
};

// ─── Section normalisers ──────────────────────────────────────
const normaliseCours = (c) => ({
  id:          c.id    ?? null,
  titre:       str(c.titre        ?? c.intitule ?? c.name ?? ""),
  type:        str(c.type         ?? ""),
  niveau:      str(c.niveau       ?? c.level   ?? ""),
  annee:       str(c.annee_universitaire ?? c.annee ?? ""),
  description: str(c.description  ?? ""),
});

const normalisePublication = (p) => ({
  id:      p.id    ?? null,
  titre:   str(p.titre  ?? p.title   ?? ""),
  auteurs: str(p.auteurs ?? p.authors ?? ""),
  annee:   p.annee ? String(p.annee) : "",
  revue:   str(p.revue  ?? p.journal ?? p.conference ?? ""),
  resume:  str(p.resume ?? p.abstract ?? ""),
  doi:     str(p.reference_externe ?? p.doi ?? ""),
});

const normaliseProjet = (p) => ({
  id:          p.id    ?? null,
  titre:       str(p.titre        ?? p.title ?? ""),
  description: str(p.description  ?? ""),
  axe:         str(p.axe_recherche ?? p.axe  ?? ""),
  dateDebut:   str(p.date_debut   ?? ""),
  dateFin:     str(p.date_fin     ?? ""),
});

// ─── Public API ───────────────────────────────────────────────
/**
 * mapToCVData — THE ONLY function CVModal and cvGenerator call.
 *
 * @param {{
 *   visiteur:     object | null,
 *   cours:        any[],
 *   publications: any[],
 *   projets:      any[],
 *   skills:       any[],          ← NEW
 * }} raw
 * @returns {CVData}
 */
export function mapToCVData({ visiteur, cours, publications, projets, skills }) {
  const { technical, soft } = splitSkills(skills);
  return {
    visiteur:     normaliseVisiteur(visiteur),
    cours:        arr(cours).map(normaliseCours),
    publications: arr(publications).map(normalisePublication),
    projets:      arr(projets).map(normaliseProjet),
    // skills split into two clean arrays
    skillsTech:   technical,   // [{ id, label, icon, pct: number }]
    skillsSoft:   soft,        // [{ id, label, icon, pct: null  }]
  };
}