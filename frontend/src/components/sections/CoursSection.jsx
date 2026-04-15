// components/sections/CoursSection.jsx
// Updated: each card has a "Voir plus" button → navigates to /cours/:id

import { useState, useMemo }   from "react";
import { useNavigate }         from "react-router-dom";
import { getTheme }            from "../../constants/theme";
import { field }               from "../../utils/formatters";
import { SectionHeader }       from "../ui/SectionHeader";
import { Card }                from "../ui/Card";
import { Badge, TypeBadge }    from "../ui/Badge";
import { Icons }               from "../ui/Icons";
import { useCours }            from "../../hooks/useCours";

const FILTERS = ["Tous", "CM", "TD", "TP"];

// ── Arrow icon ───────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Skeleton card ────────────────────────────────────────────
function SkeletonCard({ t }) {
  const bar = (w, h=14) => ({
    width:w, height:h, borderRadius:8,
    background:`linear-gradient(90deg,${t.skA||"rgba(0,0,0,.04)"} 25%,${t.skB||"rgba(0,0,0,.09)"} 50%,${t.skA||"rgba(0,0,0,.04)"} 75%)`,
    backgroundSize:"400px 100%",
    animation:"pulse .9s ease-in-out infinite alternate",
  });
  return (
    <div style={{ borderRadius:18, padding:24, border:`1px solid ${t.border}`, background:t.bgCard }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
        <div style={bar(48,22)}/><div style={bar(72,22)}/>
      </div>
      <div style={{ ...bar("78%",18), marginBottom:10 }}/>
      <div style={{ ...bar("100%"), marginBottom:6 }}/><div style={{ ...bar("85%"), marginBottom:18 }}/>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <div style={bar(70,22)}/><div style={bar(80,22)}/>
      </div>
      <div style={bar(130,36)}/>
    </div>
  );
}

// ── CourseCard ───────────────────────────────────────────────
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

  const handleView = () => {
    if (id) navigate(`/cours/${id}`);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:18, padding:24,
        border:`1px solid ${hov ? "#2563eb" : t.border}`,
        background:t.bgCard,
        display:"flex", flexDirection:"column",
        transition:"transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s, border-color .2s",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 18px 44px rgba(37,99,235,.13)" : "0 1px 4px rgba(0,0,0,.05)",
        position:"relative", overflow:"hidden",
      }}>
      {/* Top accent line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:3,
        background: hov ? "linear-gradient(90deg,#1e3a8a,#3b82f6)" : "transparent",
        transition:"background .25s", borderRadius:"18px 18px 0 0",
      }}/>

      {/* Type badge + duration */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <TypeBadge type={type}/>
        {duree && (
          <span style={{ fontSize:12, color:t.textMuted, display:"flex", alignItems:"center", gap:4 }}>
            {Icons.clock(13, t.textMuted)} {duree}h
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        margin:"0 0 8px", fontSize:15.5, fontWeight:700,
        color:t.text, lineHeight:1.45, flex:1,
        fontFamily:"'Playfair Display',Georgia,serif",
      }}>
        {titre}
      </h3>

      {/* Description truncated */}
      {c.description && (
        <p style={{
          margin:"0 0 12px", fontSize:13, color:t.textMuted, lineHeight:1.65,
          overflow:"hidden", display:"-webkit-box",
          WebkitLineClamp:2, WebkitBoxOrient:"vertical",
        }}>
          {c.description}
        </p>
      )}

      {/* Meta badges */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
        {niveau && <Badge label={niveau} dark={dark}/>}
        {annee  && <Badge label={annee}  dark={dark}/>}
      </div>

      {/* ── Voir plus button ── */}
      <button
        onClick={handleView}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        disabled={!id}
        style={{
          alignSelf:"flex-start",
          display:"flex", alignItems:"center", gap:7,
          background: btnHov
            ? "linear-gradient(135deg,#1e3a8a,#2563eb)"
            : t.accentDim,
          color: btnHov ? "#fff" : "#2563eb",
          border:`1.5px solid ${btnHov ? "transparent" : t.accentBdr}`,
          borderRadius:10, padding:"9px 18px",
          fontSize:13, fontWeight:700, cursor: id ? "pointer" : "not-allowed",
          boxShadow: btnHov ? "0 4px 16px rgba(37,99,235,.4)" : "none",
          transition:"all .2s",
        }}>
        {lang==="fr" ? "Voir plus" : "View details"}
        <ArrowRight/>
      </button>
    </div>
  );
}

/**
 * CoursSection — filterable grid with navigation to detail page.
 *
 * Props: dark {boolean}, lang {"fr"|"en"}
 * No `cours` prop — manages its own fetch via useCours.
 */
