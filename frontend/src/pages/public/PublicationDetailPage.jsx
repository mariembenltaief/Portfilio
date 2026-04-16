// src/pages/public/PublicationDetailPage.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTheme } from "../../constants/theme";
import { field } from "../../utils/formatters";

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

// Icônes
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

const IcoUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IcoJournal = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M4 4h16v16H4z"/>
    <line x1="8" y1="8" x2="16" y2="8"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="8" y1="16" x2="12" y2="16"/>
  </svg>
);

const IcoDoi = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IcoCopy = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const IcoShare = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const IcoClock = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IcoRetry = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

// ──────────────────────────────
// Utils
// ──────────────────────────────
const estimateReadingTime = (text = "") => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const copyText = async (text, lang) => {
  try {
    await navigator.clipboard.writeText(text);
    alert(lang === "fr" ? "Copié !" : "Copied!");
  } catch {
    alert(lang === "fr" ? "Échec de la copie" : "Copy failed");
  }
};

// ──────────────────────────────
// Composants UI
// ──────────────────────────────
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

// ──────────────────────────────
// Hook
// ──────────────────────────────
function usePublication(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const retry = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID manquant");
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/publications/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(res.status === 404 ? "Publication non trouvée" : "HTTP " + res.status);

        const json = await res.json();
        const pub = json.data || json.publication || json.article || json;

        if (!pub) throw new Error("Données invalides");
        setData(pub);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    load();
    return () => controller.abort();
  }, [id, tick]);

  return { data, loading, error, retry };
}

