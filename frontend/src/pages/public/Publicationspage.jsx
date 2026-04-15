// src/pages/public/PublicationsPage.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme }   from "../../constants/theme";
import { field }      from "../../utils/formatters";
import { Badge }      from "../../components/ui/Badge";

const API = "http://localhost:5000/api";

const CSS = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes pulse  { from{opacity:.35} to{opacity:.75} }
  .pb-row { transition:all .22s cubic-bezier(.4,0,.2,1); }
  .pb-row:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,99,235,.1) !important; border-color:rgba(37,99,235,.4) !important; }
  .pb-btn:hover { background:linear-gradient(135deg,#1e3a8a,#2563eb) !important; color:#fff !important; border-color:transparent !important; box-shadow:0 4px 14px rgba(37,99,235,.4) !important; }
  .pb-back:hover { border-color:#2563eb !important; color:#2563eb !important; }
  .pb-back,.pb-btn { transition:all .18s cubic-bezier(.4,0,.2,1); }
  * { box-sizing:border-box; }
`;

const ArrowLeft  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const ArrowRight = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonRow({ t }) {
  const bar = (w, h = 14) => ({
    width: w, height: h, borderRadius: 8,
    background: `linear-gradient(90deg,${t.skA} 25%,${t.skB} 50%,${t.skA} 75%)`,
    backgroundSize: "400px 100%",
    animation: "pulse .9s ease-in-out infinite alternate",
  });
  return (
    <div style={{ borderRadius: 16, padding: "22px 24px", border: `1px solid ${t.border}`, background: t.bgCard, display: "flex", justifyContent: "space-between", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...bar("75%", 18), marginBottom: 10 }} />
        <div style={{ ...bar("45%", 13), marginBottom: 14 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <div style={bar(80, 22)} /><div style={bar(100, 22)} />
        </div>
      </div>
      <div style={{ ...bar(52, 52), borderRadius: 12, flexShrink: 0 }} />
    </div>
  );
}

// ── PublicationRow ─────────────────────────────────────────────
function PublicationRow({ pub, dark, lang, t }) {
  const navigate = useNavigate();
  const [hov,    setHov]    = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const id     = pub.id || pub._id;
  const doiUrl = pub.doi ? `https://doi.org/${pub.doi}` : (pub.reference_externe || null);

  return (
    <div
      className="pb-row"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16, padding: "22px 24px",
        border: `1px solid ${t.border}`,
        background: t.bgCard,
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", gap: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
      }}>

      <div style={{ flex: 1 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 15.5, fontWeight: 700, color: t.text, lineHeight: 1.5 }}>
          {field.titre(pub)}
        </h3>

        {field.revue(pub) && (
          <div style={{ fontSize: 13.5, color: "#2563eb", fontWeight: 600, marginBottom: 8, fontStyle: "italic" }}>
            {field.revue(pub)}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
          {field.annee(pub) && (
            <span style={{ fontSize: 12.5, color: t.textMuted }}>{field.annee(pub)}</span>
          )}
          {field.auteurs(pub) && (
            <span style={{ fontSize: 12, color: t.textMuted }}>{field.auteurs(pub)}</span>
          )}
          {pub.type_publication && (
            <Badge label={pub.type_publication} color="blue" dark={dark}/>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            className="pb-btn"
            onClick={() => id && navigate(`/publications/${id}`)}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            disabled={!id}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: dark ? "rgba(37,99,235,.14)" : "rgba(37,99,235,.08)",
              color: "#2563eb",
              border: `1.5px solid ${dark ? "rgba(37,99,235,.28)" : "rgba(37,99,235,.16)"}`,
              borderRadius: 9, padding: "7px 16px",
              fontSize: 12.5, fontWeight: 700,
              cursor: id ? "pointer" : "not-allowed",
            }}>
            {lang === "fr" ? "Voir détails" : "View details"} <ArrowRight/>
          </button>

          {doiUrl && (
            <a href={doiUrl} target="_blank" rel="noreferrer"
              style={{ fontSize: 12.5, fontWeight: 600, color: t.textMuted, textDecoration: "none", opacity: hov ? 1 : 0.6, transition: "opacity .2s" }}>
              DOI ↗
            </a>
          )}
        </div>
      </div>

      {/* Year badge */}
      {field.annee(pub) && (
        <div style={{
          flexShrink: 0, minWidth: 52, height: 52, borderRadius: 12,
          background: dark ? "rgba(37,99,235,.14)" : "rgba(37,99,235,.08)",
          border: `1px solid ${dark ? "rgba(37,99,235,.28)" : "rgba(37,99,235,.16)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800,
          color: dark ? "#60a5fa" : "#1d4ed8",
        }}>
          {field.annee(pub)}
        </div>
      )}
    </div>
  );
}

// ── usePublications ───────────────────────────────────────────
function usePublications() {
  const [publications, setPublications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [tick,         setTick]         = useState(0);
  const retry = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    fetch(`${API}/publications`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        if (!cancelled) {
          const list = json.publications ?? json.data ?? (Array.isArray(json) ? json : []);
          setPublications(list);
          setLoading(false);
        }
      })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [tick]);

  return { publications, loading, error, retry };
}

// ══════════════════════════════════════════════════════════════
// PublicationsPage
// ══════════════════════════════════════════════════════════════
export default function PublicationsPage({ dark = false, lang = "fr" }) {
  const navigate = useNavigate();
  const t = {
    ...getTheme(dark),
    skA: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
    skB: dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.09)",
  };

  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [anneeFilter,setAnneeFilter]= useState("Toutes");
  const [sortDir,    setSortDir]    = useState("desc"); // desc = plus récent en premier

  const { publications, loading, error, retry } = usePublications();

  // ── Options ───────────────────────────────────────────────
  const types = useMemo(() => [
    "Tous",
    ...[...new Set(publications.map(p => p.type_publication).filter(Boolean))].sort(),
  ], [publications]);

  const annees = useMemo(() => {
    const set = new Set(publications.map(p => field.annee(p)).filter(Boolean));
    return ["Toutes", ...[...set].sort((a, b) => b - a)];
  }, [publications]);

  // ── Filtered + sorted ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...publications];
    if (typeFilter !== "Tous")
      list = list.filter(p => p.type_publication === typeFilter);
    if (anneeFilter !== "Toutes")
      list = list.filter(p => String(field.annee(p)) === String(anneeFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (field.titre(p) || "").toLowerCase().includes(q) ||
        (field.revue(p) || "").toLowerCase().includes(q) ||
        (field.auteurs(p) || "").toLowerCase().includes(q)
      );
    }
    // Sort by year
    list.sort((a, b) => {
      const ya = Number(field.annee(a)) || 0;
      const yb = Number(field.annee(b)) || 0;
      return sortDir === "desc" ? yb - ya : ya - yb;
    });
    return list;
  }, [publications, typeFilter, anneeFilter, search, sortDir]);

  const hasFilters = typeFilter !== "Tous" || anneeFilter !== "Toutes" || search.trim();
  const reset = () => { setTypeFilter("Tous"); setAnneeFilter("Toutes"); setSearch(""); };

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
            className="pb-back"
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
            }}>📝</div>
            <h1 style={{
              margin: 0, fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900,
              color: t.text, fontFamily: "'Playfair Display',Georgia,serif",
            }}>
              Publications
            </h1>
          </div>
          <p style={{ margin: "0 0 0 62px", fontSize: 14.5, color: t.textMuted }}>
            {lang === "fr"
              ? "Travaux publiés dans des revues et conférences internationales."
              : "Works published in international journals and conferences."}
          </p>

          {/* Stats */}
          {!loading && !error && (
            <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap", animation: "fadeUp .4s ease both" }}>
              {[
                { label: lang === "fr" ? "Total" : "Total", value: publications.length },
                { label: lang === "fr" ? "Revues" : "Journals",
                  value: publications.filter(p => (p.type_publication||"").toLowerCase().includes("revue") || (p.type_publication||"").toLowerCase().includes("journal")).length },
                { label: lang === "fr" ? "Conférences" : "Conferences",
                  value: publications.filter(p => (p.type_publication||"").toLowerCase().includes("conf")).length },
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
              {lang === "fr" ? "Impossible de charger les publications." : "Unable to load publications."}
            </p>
            <button onClick={retry} style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
              ↻ {lang === "fr" ? "Réessayer" : "Retry"}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} t={t}/>)}
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
                  placeholder={lang === "fr" ? "Rechercher une publication…" : "Search publications…"}
                  style={{
                    width: "100%", padding: "9px 12px 9px 36px",
                    borderRadius: 10, border: `1.5px solid ${t.border}`,
                    background: t.bg, color: t.text, fontSize: 13.5, outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e  => e.target.style.borderColor = t.border}
                />
              </div>

              {/* Type filter */}
              {types.length > 2 && (
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {types.map(tp => (
                    <button key={tp} onClick={() => setTypeFilter(tp)} style={{
                      background:   typeFilter === tp ? "#2563eb" : t.bgCard,
                      color:        typeFilter === tp ? "#fff"    : t.textMuted,
                      border:       `1.5px solid ${typeFilter === tp ? "#2563eb" : t.border}`,
                      borderRadius: 10, padding: "8px 16px",
                      fontWeight:   typeFilter === tp ? 700 : 500,
                      fontSize: 13, cursor: "pointer",
                      boxShadow: typeFilter === tp ? "0 4px 12px rgba(37,99,235,.3)" : "none",
                    }}>{tp}</button>
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
                  padding: "9px 14px", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}>
                {sortDir === "desc" ? "↓" : "↑"} {lang === "fr" ? "Année" : "Year"}
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
              {" "}{lang === "fr" ? `publication${filtered.length !== 1 ? "s" : ""} trouvée${filtered.length !== 1 ? "s" : ""}` : `publication${filtered.length !== 1 ? "s" : ""} found`}
              {hasFilters && publications.length !== filtered.length && (
                <span> {lang === "fr" ? `sur ${publications.length}` : `of ${publications.length}`}</span>
              )}
            </div>

            {/* Empty */}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "72px 24px", background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 50, marginBottom: 16 }}>📭</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: t.text }}>
                  {lang === "fr" ? "Aucune publication trouvée." : "No publications found."}
                </h3>
                <button onClick={reset} style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
                  {lang === "fr" ? "Voir toutes les publications" : "View all publications"}
                </button>
              </div>
            )}

            {/* List */}
            {filtered.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .4s ease both" }}>
                {filtered.map((p, i) => (
                  <PublicationRow key={p.id || i} pub={p} dark={dark} lang={lang} t={t}/>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}