import { useState }      from "react";
import { useNavigate }   from "react-router-dom";
import { getTheme }      from "../../constants/theme";
import { formatDate }    from "../../utils/formatters";
import { SectionHeader } from "../ui/SectionHeader";
import { Badge }         from "../ui/Badge";
import { Icons }         from "../ui/Icons";

const ArrowRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

function ArticleCard({ article: a, dark, lang, t }) {
  const navigate = useNavigate();
  const [hov,    setHov]    = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const id     = a.id || a._id;
  const titre  = a.titre || a.title || "—";
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const rowBorder  = "1px solid " + (hov ? "#2563eb" : t.border);
  const rowShadow  = hov ? "0 18px 44px rgba(37,99,235,.13)" : "0 1px 4px rgba(0,0,0,.05)";
  const rowMove    = hov ? "translateY(-5px)" : "none";
  const accentTop  = hov ? "linear-gradient(90deg,#1e3a8a,#3b82f6)" : "transparent";
  const btnBg      = btnHov ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : t.accentDim;
  const btnColor   = btnHov ? "#fff" : "#2563eb";
  const btnBorder  = "1.5px solid " + (btnHov ? "transparent" : t.accentBdr);
  const btnShadow  = btnHov ? "0 4px 16px rgba(37,99,235,.4)" : "none";
  const filterBg   = (active) => active ? "#2563eb" : t.bgCard;
  const filterClr  = (active) => active ? "#fff" : t.textMuted;
  const filterBdr  = (active) => "1.5px solid " + (active ? "#2563eb" : t.border);
  const filterShdw = (active) => active ? "0 4px 14px rgba(37,99,235,.3)" : "none";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18,
        padding: 24,
        border: rowBorder,
        background: t.bgCard,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s, border-color .2s",
        transform: rowMove,
        boxShadow: rowShadow,
        position: "relative",
        overflow: "hidden",
      }}>

      {/* Accent top line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accentTop, transition: "background .25s", borderRadius: "18px 18px 0 0" }}/>

      {/* Badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {a.categorie && <Badge label={a.categorie} color="blue" dark={dark}/>}
        {a.langue    && <Badge label={a.langue.toUpperCase()} dark={dark}/>}
      </div>

      {/* Title */}
      <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: t.text, lineHeight: 1.45, fontFamily: "'Playfair Display',Georgia,serif" }}>
        {titre}
      </h3>

      {/* Excerpt */}
      {a.contenu && (
        <p style={{ margin: 0, fontSize: 13.5, color: t.textMuted, lineHeight: 1.7, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", flex: 1 }}>
          {a.contenu}
        </p>
      )}

      {/* Date */}
      {a.date_publication && (
        <div style={{ fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
          {Icons.clock(13, t.textMuted)}
          {formatDate(a.date_publication, locale)}
        </div>
      )}

      {/* Voir détails button */}
      <button
        onClick={() => { if (id) navigate("/blog/" + id); }}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        disabled={!id}
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: btnBg,
          color: btnColor,
          border: btnBorder,
          borderRadius: 10,
          padding: "9px 18px",
          fontSize: 13,
          fontWeight: 700,
          cursor: id ? "pointer" : "not-allowed",
          boxShadow: btnShadow,
          transition: "all .2s",
          marginTop: "auto",
        }}>
        {lang === "fr" ? "Lire l'article" : "Read article"}
        <ArrowRight/>
      </button>
    </div>
  );
}

export function BlogSection({ articlesBlog, dark, lang }) {
  const t = getTheme(dark);
  const [filtre, setFiltre] = useState("Tous");

  if (!articlesBlog || articlesBlog.length === 0) return null;

  const categories = ["Tous", ...[...new Set(articlesBlog.map(a => a.categorie).filter(Boolean))]];
  const filtered   = filtre === "Tous"
    ? articlesBlog
    : articlesBlog.filter(a => a.categorie === filtre);

  const filterBg   = (active) => active ? "#2563eb" : t.bgCard;
  const filterClr  = (active) => active ? "#fff"    : t.textMuted;
  const filterBdr  = (active) => "1.5px solid " + (active ? "#2563eb" : t.border);
  const filterShdw = (active) => active ? "0 4px 14px rgba(37,99,235,.3)" : "none";

  return (
    <section id="blog" style={{ padding: "96px 2rem", background: t.bgSection ?? t.bg }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        <SectionHeader
          iconFn={Icons.pen}
          title="Blog"
          subtitle={lang === "fr"
            ? "Articles et réflexions sur l'enseignement et la recherche."
            : "Articles and thoughts on teaching & research."}
          dark={dark}
        />

        {/* Filters */}
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltre(cat)}
                style={{
                  background:   filterBg(filtre === cat),
                  color:        filterClr(filtre === cat),
                  border:       filterBdr(filtre === cat),
                  borderRadius: 10,
                  padding:      "9px 22px",
                  fontWeight:   filtre === cat ? 700 : 500,
                  fontSize:     13.5,
                  cursor:       "pointer",
                  transition:   "all .18s",
                  boxShadow:    filterShdw(filtre === cat),
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 22 }}>
          {filtered.map((a, i) => (
            <ArticleCard key={a.id || i} article={a} dark={dark} lang={lang} t={t}/>
          ))}
        </div>

      </div>
    </section>
  );
}