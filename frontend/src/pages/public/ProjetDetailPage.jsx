// pages/public/ProjetDetailPage.jsx

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
  .pd-back:hover  { border-color:#059669 !important; color:#059669 !important; transform:translateX(-3px); }
  .pd-back        { transition:all .18s cubic-bezier(.4,0,.2,1); }
  .pd-lift        { transition:transform .22s, box-shadow .22s, border-color .2s; }
  .pd-lift:hover  { transform:translateY(-3px); box-shadow:0 12px 32px rgba(5,150,105,.12) !important; border-color:rgba(5,150,105,.3) !important; }
  * { box-sizing:border-box; }
`;

const tk = (dark) => ({
  bg:        dark ? "#0b1120"               : "#f7f9fc",
  bgCard:    dark ? "#151f35"               : "#ffffff",
  bgHero:    dark
    ? "linear-gradient(160deg,#0b1f14 0%,#0d1f1a 60%,#0b1120 100%)"
    : "linear-gradient(160deg,#ecfdf5 0%,#d1fae5 40%,#f0fdf4 100%)",
  border:    dark ? "rgba(255,255,255,.07)" : "rgba(15,23,42,.08)",
  text:      dark ? "#e8edf5"               : "#0f172a",
  textMuted: dark ? "#7c8fb5"               : "#64748b",
  greenDim:  dark ? "rgba(5,150,105,.14)"   : "rgba(5,150,105,.08)",
  greenBdr:  dark ? "rgba(5,150,105,.28)"   : "rgba(5,150,105,.2)",
  amberDim:  dark ? "rgba(217,119,6,.14)"   : "rgba(217,119,6,.08)",
  amberBdr:  dark ? "rgba(217,119,6,.28)"   : "rgba(217,119,6,.2)",
  skA:       dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
  skB:       dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.08)",
});

// ── SVG Icons ─────────────────────────────────────────────────
const Ico = {
  arrowL:  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  calendar:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  target:  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  book:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  users:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  retry:   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  check:   <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ── Helpers ───────────────────────────────────────────────────
function parseList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw !== "string") return [];
  const s = raw.trim();
  try { const p = JSON.parse(s); if (Array.isArray(p)) return p.map(String).filter(Boolean); } catch {}
  const lines = s.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  return s ? [s] : [];
}

function formatDate(dateStr, lang) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long" });
  } catch { return dateStr; }
}

// ── Sub-components ────────────────────────────────────────────
function Skeleton({ t }) {
  const shimmer = { background: `linear-gradient(90deg,${t.skA} 25%,${t.skB} 50%,${t.skA} 75%)`, backgroundSize: "600px 100%", animation: "shimmer 1.4s linear infinite", borderRadius: 8 };
  const bar = (w, h = 14, mb = 0) => <div style={{ ...shimmer, width: w, height: h, marginBottom: mb }}/>;
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 2rem" }}>
      <div style={{ marginBottom: 32 }}>{bar(90, 30, 16)}{bar("55%", 24, 12)}{bar("30%", 16)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        {[1,2,3].map(i => <div key={i} style={{ padding: 18, borderRadius: 14, background: t.bgCard, border: `1px solid ${t.border}` }}>{bar("50%",12,8)}{bar("70%",18)}</div>)}
      </div>
      {[1,2].map(i => <div key={i} style={{ padding: 24, borderRadius: 16, background: t.bgCard, border: `1px solid ${t.border}`, marginBottom: 16 }}>{bar("30%",16,14)}{[90,80,70].map((w,j) => <div key={j} style={{...shimmer,width:`${w}%`,height:13,marginBottom:8}}/>)}</div>)}
    </div>
  );
}

function InfoChip({ icon, label, value, t, dark }) {
  return (
    <div className="pd-lift" style={{ padding: "16px 20px", borderRadius: 14, background: t.bgCard, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: t.greenDim, border: `1px solid ${t.greenBdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: dark ? "#34d399" : "#065f46", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{value}</div>
      </div>
    </div>
  );
}

