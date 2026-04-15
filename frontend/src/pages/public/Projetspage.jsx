// src/pages/public/ProjetsPage.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme }   from "../../constants/theme";
import { field }      from "../../utils/formatters";
import { Badge }      from "../../components/ui/Badge";

const API = "http://localhost:5000/api";

const CSS = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes pulse  { from{opacity:.35} to{opacity:.75} }
  .pj-card { transition:transform .22s cubic-bezier(.4,0,.2,1),box-shadow .22s,border-color .2s; }
  .pj-card:hover { transform:translateY(-5px); box-shadow:0 18px 44px rgba(5,150,105,.13) !important; border-color:#059669 !important; }
  .pj-btn:hover  { background:linear-gradient(135deg,#065f46,#059669) !important; color:#fff !important; border-color:transparent !important; box-shadow:0 4px 16px rgba(5,150,105,.4) !important; }
  .pj-back:hover { border-color:#059669 !important; color:#059669 !important; }
  .pj-card,.pj-btn,.pj-back { transition:all .18s cubic-bezier(.4,0,.2,1); }
  * { box-sizing:border-box; }
`;

// ── Icons ─────────────────────────────────────────────────────
const ArrowLeft  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const ArrowRight = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonCard({ t }) {
  const bar = (w, h = 14) => ({
    width: w, height: h, borderRadius: 8,
    background: `linear-gradient(90deg,${t.skA} 25%,${t.skB} 50%,${t.skA} 75%)`,
    backgroundSize: "400px 100%",
    animation: "pulse .9s ease-in-out infinite alternate",
  });
  return (
    <div style={{ borderRadius: 18, padding: 24, border: `1px solid ${t.border}`, background: t.bgCard }}>
      <div style={{ ...bar("78%", 18), marginBottom: 10 }} />
      <div style={{ ...bar("100%"), marginBottom: 6 }} />
      <div style={{ ...bar("85%"), marginBottom: 18 }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <div style={bar(70, 22)} /><div style={bar(80, 22)} />
      </div>
      <div style={bar(130, 36)} />
    </div>
  );
}

// ── ProjetCard ────────────────────────────────────────────────
function ProjetCard({ projet: p, dark, lang, t }) {
  const navigate = useNavigate();
  const id = p.id || p._id;

  const STATUS_COLOR = {
    actif:      { bg: "#059669", text: "#fff" },
    terminé:    { bg: "#64748b", text: "#fff" },
    "en cours": { bg: "#0891b2", text: "#fff" },
  };
  const sc = STATUS_COLOR[(p.statut || "").toLowerCase()] ?? { bg: "#64748b", text: "#fff" };

  return (
    <div className="pj-card" style={{
      borderRadius: 18, padding: 24,
      border: `1px solid ${t.border}`,
      background: t.bgCard,
      display: "flex", flexDirection: "column",
      boxShadow: "0 1px 4px rgba(0,0,0,.05)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg,#059669,#10b981)",
        borderRadius: "18px 18px 0 0",
      }}/>

      {/* Badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {p.axe_recherche && (
          <span style={{
            background: dark ? "rgba(5,150,105,.14)" : "rgba(5,150,105,.08)",
            color: dark ? "#34d399" : "#065f46",
            border: `1px solid ${dark ? "rgba(5,150,105,.28)" : "rgba(5,150,105,.2)"}`,
            fontSize: 11.5, fontWeight: 700, borderRadius: 7, padding: "4px 10px",
          }}>🔬 {p.axe_recherche}</span>
        )}
        {p.statut && (
          <span style={{
            background: sc.bg, color: sc.text,
            fontSize: 11, fontWeight: 800, borderRadius: 7,
            padding: "4px 10px", letterSpacing: ".04em",
          }}>{p.statut}</span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        margin: "0 0 10px", fontSize: 15.5, fontWeight: 700,
        color: t.text, lineHeight: 1.45, flex: 1,
        fontFamily: "'Playfair Display',Georgia,serif",
      }}>
        {field.titre(p)}
      </h3>

      {/* Description */}
      {field.desc(p) && (
        <p style={{
          margin: "0 0 12px", fontSize: 13, color: t.textMuted, lineHeight: 1.65,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
        }}>
          {field.desc(p)}
        </p>
      )}

      {/* Dates */}
      {(p.date_debut || p.date_fin) && (
        <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14, display: "flex", gap: 6 }}>
          📅
          {p.date_debut && <span>{new Date(p.date_debut).getFullYear()}</span>}
          {p.date_debut && p.date_fin && <span>→</span>}
          {p.date_fin   && <span>{new Date(p.date_fin).getFullYear()}</span>}
        </div>
      )}

      {/* Button */}
      <button
        className="pj-btn"
        onClick={() => id && navigate(`/projets/${id}`)}
        disabled={!id}
        style={{
          alignSelf: "flex-start",
          display: "flex", alignItems: "center", gap: 7,
          background: dark ? "rgba(5,150,105,.14)" : "rgba(5,150,105,.08)",
          color: "#059669",
          border: `1.5px solid ${dark ? "rgba(5,150,105,.28)" : "rgba(5,150,105,.2)"}`,
          borderRadius: 10, padding: "9px 18px",
          fontSize: 13, fontWeight: 700,
          cursor: id ? "pointer" : "not-allowed",
        }}>
        {lang === "fr" ? "Voir détails" : "View details"} <ArrowRight/>
      </button>
    </div>
  );
}

// ── useProjets ────────────────────────────────────────────────
function useProjets() {
  const [projets,  setProjets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tick,     setTick]     = useState(0);
  const retry = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    fetch(`${API}/projets-recherche`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        if (!cancelled) {
          const list = json.projets ?? json.projects ?? json.data ?? (Array.isArray(json) ? json : []);
          setProjets(list);
          setLoading(false);
        }
      })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [tick]);

  return { projets, loading, error, retry };
}

// ══════════════════════════════════════════════════════════════
// ProjetsPage
// ══════════════════════════════════════════════════════════════
export default function ProjetsPage({ dark = false, lang = "fr" }) {
  const navigate = useNavigate();
  const t = {
    ...getTheme(dark),
    skA: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
    skB: dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.09)",
  };

  const [search,       setSearch]       = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [anneeFilter,  setAnneeFilter]  = useState("Toutes");

  const { projets, loading, error, retry } = useProjets();

  // ── Computed options ──────────────────────────────────────
  const statuts = useMemo(() => [
    "Tous",
    ...[...new Set(projets.map(p => p.statut).filter(Boolean))].sort(),
  ], [projets]);

  const annees = useMemo(() => {
    const set = new Set();
    projets.forEach(p => {
      if (p.date_debut) set.add(new Date(p.date_debut).getFullYear());
      if (p.date_fin)   set.add(new Date(p.date_fin).getFullYear());
    });
    return ["Toutes", ...[...set].sort((a, b) => b - a)];
  }, [projets]);

  // ── Filtered ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = projets;
    if (statutFilter !== "Tous")
      list = list.filter(p => p.statut === statutFilter);
    if (anneeFilter !== "Toutes")
      list = list.filter(p => {
        const debut = p.date_debut ? new Date(p.date_debut).getFullYear() : null;
        const fin   = p.date_fin   ? new Date(p.date_fin).getFullYear()   : null;
        const yr    = Number(anneeFilter);
        return debut === yr || fin === yr || (debut && fin && debut <= yr && yr <= fin);
      });
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.titre || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.axe_recherche || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [projets, statutFilter, anneeFilter, search]);

  const hasFilters = statutFilter !== "Tous" || anneeFilter !== "Toutes" || search.trim();
  const reset = () => { setStatutFilter("Tous"); setAnneeFilter("Toutes"); setSearch(""); };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif" }}>
      <style>{CSS}</style>

      {/* ── Hero header ── */}
      <div style={{
        background: dark
          ? "linear-gradient(160deg,#0b1f14 0%,#0d1f1a 60%,#0b1120 100%)"
          : "linear-gradient(160deg,#ecfdf5 0%,#d1fae5 40%,#f0fdf4 100%)",
        borderBottom: `1px solid ${t.border}`,
        padding: "52px 2rem 40px",
      }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>

          {/* Back */}
          <button
            className="pj-back"
            onClick={() => navigate("/")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "transparent", border: `1.5px solid ${t.border}`,
              borderRadius: 10, padding: "8px 16px",
              fontSize: 13.5, fontWeight: 600, color: t.textMuted,
              cursor: "pointer", marginBottom: 28,
            }}>
            <ArrowLeft/> {lang === "fr" ? "Accueil" : "Home"}
          </button>

          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: dark ? "rgba(5,150,105,.15)" : "rgba(5,150,105,.1)",
              border: `1px solid ${dark ? "rgba(5,150,105,.3)" : "rgba(5,150,105,.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>🔬</div>
            <h1 style={{
              margin: 0, fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900,
              color: t.text, fontFamily: "'Playfair Display',Georgia,serif",
            }}>
              {lang === "fr" ? "Projets de Recherche" : "Research Projects"}
            </h1>
          </div>
          <p style={{ margin: "0 0 0 62px", fontSize: 14.5, color: t.textMuted }}>
            {lang === "fr"
              ? "Tous les projets de recherche scientifique."
              : "All scientific research projects."}
          </p>

          {/* Stats */}
          {!loading && !error && (
            <div style={{
              display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap",
              animation: "fadeUp .4s ease both",
            }}>
              {[
                { label: lang === "fr" ? "Total" : "Total",      value: projets.length },
                { label: lang === "fr" ? "Actifs" : "Active",    value: projets.filter(p => (p.statut||"").toLowerCase() === "actif").length },
                { label: lang === "fr" ? "Terminés" : "Ended",   value: projets.filter(p => (p.statut||"").toLowerCase() === "terminé").length },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "10px 20px", borderRadius: 12,
                  background: dark ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.7)",
                  border: `1px solid ${t.border}`, textAlign: "center",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, color: t.textMuted, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 2rem 80px" }}>

        {/* Error */}
        {error && (
          <div style={{ textAlign: "center", padding: "48px 24px", background: t.bgCard, borderRadius: 18, border: `1px solid rgba(220,38,38,.2)` }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>⚠️</div>
            <p style={{ color: "#dc2626", fontWeight: 600, margin: "0 0 20px" }}>
              {lang === "fr" ? "Impossible de charger les projets." : "Unable to load projects."}
            </p>
            <button onClick={retry} style={{ background: "linear-gradient(135deg,#065f46,#059669)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
              ↻ {lang === "fr" ? "Réessayer" : "Retry"}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} t={t}/>)}
          </div>
        )}

        {/* Data */}
        {!loading && !error && (
          <>
            {/* ── Filters ── */}
            <div style={{
              display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center",
              marginBottom: 32, padding: "18px 20px", borderRadius: 16,
              background: t.bgCard, border: `1px solid ${t.border}`,
            }}>

              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none" }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={lang === "fr" ? "Rechercher un projet…" : "Search projects…"}
                  style={{
                    width: "100%", padding: "9px 12px 9px 36px",
                    borderRadius: 10, border: `1.5px solid ${t.border}`,
                    background: t.bg, color: t.text, fontSize: 13.5, outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = "#059669"}
                  onBlur={e  => e.target.style.borderColor = t.border}
                />
              </div>

              {/* Statut filter */}
              {statuts.length > 2 && (
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {statuts.map(s => (
                    <button key={s} onClick={() => setStatutFilter(s)} style={{
                      background:   statutFilter === s ? "#059669" : t.bgCard,
                      color:        statutFilter === s ? "#fff"    : t.textMuted,
                      border:       `1.5px solid ${statutFilter === s ? "#059669" : t.border}`,
                      borderRadius: 10, padding: "8px 18px",
                      fontWeight:   statutFilter === s ? 700 : 500,
                      fontSize: 13, cursor: "pointer",
                      boxShadow: statutFilter === s ? "0 4px 12px rgba(5,150,105,.3)" : "none",
                    }}>{s}</button>
                  ))}
                </div>
              )}

              {/* Année filter */}
              {annees.length > 2 && (
                <select
                  value={anneeFilter}
                  onChange={e => setAnneeFilter(e.target.value)}
                  style={{
                    padding: "9px 14px", borderRadius: 10,
                    border: `1.5px solid ${anneeFilter !== "Toutes" ? "#059669" : t.border}`,
                    background: t.bgCard, color: t.text, fontSize: 13.5,
                    cursor: "pointer", outline: "none",
                    fontWeight: anneeFilter !== "Toutes" ? 700 : 500,
                  }}>
                  {annees.map(a => (
                    <option key={a} value={a}>
                      {a === "Toutes" ? (lang === "fr" ? "Toutes les années" : "All years") : a}
                    </option>
                  ))}
                </select>
              )}

              {/* Reset */}
              {hasFilters && (
                <button onClick={reset} style={{
                  background: "transparent", color: "#dc2626",
                  border: "1.5px solid rgba(220,38,38,.3)", borderRadius: 10,
                  padding: "9px 14px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  ✕ {lang === "fr" ? "Réinitialiser" : "Reset"}
                </button>
              )}
            </div>

            {/* Count */}
            <div style={{ marginBottom: 20, color: t.textMuted, fontSize: 13.5 }}>
              <span style={{ fontWeight: 700, color: t.text }}>{filtered.length}</span>
              {" "}{lang === "fr" ? `projet${filtered.length !== 1 ? "s" : ""} trouvé${filtered.length !== 1 ? "s" : ""}` : `project${filtered.length !== 1 ? "s" : ""} found`}
              {hasFilters && projets.length !== filtered.length && (
                <span> {lang === "fr" ? `sur ${projets.length}` : `of ${projets.length}`}</span>
              )}
            </div>

            {/* Empty */}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "72px 24px", background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 50, marginBottom: 16 }}>📭</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: t.text }}>
                  {lang === "fr" ? "Aucun projet trouvé." : "No projects found."}
                </h3>
                <button onClick={reset} style={{ background: "linear-gradient(135deg,#065f46,#059669)", color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
                  {lang === "fr" ? "Voir tous les projets" : "View all projects"}
                </button>
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: 20, animation: "fadeUp .4s ease both",
              }}>
                {filtered.map((p, i) => (
                  <ProjetCard key={p.id || i} projet={p} dark={dark} lang={lang} t={t}/>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}