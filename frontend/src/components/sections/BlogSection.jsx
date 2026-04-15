// src/components/sections/BlogSection.jsx
import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import { getTheme }    from "../../constants/theme";
import { formatDate }  from "../../utils/formatters";
import { SectionHeader } from "../ui/SectionHeader";
import { Badge }       from "../ui/Badge";
import { Icons }       from "../ui/Icons";

const MAX_HOME = 3;

const ArrowRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, padding: 24,
        border: `1px solid ${hov ? "#2563eb" : t.border}`,
        background: t.bgCard,
        display: "flex", flexDirection: "column", gap: 12,
        transition: "transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s, border-color .2s",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 18px 44px rgba(37,99,235,.13)" : "0 1px 4px rgba(0,0,0,.05)",
        position: "relative", overflow: "hidden",
      }}>

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: hov ? "linear-gradient(90deg,#1e3a8a,#3b82f6)" : "transparent",
        transition: "background .25s", borderRadius: "18px 18px 0 0",
      }}/>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {a.categorie && <Badge label={a.categorie} color="blue" dark={dark}/>}
        {a.langue    && <Badge label={a.langue.toUpperCase()} dark={dark}/>}
      </div>

      <h3 style={{
        margin: 0, fontSize: 16.5, fontWeight: 700, color: t.text,
        lineHeight: 1.45, fontFamily: "'Playfair Display',Georgia,serif",
      }}>
        {titre}
      </h3>

      {a.contenu && (
        <p style={{
          margin: 0, fontSize: 13.5, color: t.textMuted, lineHeight: 1.7,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 3, WebkitBoxOrient: "vertical", flex: 1,
        }}>
          {a.contenu}
        </p>
      )}

      {a.date_publication && (
        <div style={{ fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
          {Icons.clock(13, t.textMuted)}
          {formatDate(a.date_publication, locale)}
        </div>
      )}

      <button
        onClick={() => id && navigate(`/blog/${id}`)}
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
          fontSize: 13, fontWeight: 700,
          cursor: id ? "pointer" : "not-allowed",
          boxShadow: btnHov ? "0 4px 16px rgba(37,99,235,.4)" : "none",
          transition: "all .2s", marginTop: "auto",
        }}>
        {lang === "fr" ? "Lire l'article" : "Read article"} <ArrowRight/>
      </button>
    </div>
  );
}

export function BlogSection({ articlesBlog, dark, lang }) {
  const navigate = useNavigate();
  const t = getTheme(dark);
  const [filtre,  setFiltre]  = useState("Tous");
  const [btnHov,  setBtnHov]  = useState(false);

  if (!articlesBlog || articlesBlog.length === 0) return null;

  const categories = ["Tous", ...[...new Set(articlesBlog.map(a => a.categorie).filter(Boolean))]];
  const filtered   = filtre === "Tous"
    ? articlesBlog
    : articlesBlog.filter(a => a.categorie === filtre);

  const visible = filtered.slice(0, MAX_HOME);

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

        {/* Category filters */}
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltre(cat)}
                style={{
                  background:   filtre === cat ? "#2563eb" : t.bgCard,
                  color:        filtre === cat ? "#fff"    : t.textMuted,
                  border:       `1.5px solid ${filtre === cat ? "#2563eb" : t.border}`,
                  borderRadius: 10, padding: "9px 22px",
                  fontWeight:   filtre === cat ? 700 : 500,
                  fontSize: 13.5, cursor: "pointer", transition: "all .18s",
                  boxShadow: filtre === cat ? "0 4px 14px rgba(37,99,235,.3)" : "none",
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 22 }}>
          {visible.map((a, i) => (
            <ArticleCard key={a.id || i} article={a} dark={dark} lang={lang} t={t}/>
          ))}
        </div>

        {/* ── Voir tous button ── */}
        {articlesBlog.length > MAX_HOME && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <button
              onClick={() => navigate("/blog")}
              onMouseEnter={() => setBtnHov(true)}
              onMouseLeave={() => setBtnHov(false)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: btnHov ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : "transparent",
                color: btnHov ? "#fff" : "#2563eb",
                border: `1.5px solid ${btnHov ? "transparent" : (dark ? "rgba(37,99,235,.4)" : "rgba(37,99,235,.3)")}`,
                borderRadius: 12, padding: "12px 28px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: btnHov ? "0 4px 20px rgba(37,99,235,.4)" : "none",
                transition: "all .2s",
              }}>
              ✍️ {lang === "fr" ? `Voir tous les articles (${articlesBlog.length})` : `View all articles (${articlesBlog.length})`}
              <ArrowRight/>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}