function SectionBlock({ icon, title, t, dark, delay = 0, children }) {
  return (
    <div style={{ borderRadius: 16, padding: "24px 26px", background: t.bgCard, border: `1px solid ${t.border}`, animation: "fadeUp .45s ease both", animationDelay: `${delay}ms` }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: t.text, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Playfair Display',Georgia,serif" }}>
        <span style={{ color: dark ? "#34d399" : "#059669" }}>{icon}</span>{title}
      </h3>
      {children}
    </div>
  );
}

// ── Fetch hook ────────────────────────────────────────────────
function useProjetDetail(id) {
  const [projet,  setProjet]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tick,    setTick]    = useState(0);
  const retry = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    if (!id) { setLoading(false); setError("ID manquant"); return; }
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res  = await fetch(`${API}/projets-recherche/${id}`);
        if (!res.ok) throw new Error(res.status === 404 ? "Projet non trouvé" : `HTTP ${res.status}`);
        const json = await res.json();
        const data = json.project ?? json.projet ?? json.data ?? (json.id ? json : null);
        if (!data) throw new Error("Réponse invalide");
        if (!cancelled) { setProjet(data); setLoading(false); }
      } catch (err) {
        if (!cancelled) { setError(err?.message ?? "Erreur réseau"); setLoading(false); }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, tick]);

  return { projet, loading, error, retry };
}

