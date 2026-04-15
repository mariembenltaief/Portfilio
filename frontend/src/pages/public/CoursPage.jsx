// pages/CoursPage.jsx
// Page dédiée /cours — liste complète avec filtres avancés

import { useState, useMemo } from "react";
import { useNavigate }       from "react-router-dom";
import { getTheme }          from "../../constants/theme";
import { field }             from "../../utils/formatters";
import { SectionHeader }     from "../../components/ui/SectionHeader";
import { Badge, TypeBadge }  from "../../components/ui/Badge";
import { Icons }             from "../../components/ui/Icons";
import { useCours }          from "../../hooks/useCours";

// ── Arrow icon ─────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

// ── Skeleton card ───────────────────────────────────────────────
function SkeletonCard({ t }) {
  const bar = (w, h = 14) => ({
    width: w, height: h, borderRadius: 8,
    background: `linear-gradient(90deg,${t.skA} 25%,${t.skB} 50%,${t.skA} 75%)`,
    backgroundSize: "400px 100%",
    animation: "pulse .9s ease-in-out infinite alternate",
  });
  return (
    <div style={{ borderRadius: 18, padding: 24, border: `1px solid ${t.border}`, background: t.bgCard }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={bar(48, 22)} /><div style={bar(72, 22)} />
      </div>
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

// ── CourseCard ──────────────────────────────────────────────────
function CourseCard({ cours: c, dark, lang, t }) {
  const navigate = useNavigate();
  const [hov,    setHov]    = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const id     = c.id || c._id;
  const titre  = field.titre(c);
  const type   = field.type(c);
  const niveau = c.niveau || "";
  const duree  = field.duree(c);
  const annee  = field.annee(c);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, padding: 24,
        border: `1px solid ${hov ? "#2563eb" : t.border}`,
        background: t.bgCard,
        display: "flex", flexDirection: "column",
        transition: "transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s, border-color .2s",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 18px 44px rgba(37,99,235,.13)" : "0 1px 4px rgba(0,0,0,.05)",
        position: "relative", overflow: "hidden",
      }}>

      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: hov ? "linear-gradient(90deg,#1e3a8a,#3b82f6)" : "transparent",
        transition: "background .25s", borderRadius: "18px 18px 0 0",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <TypeBadge type={type} />
        {duree && (
          <span style={{ fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
            {Icons.clock(13, t.textMuted)} {duree}h
          </span>
        )}
      </div>

      <h3 style={{
        margin: "0 0 8px", fontSize: 15.5, fontWeight: 700,
        color: t.text, lineHeight: 1.45, flex: 1,
        fontFamily: "'Playfair Display',Georgia,serif",
      }}>
        {titre}
      </h3>

      {c.description && (
        <p style={{
          margin: "0 0 12px", fontSize: 13, color: t.textMuted, lineHeight: 1.65,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {c.description}
        </p>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {niveau && <Badge label={niveau} dark={dark} />}
        {annee  && <Badge label={annee}  dark={dark} />}
      </div>

      <button
        onClick={() => id && navigate(`/cours/${id}`)}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        disabled={!id}
        style={{
          alignSelf: "flex-start",
          display: "flex", alignItems: "center", gap: 7,
          background: btnHov ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : t.accentDim,
          color: btnHov ? "#fff" : "#2563eb",
          border: `1.5px solid ${btnHov ? "transparent" : t.accentBdr}`,
          borderRadius: 10, padding: "9px 18px",
          fontSize: 13, fontWeight: 700, cursor: id ? "pointer" : "not-allowed",
          boxShadow: btnHov ? "0 4px 16px rgba(37,99,235,.4)" : "none",
          transition: "all .2s",
        }}>
        {lang === "fr" ? "Voir plus" : "View details"}
        <ArrowRight />
      </button>
    </div>
  );
}

// ── Filter pill ─────────────────────────────────────────────────
function FilterPill({ label, active, onClick, t }) {
  return (
    <button onClick={onClick} style={{
      background:   active ? "#2563eb" : t.bgCard,
      color:        active ? "#fff"    : t.textMuted,
      border:       `1.5px solid ${active ? "#2563eb" : t.border}`,
      borderRadius: 10, padding: "9px 24px",
      fontWeight:   active ? 700 : 500,
      fontSize: 13.5, cursor: "pointer", transition: "all .18s",
      boxShadow: active ? "0 4px 14px rgba(37,99,235,.3)" : "none",
    }}>
      {label}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// CoursPage — page /cours complète
// Props: dark {boolean}, lang {"fr"|"en"}
// ══════════════════════════════════════════════════════════════
export default function CoursPage({ dark = false, lang = "fr" }) {
  const navigate = useNavigate();
  const t = {
    ...getTheme(dark),
    skA: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
    skB: dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.09)",
  };

  const [typeFilter,   setTypeFilter]   = useState("Tous");
  const [niveauFilter, setNiveauFilter] = useState("Tous");
  const [search,       setSearch]       = useState("");

  const { cours, loading, error, retry } = useCours();

  // Computed filter options
  const types = useMemo(
    () => ["Tous", ...[...new Set(cours.map(c => field.type(c)).filter(Boolean))].sort()],
    [cours]
  );
  const niveaux = useMemo(
    () => ["Tous", ...[...new Set(cours.map(c => c.niveau).filter(Boolean))].sort()],
    [cours]
  );

  // Filtered list
  const filtered = useMemo(() => {
    let list = cours;
    if (typeFilter   !== "Tous") list = list.filter(c => field.type(c) === typeFilter);
    if (niveauFilter !== "Tous") list = list.filter(c => c.niveau === niveauFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        field.titre(c).toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [cours, typeFilter, niveauFilter, search]);

  const hasFilters = typeFilter !== "Tous" || niveauFilter !== "Tous" || search.trim();
  const resetFilters = () => { setTypeFilter("Tous"); setNiveauFilter("Tous"); setSearch(""); };

  return (
    <div style={{
      minHeight: "100vh", background: t.bg,
      fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif",
    }}>
      <style>{`@keyframes pulse { from{opacity:.35} to{opacity:.75} } @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }`}</style>

      {/* ── Hero header ── */}
      <div style={{
        background: dark
          ? "linear-gradient(160deg,#0d1829 0%,#111e36 60%,#0b1120 100%)"
          : "linear-gradient(160deg,#eef4ff 0%,#e8f0fe 60%,#f0f5ff 100%)",
        borderBottom: `1px solid ${t.border}`,
        padding: "52px 2rem 40px",
      }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>

          {/* Back to home */}
          <button
            onClick={() => navigate("/")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "transparent", border: `1.5px solid ${t.border}`,
              borderRadius: 10, padding: "8px 16px",
              fontSize: 13.5, fontWeight: 600, color: t.textMuted,
              cursor: "pointer", marginBottom: 28,
              transition: "all .18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
          >
            <ArrowLeft />
            {lang === "fr" ? "Accueil" : "Home"}
          </button>

          <SectionHeader
            iconFn={Icons.book}
            title={lang === "fr" ? "Tous les Cours" : "All Courses"}
            subtitle={lang === "fr"
              ? "Catalogue complet des enseignements en informatique et intelligence artificielle."
              : "Complete catalog of CS & AI teaching modules."}
            dark={dark}
          />

          {/* Stats bar */}
          {!loading && !error && (
            <div style={{
              display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap",
              marginTop: 24, animation: "fadeUp .4s ease both",
            }}>
              {[
                { label: lang === "fr" ? "Cours total" : "Total courses", value: cours.length },
                { label: "CM",  value: cours.filter(c => field.type(c) === "CM").length },
                { label: "TD",  value: cours.filter(c => field.type(c) === "TD").length },
                { label: "TP",  value: cours.filter(c => field.type(c) === "TP").length },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "12px 24px", borderRadius: 12,
                  background: dark ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.7)",
                  border: `1px solid ${t.border}`,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "48px 2rem 80px" }}>

        {/* Error */}
        {error && (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: t.bgCard, borderRadius: 18,
            border: `1px solid rgba(220,38,38,.2)`,
          }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>⚠️</div>
            <p style={{ color: "#dc2626", fontWeight: 600, margin: "0 0 8px" }}>
              {lang === "fr" ? "Impossible de charger les cours." : "Unable to load courses."}
            </p>
            <p style={{ color: t.textMuted, fontSize: 13, margin: "0 0 20px" }}>{error}</p>
            <button onClick={retry} style={{
              background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff",
              border: "none", borderRadius: 10, padding: "10px 22px",
              fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            }}>
              {lang === "fr" ? "↻ Réessayer" : "↻ Retry"}
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} t={t} />)}
          </div>
        )}

        {/* Data */}
        {!loading && !error && (
          <>
            {/* ── Filters bar ── */}
            <div style={{
              display: "flex", gap: 16, flexWrap: "wrap",
              alignItems: "center", marginBottom: 36,
              padding: "20px 24px", borderRadius: 16,
              background: t.bgCard, border: `1px solid ${t.border}`,
            }}>

              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: t.textMuted, pointerEvents: "none",
                }}>
                  🔍
                </span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={lang === "fr" ? "Rechercher un cours…" : "Search courses…"}
                  style={{
                    width: "100%", paddingLeft: 36, padding: "9px 12px 9px 36px",
                    borderRadius: 10, border: `1.5px solid ${t.border}`,
                    background: t.bg, color: t.text, fontSize: 13.5,
                    outline: "none", transition: "border-color .18s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = t.border}
                />
              </div>

              {/* Type filters */}
              {types.length > 1 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {types.map(f => (
                    <FilterPill key={f} label={f} active={typeFilter === f}
                      onClick={() => setTypeFilter(f)} t={t} />
                  ))}
                </div>
              )}

              {/* Niveau select */}
              {niveaux.length > 2 && (
                <select
                  value={niveauFilter}
                  onChange={e => setNiveauFilter(e.target.value)}
                  style={{
                    padding: "9px 14px", borderRadius: 10,
                    border: `1.5px solid ${niveauFilter !== "Tous" ? "#2563eb" : t.border}`,
                    background: t.bgCard, color: t.text, fontSize: 13.5,
                    cursor: "pointer", outline: "none",
                    fontWeight: niveauFilter !== "Tous" ? 700 : 500,
                  }}>
                  {niveaux.map(n => (
                    <option key={n} value={n}>{n === "Tous" ? (lang === "fr" ? "Tous les niveaux" : "All levels") : n}</option>
                  ))}
                </select>
              )}

              {/* Reset */}
              {hasFilters && (
                <button onClick={resetFilters} style={{
                  background: "transparent", color: "#dc2626",
                  border: "1.5px solid rgba(220,38,38,.3)", borderRadius: 10,
                  padding: "9px 16px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  ✕ {lang === "fr" ? "Réinitialiser" : "Reset"}
                </button>
              )}
            </div>

            {/* Results count */}
            <div style={{ marginBottom: 20, color: t.textMuted, fontSize: 13.5 }}>
              <span style={{ fontWeight: 700, color: t.text }}>{filtered.length}</span>
              {" "}{lang === "fr" ? `cours trouvé${filtered.length !== 1 ? "s" : ""}` : `course${filtered.length !== 1 ? "s" : ""} found`}
              {hasFilters && cours.length !== filtered.length && (
                <span> {lang === "fr" ? `sur ${cours.length}` : `of ${cours.length}`}</span>
              )}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div style={{
                textAlign: "center", padding: "72px 24px",
                background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}`,
              }}>
                <div style={{ fontSize: 50, marginBottom: 16 }}>📭</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: t.text }}>
                  {lang === "fr" ? "Aucun cours trouvé." : "No courses found."}
                </h3>
                <p style={{ margin: "0 0 20px", color: t.textMuted, fontSize: 14 }}>
                  {lang === "fr" ? "Essayez d'autres filtres." : "Try different filters."}
                </p>
                <button onClick={resetFilters} style={{
                  background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff",
                  border: "none", borderRadius: 10, padding: "9px 20px",
                  fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                }}>
                  {lang === "fr" ? "Voir tous les cours" : "View all courses"}
                </button>
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: 20,
                animation: "fadeUp .4s ease both",
              }}>
                {filtered.map((c, i) => (
                  <CourseCard key={c.id || i} cours={c} dark={dark} lang={lang} t={t} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}