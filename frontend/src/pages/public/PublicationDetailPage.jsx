import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate }           from "react-router-dom";

const API = "http://localhost:5000/api";

const CSS = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .bd-back:hover { border-color:#2563eb !important; color:#2563eb !important; transform:translateX(-3px); }
  .bd-back       { transition:all .18s cubic-bezier(.4,0,.2,1); }
  .bd-lift       { transition:transform .22s, box-shadow .22s, border-color .2s; }
  .bd-lift:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(37,99,235,.12) !important; border-color:rgba(37,99,235,.3) !important; }
  * { box-sizing:border-box; }
`;

const tk = (dark) => ({
  bg:        dark ? "#0b1120"               : "#f7f9fc",
  bgCard:    dark ? "#151f35"               : "#ffffff",
  bgHero:    dark
    ? "linear-gradient(160deg,#0d1829 0%,#111e36 60%,#0b1120 100%)"
    : "linear-gradient(160deg,#eef4ff 0%,#e8f0fe 60%,#f0f5ff 100%)",
  border:    dark ? "rgba(255,255,255,.07)" : "rgba(15,23,42,.08)",
  text:      dark ? "#e8edf5"               : "#0f172a",
  textMuted: dark ? "#7c8fb5"               : "#64748b",
  accent:    "#2563eb",
  accentDim: dark ? "rgba(37,99,235,.14)"   : "rgba(37,99,235,.08)",
  accentBdr: dark ? "rgba(37,99,235,.28)"   : "rgba(37,99,235,.16)",
  skA:       dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
  skB:       dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.08)",
});

const IcoArrowL = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IcoCalendar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoTag = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const IcoGlobe = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IcoPen = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IcoRetry = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

function formatDate(dateStr, locale) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  } catch { return dateStr; }
}

function Skeleton({ t }) {
  const sh = {
    background: "linear-gradient(90deg," + t.skA + " 25%," + t.skB + " 50%," + t.skA + " 75%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.4s linear infinite",
    borderRadius: 8,
  };
  const bar = (w, h, mb) => (
    <div style={{ ...sh, width: w, height: h || 14, marginBottom: mb || 0 }}/>
  );
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 2rem" }}>
      <div style={{ marginBottom: 32 }}>
        {bar(80, 28, 16)}{bar("65%", 24, 10)}{bar("40%", 14, 0)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 28 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ padding: 16, borderRadius: 14, background: t.bgCard, border: "1px solid " + t.border }}>
            {bar("50%", 11, 8)}{bar("70%", 16, 0)}
          </div>
        ))}
      </div>
      <div style={{ padding: 28, borderRadius: 16, background: t.bgCard, border: "1px solid " + t.border }}>
        {[95, 88, 92, 75, 85, 60, 78, 90, 55, 70].map((w, j) => (
          <div key={j} style={{ ...sh, width: w + "%", height: 14, marginBottom: 12 }}/>
        ))}
      </div>
    </div>
  );
}

function InfoChip({ icon, label, value, t, dark }) {
  return (
    <div className="bd-lift" style={{ padding: "14px 18px", borderRadius: 14, background: t.bgCard, border: "1px solid " + t.border, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: t.accentDim, border: "1px solid " + t.accentBdr, display: "flex", alignItems: "center", justifyContent: "center", color: dark ? "#60a5fa" : "#1e3a8a", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{value}</div>
      </div>
    </div>
  );
}

function useBlogDetail(id) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tick,    setTick]    = useState(0);
  const retry = useCallback(() => setTick(n => n + 1), []);

  useEffect(() => {
    if (!id) { setLoading(false); setError("ID manquant"); return; }
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res  = await fetch(API + "/articles-blog/" + id);
        if (!res.ok) throw new Error(res.status === 404 ? "Article non trouvé" : "HTTP " + res.status);
        const json = await res.json();
        const data = json.blogPost ?? json.article ?? json.data ?? (json.id ? json : null);
        if (!data) throw new Error("Réponse invalide");
        if (!cancelled) { setArticle(data); setLoading(false); }
      } catch (err) {
        if (!cancelled) { setError(err?.message ?? "Erreur réseau"); setLoading(false); }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, tick]);

  return { article, loading, error, retry };
}

export default function BlogDetailPage({ dark, lang }) {
  const safeDark  = dark ?? false;
  const safeLang  = lang ?? "fr";
  const { id }    = useParams();
  const navigate  = useNavigate();
  const t         = tk(safeDark);

  const { article, loading, error, retry } = useBlogDetail(id);
  const onBack = () => navigate(-1);

  const locale        = safeLang === "fr" ? "fr-FR" : "en-US";
  const titre         = article ? (article.titre     ?? "—")  : "";
  const contenu       = article ? (article.contenu   ?? "")   : "";
  const categorie     = article ? (article.categorie ?? "")   : "";
  const langue        = article ? (article.langue    ?? "")   : "";
  const datePub       = article ? formatDate(article.date_publication, locale) : null;

  const borderCard    = "1px solid " + t.border;
  const accentChipBdr = "1px solid " + t.accentBdr;
  const badgeAccColor = safeDark ? "#93c5fd" : "#1d4ed8";
  const iconColor     = safeDark ? "#60a5fa" : "#2563eb";

  const contentArr = contenu
    ? (contenu.split(/\n\n+/).filter(Boolean).length > 1
        ? contenu.split(/\n\n+/).filter(Boolean)
        : contenu.split(/\n/).filter(Boolean).length > 1
          ? contenu.split(/\n/).filter(Boolean)
          : [contenu])
    : [];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif" }}>
      <style>{CSS}</style>

      {loading && <Skeleton t={t}/>}

      {!loading && error && (
        <div style={{ maxWidth: 520, margin: "80px auto", padding: "0 2rem", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>⚠️</div>
          <h2 style={{ margin: "0 0 10px", color: t.text, fontSize: 22, fontWeight: 800 }}>
            {safeLang === "fr" ? "Article introuvable" : "Article not found"}
          </h2>
          <p style={{ margin: "0 0 24px", color: t.textMuted, fontSize: 14 }}>{error}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={retry} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              <IcoRetry/> {safeLang === "fr" ? "Réessayer" : "Retry"}
            </button>
            <button className="bd-back" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", color: t.textMuted, border: "1.5px solid " + t.border, borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <IcoArrowL/> {safeLang === "fr" ? "Retour" : "Back"}
            </button>
          </div>
        </div>
      )}

      {!loading && !error && article && (
        <>
          {/* Hero */}
          <div style={{ background: t.bgHero, borderBottom: borderCard, padding: "56px 2rem 40px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>

              <button className="bd-back" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", border: "1.5px solid " + t.border, borderRadius: 10, padding: "8px 16px", fontSize: 13.5, fontWeight: 600, color: t.textMuted, cursor: "pointer", marginBottom: 24 }}>
                <IcoArrowL/>
                {safeLang === "fr" ? "Retour au blog" : "Back to blog"}
              </button>

              {/* Badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                {categorie && (
                  <span style={{ background: t.accentDim, color: badgeAccColor, border: accentChipBdr, fontSize: 12.5, fontWeight: 800, borderRadius: 8, padding: "5px 14px" }}>
                    {categorie}
                  </span>
                )}
                {langue && (
                  <span style={{ background: "rgba(8,145,178,.1)", color: "#0891b2", border: "1px solid rgba(8,145,178,.2)", fontSize: 12, fontWeight: 800, borderRadius: 8, padding: "5px 14px" }}>
                    {langue.toUpperCase()}
                  </span>
                )}
                {datePub && (
                  <span style={{ background: "rgba(100,116,139,.1)", color: t.textMuted, border: "1px solid rgba(100,116,139,.2)", fontSize: 12, fontWeight: 600, borderRadius: 8, padding: "5px 14px", display: "flex", alignItems: "center", gap: 5 }}>
                    <IcoCalendar/> {datePub}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ margin: 0, fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: t.text, lineHeight: 1.25, letterSpacing: -0.5, fontFamily: "'Playfair Display',Georgia,serif", animation: "fadeUp .45s ease both" }}>
                {titre}
              </h1>
            </div>
          </div>

          {/* Body */}
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 2rem 80px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Info chips */}
              {(datePub || categorie || langue) && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, animation: "fadeUp .45s ease .06s both" }}>
                  {datePub   && <InfoChip icon={<IcoCalendar/>} label={safeLang === "fr" ? "Publié le" : "Published"} value={datePub}            t={t} dark={safeDark}/>}
                  {categorie && <InfoChip icon={<IcoTag/>}      label={safeLang === "fr" ? "Catégorie" : "Category"}  value={categorie}           t={t} dark={safeDark}/>}
                  {langue    && <InfoChip icon={<IcoGlobe/>}    label={safeLang === "fr" ? "Langue"    : "Language"}  value={langue.toUpperCase()} t={t} dark={safeDark}/>}
                </div>
              )}

              {/* Content */}
              {contenu && (
                <div style={{ borderRadius: 18, padding: "32px 36px", background: t.bgCard, border: borderCard, animation: "fadeUp .45s ease .12s both" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: borderCard }}>
                    <span style={{ color: iconColor }}><IcoPen/></span>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.text, fontFamily: "'Playfair Display',Georgia,serif" }}>
                      {safeLang === "fr" ? "Contenu de l'article" : "Article content"}
                    </h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {contentArr.map((para, i) => (
                      <p key={i} style={{ margin: 0, fontSize: 15.5, color: t.textMuted, lineHeight: 1.9, textAlign: "justify" }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ borderRadius: 14, padding: "18px 22px", background: t.accentDim, border: "1px solid " + t.accentBdr, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, animation: "fadeUp .45s ease .2s both" }}>
                <div style={{ fontSize: 13.5, color: safeDark ? "#93c5fd" : "#1d4ed8", fontWeight: 600 }}>
                  {safeLang === "fr" ? "Vous avez apprécié cet article ?" : "Did you enjoy this article?"}
                </div>
                <button onClick={onBack} className="bd-back" style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", color: safeDark ? "#60a5fa" : "#2563eb", border: "1.5px solid " + t.accentBdr, borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  <IcoArrowL/>
                  {safeLang === "fr" ? "Voir tous les articles" : "See all articles"}
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}