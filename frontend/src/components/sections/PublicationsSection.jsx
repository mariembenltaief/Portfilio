import { useState }      from "react";
import { useNavigate }   from "react-router-dom";
import { getTheme }      from "../../constants/theme";
import { field }         from "../../utils/formatters";
import { SectionHeader } from "../ui/SectionHeader";
import { Badge }         from "../ui/Badge";
import { Icons }         from "../ui/Icons";

const ArrowRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

function PublicationRow({ pub, dark, lang, t }) {
  const navigate = useNavigate();
  const [hov, setHov]       = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const id     = pub.id || pub._id;
  const doiUrl = pub.doi ? ("https://doi.org/" + pub.doi) : (pub.reference_externe || null);

  const btnBg     = btnHov ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : (dark ? "rgba(37,99,235,.14)" : "rgba(37,99,235,.08)");
  const btnColor  = btnHov ? "#fff" : "#2563eb";
  const btnBorder = "1.5px solid " + (btnHov ? "transparent" : (dark ? "rgba(37,99,235,.28)" : "rgba(37,99,235,.16)"));
  const btnShadow = btnHov ? "0 4px 14px rgba(37,99,235,.4)" : "none";
  const rowBorder = "1px solid " + (hov ? t.accent : t.border);
  const rowShadow = hov ? "0 8px 28px rgba(37,99,235,.1)" : "none";
  const rowMove   = hov ? "translateY(-2px)" : "none";
  const yearBg    = dark ? "rgba(37,99,235,.14)" : "rgba(37,99,235,.08)";
  const yearBdr   = "1px solid " + (dark ? "rgba(37,99,235,.28)" : "rgba(37,99,235,.16)");
  const yearColor = dark ? "#60a5fa" : "#1d4ed8";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16,
        padding: "22px 24px",
        border: rowBorder,
        background: t.bgCard,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        transition: "all .22s",
        boxShadow: rowShadow,
        transform: rowMove,
      }}>

      <div style={{ flex: 1 }}>

        <h3 style={{ margin: "0 0 8px", fontSize: 15.5, fontWeight: 700, color: t.text, lineHeight: 1.5 }}>
          {field.titre(pub)}
        </h3>

        {field.revue(pub) && (
          <div style={{ fontSize: 13.5, color: t.accent, fontWeight: 600, marginBottom: 8, fontStyle: "italic" }}>
            {field.revue(pub)}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
          {field.annee(pub) && (
            <span style={{ fontSize: 12.5, color: t.textMuted }}>
              {field.annee(pub)}
            </span>
          )}
          {field.auteurs(pub) && (
            <span style={{ fontSize: 12, color: t.textMuted }}>
              {field.auteurs(pub)}
            </span>
          )}
          {pub.type_publication && (
            <Badge label={pub.type_publication} color="blue" dark={dark}/>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

          <button
            onClick={() => { if (id) navigate("/publications/" + id); }}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            disabled={!id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: btnBg,
              color: btnColor,
              border: btnBorder,
              borderRadius: 9,
              padding: "7px 16px",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: id ? "pointer" : "not-allowed",
              boxShadow: btnShadow,
              transition: "all .2s",
            }}>
            {lang === "fr" ? "Voir détails" : "View details"}
            <ArrowRight/>
          </button>

          {doiUrl && <a href={doiUrl} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, fontWeight:600, color:t.textMuted, textDecoration:"none", opacity:hov?1:0.6, transition:"opacity .2s" }}>DOI ↗</a>}

        </div>
      </div>

      {field.annee(pub) && (
        <div style={{
          flexShrink: 0,
          minWidth: 52,
          height: 52,
          borderRadius: 12,
          background: yearBg,
          border: yearBdr,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 800,
          color: yearColor,
        }}>
          {field.annee(pub)}
        </div>
      )}

    </div>
  );
}

export function PublicationsSection({ publications, dark, lang }) {
  const t = getTheme(dark);

  if (!publications || publications.length === 0) return null;

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
          {publications.map((p, i) => (
            <PublicationRow key={p.id || i} pub={p} dark={dark} lang={lang} t={t}/>
          ))}
        </div>

      </div>
    </section>
  );
}