// ──────────────────────────────
// Page Principale
// ──────────────────────────────
export default function PublicationDetailPage({ dark = false, lang = "fr" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = tk(dark);
  const safeDark = dark ?? false;
  const safeLang = lang ?? "fr";

  const { data, loading, error, retry } = usePublication(id);
  const onBack = () => navigate("/publications");

  const content = data?.contenu || "";
  const readingTime = useMemo(() => estimateReadingTime(content), [content]);
  const doi = data?.doi ? `https://doi.org/${data.doi}` : null;

  const citation = useMemo(() => {
    const auteurs = field.auteurs(data) || "Auteur inconnu";
    const annee = field.annee(data) || "s.d.";
    const titre = field.titre(data) || "Sans titre";
    return `${auteurs} (${annee}). ${titre}.`;
  }, [data]);

  const paragraphs = useMemo(() => {
    if (!content) return [];
    if (content.split(/\n\n+/).filter(Boolean).length > 1) {
      return content.split(/\n\n+/).filter(Boolean);
    }
    if (content.split(/\n/).filter(Boolean).length > 1) {
      return content.split(/\n/).filter(Boolean);
    }
    return [content];
  }, [content]);

  // Récupérer les mots-clés directement depuis l'objet data
  const keywords = data?.motsCles || data?.mots_cles || data?.keywords || null;

  const borderCard = "1px solid " + t.border;
  const accentChipBdr = "1px solid " + t.accentBdr;
  const badgeAccColor = safeDark ? "#93c5fd" : "#1d4ed8";
  const iconColor = safeDark ? "#60a5fa" : "#2563eb";

  // ──────────────────────────────
  // Rendu
  // ──────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: t.bg }}>
        <Skeleton t={t} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: "100vh", background: t.bg }}>
        <div style={{ maxWidth: 520, margin: "80px auto", padding: "0 2rem", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>⚠️</div>
          <h2 style={{ margin: "0 0 10px", color: t.text, fontSize: 22, fontWeight: 800 }}>
            {safeLang === "fr" ? "Publication introuvable" : "Publication not found"}
          </h2>
          <p style={{ margin: "0 0 24px", color: t.textMuted, fontSize: 14 }}>{error || "ID invalide"}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={retry} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              <IcoRetry/> {safeLang === "fr" ? "Réessayer" : "Retry"}
            </button>
            <button className="bd-back" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", color: t.textMuted, border: "1.5px solid " + t.border, borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <IcoArrowL/> {safeLang === "fr" ? "Retour" : "Back"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif" }}>
      <style>{CSS}</style>

      {/* Hero */}
      <div style={{ background: t.bgHero, borderBottom: borderCard, padding: "56px 2rem 40px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          <button className="bd-back" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", border: "1.5px solid " + t.border, borderRadius: 10, padding: "8px 16px", fontSize: 13.5, fontWeight: 600, color: t.textMuted, cursor: "pointer", marginBottom: 24 }}>
            <IcoArrowL/>
            {safeLang === "fr" ? "Retour aux publications" : "Back to publications"}
          </button>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {data.type_publication && (
              <span style={{ background: t.accentDim, color: badgeAccColor, border: accentChipBdr, fontSize: 12.5, fontWeight: 800, borderRadius: 8, padding: "5px 14px" }}>
                {data.type_publication}
              </span>
            )}
            {field.annee(data) && (
              <span style={{ background: "rgba(100,116,139,.1)", color: t.textMuted, border: "1px solid rgba(100,116,139,.2)", fontSize: 12, fontWeight: 600, borderRadius: 8, padding: "5px 14px", display: "flex", alignItems: "center", gap: 5 }}>
                <IcoCalendar/> {field.annee(data)}
              </span>
            )}
            {readingTime && (
              <span style={{ background: "rgba(100,116,139,.1)", color: t.textMuted, border: "1px solid rgba(100,116,139,.2)", fontSize: 12, fontWeight: 600, borderRadius: 8, padding: "5px 14px", display: "flex", alignItems: "center", gap: 5 }}>
                <IcoClock/> {readingTime} min
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ margin: 0, fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: t.text, lineHeight: 1.25, letterSpacing: -0.5, fontFamily: "'Playfair Display',Georgia,serif", animation: "fadeUp .45s ease both" }}>
            {field.titre(data)}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 2rem 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Info chips */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, animation: "fadeUp .45s ease .06s both" }}>
            {field.auteurs(data) && (
              <InfoChip icon={<IcoUser/>} label={safeLang === "fr" ? "Auteurs" : "Authors"} value={field.auteurs(data)} t={t} dark={safeDark}/>
            )}
            {field.revue(data) && (
              <InfoChip icon={<IcoJournal/>} label={safeLang === "fr" ? "Revue/Conférence" : "Journal/Conference"} value={field.revue(data)} t={t} dark={safeDark}/>
            )}
            {data.doi && (
              <InfoChip icon={<IcoDoi/>} label="DOI" value={data.doi} t={t} dark={safeDark}/>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", animation: "fadeUp .45s ease .09s both" }}>
            {doi && (
              <a href={doi} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "10px 20px", fontSize: 13.5, fontWeight: 700,
                textDecoration: "none", cursor: "pointer"
              }}>
                🔗 {safeLang === "fr" ? "Accéder à l'article" : "Access article"}
              </a>
            )}
            <button onClick={() => copyText(citation, safeLang)} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: t.bgCard, color: t.text, border: "1.5px solid " + t.border,
              borderRadius: 10, padding: "10px 20px", fontSize: 13.5, fontWeight: 600,
              cursor: "pointer"
            }}>
              <IcoCopy/> {safeLang === "fr" ? "Copier la citation" : "Copy citation"}
            </button>
            <button onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: field.titre(data),
                  text: citation,
                  url: window.location.href,
                });
              } else {
                copyText(window.location.href, safeLang);
              }
            }} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: t.bgCard, color: t.text, border: "1.5px solid " + t.border,
              borderRadius: 10, padding: "10px 20px", fontSize: 13.5, fontWeight: 600,
              cursor: "pointer"
            }}>
              <IcoShare/> {safeLang === "fr" ? "Partager" : "Share"}
            </button>
          </div>

          {/* Content */}
          {content && (
            <div style={{ borderRadius: 18, padding: "32px 36px", background: t.bgCard, border: borderCard, animation: "fadeUp .45s ease .12s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: borderCard }}>
                <span style={{ color: iconColor }}>📄</span>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.text, fontFamily: "'Playfair Display',Georgia,serif" }}>
                  {safeLang === "fr" ? "Résumé / Contenu" : "Abstract / Content"}
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {paragraphs.map((para, i) => (
                  <p key={i} style={{ margin: 0, fontSize: 15.5, color: t.textMuted, lineHeight: 1.9, textAlign: "justify" }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Mots-clés - sans utiliser field.motsCles */}
          {keywords && (
            <div style={{ borderRadius: 14, padding: "18px 22px", background: t.accentDim, border: "1px solid " + t.accentBdr, animation: "fadeUp .45s ease .15s both" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                {safeLang === "fr" ? "Mots-clés" : "Keywords"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {keywords.split(/[;,]/).map((kw, i) => (
                  <span key={i} style={{
                    background: safeDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)",
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, color: t.text,
                  }}>
                    {kw.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer / Citation */}
          <div style={{ borderRadius: 14, padding: "18px 22px", background: t.accentDim, border: "1px solid " + t.accentBdr, animation: "fadeUp .45s ease .2s both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              {safeLang === "fr" ? "Citation recommandée" : "Recommended citation"}
            </div>
            <div style={{ fontSize: 13.5, color: t.text, lineHeight: 1.6 }}>
              {citation}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}