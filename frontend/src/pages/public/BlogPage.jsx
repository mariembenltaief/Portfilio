// src/pages/public/BlogPage.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme }   from "../../constants/theme";
import { formatDate } from "../../utils/formatters";
import { Badge }      from "../../components/ui/Badge";
import { Icons }      from "../../components/ui/Icons";

const API = "http://localhost:5000/api";

const CSS = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes pulse  { from{opacity:.35} to{opacity:.75} }
  .bl-card { transition:transform .25s cubic-bezier(.4,0,.2,1),box-shadow .25s,border-color .2s; }
  .bl-card:hover { transform:translateY(-5px); box-shadow:0 18px 44px rgba(37,99,235,.13) !important; border-color:#2563eb !important; }
  .bl-btn:hover  { background:linear-gradient(135deg,#1e3a8a,#2563eb) !important; color:#fff !important; border-color:transparent !important; box-shadow:0 4px 16px rgba(37,99,235,.4) !important; }
  .bl-back:hover { border-color:#2563eb !important; color:#2563eb !important; }
  .bl-back,.bl-btn { transition:all .18s cubic-bezier(.4,0,.2,1); }
  * { box-sizing:border-box; }
`;

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
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={bar(70, 22)} /><div style={bar(50, 22)} />
      </div>
      <div style={{ ...bar("85%", 18), marginBottom: 10 }} />
      <div style={{ ...bar("100%"), marginBottom: 6 }} />
      <div style={{ ...bar("75%"), marginBottom: 18 }} />
      <div style={{ ...bar(60, 12), marginBottom: 20 }} />
      <div style={bar(130, 36)} />
    </div>
  );
}

// ── ArticleCard ───────────────────────────────────────────────
function ArticleCard({ article: a, dark, lang, t }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);

  const id     = a.id || a._id;
  const titre  = a.titre || a.title || "—";
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const annee  = a.date_publication ? new Date(a.date_publication).getFullYear() : null;

  return (
    <div
      className="bl-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, padding: 24,
        border: `1px solid ${t.border}`,
        background: t.bgCard,
        display: "flex", flexDirection: "column", gap: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
        position: "relative", overflow: "hidden",
      }}>

      {/* Accent top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: hov ? "linear-gradient(90deg,#1e3a8a,#3b82f6)" : "transparent",
        transition: "background .25s", borderRadius: "18px 18px 0 0",
      }}/>

      {/* Badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {a.categorie && <Badge label={a.categorie} color="blue" dark={dark}/>}
        {a.langue    && <Badge label={a.langue.toUpperCase()} dark={dark}/>}
      </div>

      {/* Title */}
      <h3 style={{
        margin: 0, fontSize: 16.5, fontWeight: 700, color: t.text,
        lineHeight: 1.45, fontFamily: "'Playfair Display',Georgia,serif",
      }}>
        {titre}
      </h3>

      {/* Excerpt */}
      {a.contenu && (
        <p style={{
          margin: 0, fontSize: 13.5, color: t.textMuted, lineHeight: 1.7,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 3, WebkitBoxOrient: "vertical", flex: 1,
        }}>
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

      {/* Button */}
      <button
        className="bl-btn"
        onClick={() => id && navigate(`/blog/${id}`)}
        disabled={!id}
        style={{
          alignSelf: "flex-start",
          display: "flex", alignItems: "center", gap: 7,
          background: dark ? "rgba(37,99,235,.14)" : "rgba(37,99,235,.08)",
          color: "#2563eb",
          border: `1.5px solid ${dark ? "rgba(37,99,235,.28)" : "rgba(37,99,235,.16)"}`,
          borderRadius: 10, padding: "9px 18px",
          fontSize: 13, fontWeight: 700,
          cursor: id ? "pointer" : "not-allowed",
          marginTop: "auto",
        }}>
        {lang === "fr" ? "Lire l'article" : "Read article"} <ArrowRight/>
      </button>
    </div>
  );
}

// ── useBlog ───────────────────────────────────────────────────
function useBlog() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tick,     setTick]     = useState(0);
  const retry = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    fetch(`${API}/articles-blog`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        if (!cancelled) {
          // Handle all possible response shapes
          const list =
            json.blogPosts
            ?? json.articles
            ?? json.articlesBlog
            ?? json.blogPost
            ?? json.data
            ?? (Array.isArray(json) ? json : []);
          setArticles(Array.isArray(list) ? list : [list]);
          setLoading(false);
        }
      })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [tick]);

  return { articles, loading, error, retry };
}

// ══════════════════════════════════════════════════════════════
// BlogPage
// ══════════════════════════════════════════════════════════════
export default function BlogPage({ dark = false, lang = "fr" }) {
  const navigate = useNavigate();
  const t = {
    ...getTheme(dark),
    skA: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
    skB: dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.09)",
  };

  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("Tous");
  const [anneeFilter, setAnneeFilter] = useState("Toutes");
  const [sortDir,     setSortDir]     = useState("desc");

  const { articles, loading, error, retry } = useBlog();

  // ── Options ───────────────────────────────────────────────
  const categories = useMemo(() => [
    "Tous",
    ...[...new Set(articles.map(a => a.categorie).filter(Boolean))].sort(),
  ], [articles]);

  const annees = useMemo(() => {
    const set = new Set(
      articles.map(a => a.date_publication ? new Date(a.date_publication).getFullYear() : null).filter(Boolean)
    );
    return ["Toutes", ...[...set].sort((a, b) => b - a)];
  }, [articles]);

  // ── Filtered + sorted ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...articles];
    if (catFilter !== "Tous")
      list = list.filter(a => a.categorie === catFilter);
    if (anneeFilter !== "Toutes")
      list = list.filter(a => a.date_publication && new Date(a.date_publication).getFullYear() === Number(anneeFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        (a.titre || a.title || "").toLowerCase().includes(q) ||
        (a.contenu || "").toLowerCase().includes(q) ||
        (a.categorie || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const da = new Date(a.date_publication || 0).getTime();
      const db = new Date(b.date_publication || 0).getTime();
      return sortDir === "desc" ? db - da : da - db;
    });
    return list;
  }, [articles, catFilter, anneeFilter, search, sortDir]);

  const hasFilters = catFilter !== "Tous" || anneeFilter !== "Toutes" || search.trim();
  const reset = () => { setCatFilter("Tous"); setAnneeFilter("Toutes"); setSearch(""); };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif" }}>
      <style>{CSS}</style>

      {/* ── Hero ── */}
      <div style={{
        background: dark
          ? "linear-gradient(160deg,#0d1829 0%,#111e36 60%,#0b1120 100%)"
          : "linear-gradient(160deg,#eef4ff 0%,#e8f0fe 60%,#f0f5ff 100%)",
        borderBottom: `1px solid ${t.border}`,
        padding: "52px 2rem 40px",
      }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>

          <button
            className="bl-back"
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

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: dark ? "rgba(37,99,235,.15)" : "rgba(37,99,235,.1)",
              border: `1px solid ${dark ? "rgba(37,99,235,.3)" : "rgba(37,99,235,.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>✍️</div>
            <h1 style={{
              margin: 0, fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900,
              color: t.text, fontFamily: "'Playfair Display',Georgia,serif",
            }}>Blog</h1>
          </div>
          <p style={{ margin: "0 0 0 62px", fontSize: 14.5, color: t.textMuted }}>
            {lang === "fr"
              ? "Articles et réflexions sur l'enseignement et la recherche."
              : "Articles and thoughts on teaching & research."}
          </p>

          {/* Stats */}
          {!loading && !error && (
            <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap", animation: "fadeUp .4s ease both" }}>
              {[
                { label: lang === "fr" ? "Articles" : "Articles", value: articles.length },
                { label: lang === "fr" ? "Catégories" : "Categories", value: categories.length - 1 },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "10px 20px", borderRadius: 12,
                  background: dark ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.7)",
                  border: `1px solid ${t.border}`, textAlign: "center",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#2563eb" }}>{s.value}</div>
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
              {lang === "fr" ? "Impossible de charger les articles." : "Unable to load articles."}
            </p>
            <button onClick={retry} style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
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
                  placeholder={lang === "fr" ? "Rechercher un article…" : "Search articles…"}
                  style={{
                    width: "100%", padding: "9px 12px 9px 36px",
                    borderRadius: 10, border: `1.5px solid ${t.border}`,
                    background: t.bg, color: t.text, fontSize: 13.5, outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e  => e.target.style.borderColor = t.border}
                />
              </div>

              {/* Catégorie filter */}
              {categories.length > 2 && (
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setCatFilter(cat)} style={{
                      background:   catFilter === cat ? "#2563eb" : t.bgCard,
                      color:        catFilter === cat ? "#fff"    : t.textMuted,
                      border:       `1.5px solid ${catFilter === cat ? "#2563eb" : t.border}`,
                      borderRadius: 10, padding: "8px 16px",
                      fontWeight:   catFilter === cat ? 700 : 500,
                      fontSize: 13, cursor: "pointer",
                      boxShadow: catFilter === cat ? "0 4px 12px rgba(37,99,235,.3)" : "none",
                    }}>{cat}</button>
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
                    border: `1.5px solid ${anneeFilter !== "Toutes" ? "#2563eb" : t.border}`,
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

              {/* Sort */}
              <button
                onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: t.bgCard, color: t.textMuted,
                  border: `1.5px solid ${t.border}`, borderRadius: 10,
                  padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                {sortDir === "desc" ? "↓" : "↑"} {lang === "fr" ? "Date" : "Date"}
              </button>

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
              {" "}{lang === "fr" ? `article${filtered.length !== 1 ? "s" : ""} trouvé${filtered.length !== 1 ? "s" : ""}` : `article${filtered.length !== 1 ? "s" : ""} found`}
              {hasFilters && articles.length !== filtered.length && (
                <span> {lang === "fr" ? `sur ${articles.length}` : `of ${articles.length}`}</span>
              )}
            </div>

            {/* Empty */}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "72px 24px", background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 50, marginBottom: 16 }}>📭</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: t.text }}>
                  {lang === "fr" ? "Aucun article trouvé." : "No articles found."}
                </h3>
                <button onClick={reset} style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
                  {lang === "fr" ? "Voir tous les articles" : "View all articles"}
                </button>
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
                gap: 22, animation: "fadeUp .4s ease both",
              }}>
                {filtered.map((a, i) => (
                  <ArticleCard key={a.id || i} article={a} dark={dark} lang={lang} t={t}/>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}