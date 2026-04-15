// src/components/sections/PublicationsSection.jsx
import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import { getTheme }    from "../../constants/theme";
import { field }       from "../../utils/formatters";
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

function PublicationRow({ pub, dark, lang, t }) {
  const navigate = useNavigate();
  const [hov,    setHov]    = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const id     = pub.id || pub._id;
  const doiUrl = pub.doi ? `https://doi.org/${pub.doi}` : (pub.reference_externe || null);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16, padding: "22px 24px",
        border: `1px solid ${hov ? "#2563eb" : t.border}`,
        background: t.bgCard,
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", gap: 16,
        transition: "all .22s",
        boxShadow: hov ? "0 8px 28px rgba(37,99,235,.1)" : "none",
        transform: hov ? "translateY(-2px)" : "none",
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
          {field.annee(pub) && <span style={{ fontSize: 12.5, color: t.textMuted }}>{field.annee(pub)}</span>}
          {field.auteurs(pub) && <span style={{ fontSize: 12, color: t.textMuted }}>{field.auteurs(pub)}</span>}
          {pub.type_publication && <Badge label={pub.type_publication} color="blue" dark={dark}/>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => id && navigate(`/publications/${id}`)}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            disabled={!id}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: btnHov ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : (dark ? "rgba(37,99,235,.14)" : "rgba(37,99,235,.08)"),
              color: btnHov ? "#fff" : "#2563eb",
              border: `1.5px solid ${btnHov ? "transparent" : (dark ? "rgba(37,99,235,.28)" : "rgba(37,99,235,.16)")}`,
              borderRadius: 9, padding: "7px 16px",
              fontSize: 12.5, fontWeight: 700,
              cursor: id ? "pointer" : "not-allowed",
              boxShadow: btnHov ? "0 4px 14px rgba(37,99,235,.4)" : "none",
              transition: "all .2s",
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

export function PublicationsSection({ publications, dark, lang }) {
  const navigate = useNavigate();
  const t = getTheme(dark);
  const [btnHov, setBtnHov] = useState(false);

  if (!publications || publications.length === 0) return null;

  const visible = publications.slice(0, MAX_HOME);

  return (
    <section id="publications" style={{ padding: "96px 2rem", background: t.bg }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        <SectionHeader
          iconFn={Icons.file}
          title="Publications"
          subtitle={lang === "fr"
            ? "Travaux publiés dans des revues et conférences internationales."
            : "Works published in international journals and conferences."}
          dark={dark}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {visible.map((p, i) => (
            <PublicationRow key={p.id || i} pub={p} dark={dark} lang={lang} t={t}/>
          ))}
        </div>

        {/* ── Voir toutes button ── */}
        {publications.length > MAX_HOME && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <button
              onClick={() => navigate("/publications")}
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
              📝 {lang === "fr" ? `Voir toutes les publications (${publications.length})` : `View all publications (${publications.length})`}
              <ArrowRight/>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}