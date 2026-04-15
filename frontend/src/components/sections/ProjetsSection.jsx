// src/components/sections/ProjetsSection.jsx
import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import { getTheme }    from "../../constants/theme";
import { field }       from "../../utils/formatters";
import { SectionHeader } from "../ui/SectionHeader";
import { Badge }       from "../ui/Badge";
import { Icons }       from "../ui/Icons";

const MAX_HOME = 3; // nombre de projets affichés sur la home

const ArrowRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

function ProjetCard({ projet: p, dark, lang, t }) {
  const navigate = useNavigate();
  const [hov,    setHov]    = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const id = p.id || p._id;

  const STATUS_COLOR = {
    actif:      { bg: "#059669", text: "#fff" },
    terminé:    { bg: "#64748b", text: "#fff" },
    "en cours": { bg: "#0891b2", text: "#fff" },
  };
  const sc = STATUS_COLOR[(p.statut || "").toLowerCase()] ?? { bg: "#64748b", text: "#fff" };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, padding: 24,
        border: `1px solid ${hov ? "#059669" : t.border}`,
        background: t.bgCard,
        display: "flex", flexDirection: "column",
        transition: "transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s, border-color .2s",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 18px 44px rgba(5,150,105,.13)" : "0 1px 4px rgba(0,0,0,.05)",
        position: "relative", overflow: "hidden",
      }}>

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: hov ? "linear-gradient(90deg,#059669,#10b981)" : "transparent",
        transition: "background .25s", borderRadius: "18px 18px 0 0",
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

      <h3 style={{
        margin: "0 0 10px", fontSize: 16, fontWeight: 700,
        color: t.text, lineHeight: 1.45,
        fontFamily: "'Playfair Display',Georgia,serif",
      }}>
        {field.titre(p)}
      </h3>

      {field.desc(p) && (
        <p style={{
          margin: "0 0 14px", fontSize: 13, color: t.textMuted, lineHeight: 1.65,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 3, WebkitBoxOrient: "vertical", flex: 1,
        }}>
          {field.desc(p)}
        </p>
      )}

      {(p.date_debut || p.date_fin) && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, fontSize: 12, color: t.textMuted }}>
          📅
          {p.date_debut && <span>{new Date(p.date_debut).getFullYear()}</span>}
          {p.date_debut && p.date_fin && <span>→</span>}
          {p.date_fin   && <span>{new Date(p.date_fin).getFullYear()}</span>}
        </div>
      )}

      <button
        onClick={() => id && navigate(`/projets/${id}`)}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        disabled={!id}
        style={{
          alignSelf: "flex-start",
          display: "flex", alignItems: "center", gap: 7,
          background: btnHov ? "linear-gradient(135deg,#065f46,#059669)" : (dark ? "rgba(5,150,105,.14)" : "rgba(5,150,105,.08)"),
          color: btnHov ? "#fff" : "#059669",
          border: `1.5px solid ${btnHov ? "transparent" : (dark ? "rgba(5,150,105,.28)" : "rgba(5,150,105,.2)")}`,
          borderRadius: 10, padding: "9px 18px",
          fontSize: 13, fontWeight: 700,
          cursor: id ? "pointer" : "not-allowed",
          boxShadow: btnHov ? "0 4px 16px rgba(5,150,105,.4)" : "none",
          transition: "all .2s",
        }}>
        {lang === "fr" ? "Voir détails" : "View details"} <ArrowRight/>
      </button>
    </div>
  );
}

export function ProjetsSection({ projets, dark, lang }) {
  const navigate = useNavigate();
  const t = getTheme(dark);
  const [btnHov, setBtnHov] = useState(false);

  if (!projets || projets.length === 0) return null;

  const visible = projets.slice(0, MAX_HOME);

  return (
    <section id="projets" style={{ padding: "96px 2rem", background: t.bgSection ?? t.bg }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <SectionHeader
          iconFn={Icons.flask}
          title={lang === "fr" ? "Projets de Recherche" : "Research Projects"}
          subtitle={lang === "fr"
            ? "Projets actifs et passés en recherche scientifique."
            : "Active and past scientific research projects."}
          dark={dark}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {visible.map((p, i) => (
            <ProjetCard key={p.id || i} projet={p} dark={dark} lang={lang} t={t}/>
          ))}
        </div>

        {/* ── Voir tous button ── */}
        {projets.length > MAX_HOME && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <button
              onClick={() => navigate("/projets")}
              onMouseEnter={() => setBtnHov(true)}
              onMouseLeave={() => setBtnHov(false)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: btnHov ? "linear-gradient(135deg,#065f46,#059669)" : "transparent",
                color: btnHov ? "#fff" : "#059669",
                border: `1.5px solid ${btnHov ? "transparent" : (dark ? "rgba(5,150,105,.4)" : "rgba(5,150,105,.3)")}`,
                borderRadius: 12, padding: "12px 28px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: btnHov ? "0 4px 20px rgba(5,150,105,.4)" : "none",
                transition: "all .2s",
              }}>
              🔬 {lang === "fr" ? `Voir tous les projets (${projets.length})` : `View all projects (${projets.length})`}
              <ArrowRight/>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}