// ══════════════════════════════════════════════════════════════
// ProjetDetailPage — export default
// ══════════════════════════════════════════════════════════════
export default function ProjetDetailPage({ dark = false, lang = "fr" }) {
  const { id }   = useParams();
  const navigate = useNavigate();
  const t        = tk(dark);

  const { projet, loading, error, retry } = useProjetDetail(id);
  const onBack = () => navigate(-1);

  const titre       = projet?.titre       ?? projet?.title ?? "—";
  const description = projet?.description ?? "";
  const axe         = projet?.axe_recherche ?? "";
  const statut      = projet?.statut      ?? "";
  const dateDebut   = formatDate(projet?.date_debut, lang);
  const dateFin     = formatDate(projet?.date_fin,   lang);
  const membres     = parseList(projet?.membres ?? projet?.equipe);
  const objectifs   = parseList(projet?.objectifs);
  const resultats   = parseList(projet?.resultats ?? projet?.livrables);
  const financement = projet?.financement ?? projet?.budget ?? "";

  const STATUS_COLOR = {
    actif:     { bg: "#059669", text: "#fff" },
    terminé:   { bg: "#64748b", text: "#fff" },
    "en cours":{ bg: "#0891b2", text: "#fff" },
  };
  const sc = STATUS_COLOR[(statut || "").toLowerCase()] ?? { bg: "#64748b", text: "#fff" };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif" }}>
      <style>{CSS}</style>

      {/* Loading */}
      {loading && <Skeleton t={t}/>}

      {/* Error */}
      {!loading && error && (
        <div style={{ maxWidth: 520, margin: "80px auto", padding: "0 2rem", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>⚠️</div>
          <h2 style={{ margin: "0 0 10px", color: t.text, fontSize: 22, fontWeight: 800 }}>
            {lang === "fr" ? "Projet introuvable" : "Project not found"}
          </h2>
          <p style={{ margin: "0 0 24px", color: t.textMuted, fontSize: 14 }}>{error}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={retry} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#065f46,#059669)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {Ico.retry} {lang === "fr" ? "Réessayer" : "Retry"}
            </button>
            <button className="pd-back" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", color: t.textMuted, border: `1.5px solid ${t.border}`, borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {Ico.arrowL} {lang === "fr" ? "Retour" : "Back"}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && projet && (
        <>
          {/* Hero */}
          <div style={{ background: t.bgHero, borderBottom: `1px solid ${t.border}`, padding: "56px 2rem 40px" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <button className="pd-back" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", border: `1.5px solid ${t.border}`, borderRadius: 10, padding: "8px 16px", fontSize: 13.5, fontWeight: 600, color: t.textMuted, cursor: "pointer", marginBottom: 24 }}>
                {Ico.arrowL} {lang === "fr" ? "Retour aux projets" : "Back to projects"}
              </button>

              {/* Badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {axe && (
                  <span style={{ background: t.greenDim, color: dark ? "#34d399" : "#065f46", border: `1px solid ${t.greenBdr}`, fontSize: 12.5, fontWeight: 700, borderRadius: 8, padding: "5px 14px" }}>
                    🔬 {axe}
                  </span>
                )}
                {statut && (
                  <span style={{ background: sc.bg, color: sc.text, fontSize: 12, fontWeight: 800, borderRadius: 8, padding: "5px 14px", letterSpacing: "0.05em" }}>
                    {statut}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ margin: "0 0 16px", fontSize: "clamp(1.7rem,3.5vw,2.6rem)", fontWeight: 900, color: t.text, lineHeight: 1.2, letterSpacing: -0.5, fontFamily: "'Playfair Display',Georgia,serif", animation: "fadeUp .45s ease both" }}>
                {titre}
              </h1>

              {/* Dates inline */}
              {(dateDebut || dateFin) && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.textMuted, fontSize: 14 }}>
                  <span style={{ color: dark ? "#34d399" : "#059669" }}>{Ico.calendar}</span>
                  {dateDebut && <span>{dateDebut}</span>}
                  {dateDebut && dateFin && <span>→</span>}
                  {dateFin   && <span>{dateFin}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 2rem 80px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Info chips */}
              {(dateDebut || dateFin || financement) && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, animation: "fadeUp .45s ease .06s both" }}>
                  {dateDebut   && <InfoChip icon={Ico.calendar} label={lang === "fr" ? "Début" : "Start"}       value={dateDebut}   t={t} dark={dark}/>}
                  {dateFin     && <InfoChip icon={Ico.calendar} label={lang === "fr" ? "Fin" : "End"}           value={dateFin}     t={t} dark={dark}/>}
                  {financement && <InfoChip icon={Ico.target}   label={lang === "fr" ? "Financement" : "Funding"} value={financement} t={t} dark={dark}/>}
                </div>
              )}

              {/* Description */}
              {description && (
                <SectionBlock icon={Ico.book} title={lang === "fr" ? "Description" : "Description"} t={t} dark={dark} delay={100}>
                  <p style={{ margin: 0, fontSize: 15, color: t.textMuted, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{description}</p>
                </SectionBlock>
              )}

              {/* Objectifs */}
              {objectifs.length > 0 && (
                <SectionBlock icon={Ico.target} title={lang === "fr" ? "Objectifs" : "Objectives"} t={t} dark={dark} delay={180}>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {objectifs.map((obj, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ marginTop: 3, flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: t.greenDim, border: `1px solid ${t.greenBdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: dark ? "#34d399" : "#059669" }}>{Ico.check}</span>
                        <span style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.65 }}>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </SectionBlock>
              )}

              {/* Résultats */}
              {resultats.length > 0 && (
                <SectionBlock icon={Ico.target} title={lang === "fr" ? "Résultats / Livrables" : "Results / Deliverables"} t={t} dark={dark} delay={260}>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {resultats.map((r, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ marginTop: 3, flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: t.amberDim, border: `1px solid ${t.amberBdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: dark ? "#fbbf24" : "#b45309" }}>{Ico.check}</span>
                        <span style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.65 }}>{r}</span>
                      </li>
                    ))}
                  </ul>
                </SectionBlock>
              )}

              {/* Membres */}
              {membres.length > 0 && (
                <SectionBlock icon={Ico.users} title={lang === "fr" ? "Équipe / Membres" : "Team / Members"} t={t} dark={dark} delay={340}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {membres.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: t.greenDim, border: `1px solid ${t.greenBdr}` }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#065f46,#059669)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800 }}>
                          {m.trim().charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </SectionBlock>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
}