export function CoursSection({ dark, lang }) {
  const navigate = useNavigate();
  const t = {
    ...getTheme(dark),
    skA: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
    skB: dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.09)",
  };
  const [filter, setFilter] = useState("Tous");

  const { cours, loading, error, retry } = useCours();

  const availableTypes = useMemo(
    () => [...new Set(cours.map(c => field.type(c)).filter(Boolean))].sort(),
    [cours]
  );
  const visibleFilters = ["Tous", ...availableTypes];

  const filtered = useMemo(
    () => filter === "Tous" ? cours : cours.filter(c => field.type(c) === filter),
    [cours, filter]
  );

  return (
    <section id="cours" style={{ padding:"96px 2rem", background:t.bg }}>
      <style>{`@keyframes pulse { from{opacity:.35} to{opacity:.75} }`}</style>
      <div style={{ maxWidth:1160, margin:"0 auto" }}>

        <SectionHeader
          iconFn={Icons.book}
          title={lang==="fr" ? "Mes Cours" : "My Courses"}
          subtitle={lang==="fr"
            ? "Enseignements en informatique et intelligence artificielle."
            : "CS & AI teaching modules."}
          dark={dark}
        />

        {/* Error */}
        {error && (
          <div style={{
            textAlign:"center", padding:"48px 24px",
            background:t.bgCard, borderRadius:18,
            border:`1px solid rgba(220,38,38,.2)`,
          }}>
            <div style={{ fontSize:44, marginBottom:14 }}>⚠️</div>
            <p style={{ color:"#dc2626", fontWeight:600, margin:"0 0 8px" }}>
              {lang==="fr" ? "Impossible de charger les cours." : "Unable to load courses."}
            </p>
            <p style={{ color:t.textMuted, fontSize:13, margin:"0 0 20px" }}>{error}</p>
            <button onClick={retry} style={{
              background:"linear-gradient(135deg,#1e3a8a,#2563eb)", color:"#fff",
              border:"none", borderRadius:10, padding:"10px 22px",
              fontSize:13.5, fontWeight:700, cursor:"pointer",
            }}>
              {lang==="fr" ? "↻ Réessayer" : "↻ Retry"}
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
            {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} t={t}/>)}
          </div>
        )}

        {/* Data */}
        {!loading && !error && (
          <>
            {/* Filters */}
            {visibleFilters.length > 1 && (
              <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:48, flexWrap:"wrap" }}>
                {visibleFilters.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{
                      background:   filter===f ? "#2563eb" : t.bgCard,
                      color:        filter===f ? "#fff"    : t.textMuted,
                      border:      `1.5px solid ${filter===f ? "#2563eb" : t.border}`,
                      borderRadius:10, padding:"9px 24px",
                      fontWeight:   filter===f ? 700 : 500,
                      fontSize:13.5, cursor:"pointer", transition:"all .18s",
                      boxShadow: filter===f ? "0 4px 14px rgba(37,99,235,.3)" : "none",
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div style={{
                textAlign:"center", padding:"72px 24px",
                background:t.bgCard, borderRadius:18, border:`1px solid ${t.border}`,
              }}>
                <div style={{ fontSize:50, marginBottom:16 }}>📭</div>
                <h3 style={{ margin:"0 0 8px", fontSize:18, fontWeight:700, color:t.text }}>
                  {lang==="fr" ? "Aucun cours trouvé." : "No courses found."}
                </h3>
                <p style={{ margin:"0 0 20px", color:t.textMuted, fontSize:14 }}>
                  {cours.length > 0
                    ? (lang==="fr" ? "Essayez un autre filtre." : "Try another filter.")
                    : (lang==="fr" ? "Aucun cours disponible pour le moment." : "No courses available yet.")}
                </p>
                {filter !== "Tous" && (
                  <button onClick={() => setFilter("Tous")} style={{
                    background:"linear-gradient(135deg,#1e3a8a,#2563eb)", color:"#fff",
                    border:"none", borderRadius:10, padding:"9px 20px",
                    fontSize:13.5, fontWeight:700, cursor:"pointer",
                  }}>
                    {lang==="fr" ? "Voir tous les cours" : "View all courses"}
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
                {filtered.slice(0, 3).map((c,i) => (
                  <CourseCard key={c.id||i} cours={c} dark={dark} lang={lang} t={t}/>
                ))}
              </div>
            )}
           
{filtered.length > 0 && (
  <>
    

    {/* ── Voir tous les cours ── */}
    <div style={{ textAlign:"center", marginTop:48 }}>
      <button
        onClick={() => navigate("/cours")}
        style={{
          display:"inline-flex", alignItems:"center", gap:10,
          background:"linear-gradient(135deg,#1e3a8a,#2563eb)",
          color:"#fff", border:"none", borderRadius:14,
          padding:"14px 36px", fontSize:15, fontWeight:700,
          cursor:"pointer",
          boxShadow:"0 6px 24px rgba(37,99,235,.35)",
          transition:"all .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 32px rgba(37,99,235,.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 24px rgba(37,99,235,.35)"; }}
      >
        {lang==="fr" ? "Voir tous les cours" : "View all courses"}
        <ArrowRight/>
      </button>
    </div>
  </>
)}
          </>
        )}
      </div>
    </section>
  );
}
