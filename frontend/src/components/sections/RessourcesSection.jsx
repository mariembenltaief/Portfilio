import { useState }        from "react";
import { useNavigate }     from "react-router-dom";
import { getTheme }        from "../../constants/theme";
import { field }           from "../../utils/formatters";
import { SectionHeader }   from "../ui/SectionHeader";
import { Badge, TypeBadge } from "../ui/Badge";
import { Icons }           from "../ui/Icons";

const ArrowRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

function RessourceCard({ cours: c, dark, lang, t }) {
  const navigate = useNavigate();
  const [hov,    setHov]    = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const id          = c.id || c._id;
  const rowBorder   = "1px solid " + (hov ? t.accent : t.border);
  const rowShadow   = hov ? "0 10px 28px rgba(37,99,235,.1)" : "none";
  const rowMove     = hov ? "translateY(-3px)" : "none";
  const iconBoxBdr  = "1px solid " + t.accentBdr;
  const iconColor   = dark ? "#60a5fa" : "#1e3a8a";
  const btnBg       = btnHov ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : t.accentDim;
  const btnColor    = btnHov ? "#fff" : "#2563eb";
  const btnBorder   = "1.5px solid " + (btnHov ? "transparent" : t.accentBdr);
  const btnShadow   = btnHov ? "0 4px 14px rgba(37,99,235,.4)" : "none";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16,
        padding: "18px 20px",
        border: rowBorder,
        background: t.bgCard,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "all .2s",
        transform: rowMove,
        boxShadow: rowShadow,
      }}>

      {/* Top row — icon + info */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: t.accentDim, border: iconBoxBdr, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {Icons.file(22, iconColor)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 6, lineHeight: 1.3 }}>
            {field.titre(c)}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {field.type(c)  && <TypeBadge type={field.type(c)}/>}
            {c.niveau       && <Badge label={c.niveau}        dark={dark}/>}
            {field.annee(c) && <Badge label={field.annee(c)}  dark={dark}/>}
          </div>
        </div>
      </div>

      {/* Voir détails button */}
      <button
        onClick={() => { if (id) navigate("/cours/" + id); }}
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
          borderRadius: 9,
          padding: "7px 16px",
          fontSize: 12.5,
          fontWeight: 700,
          cursor: id ? "pointer" : "not-allowed",
          boxShadow: btnShadow,
          transition: "all .2s",
        }}>
        {lang === "fr" ? "Voir le cours" : "View course"}
        <ArrowRight/>
      </button>
    </div>
  );
}

export function RessourcesSection({ cours, dark, lang }) {
  const t = getTheme(dark);

  if (!cours || cours.length === 0) return null;

  return (
    <section id="ressources" style={{ padding: "96px 2rem", background: t.bgSection ?? t.bg }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        <SectionHeader
          iconFn={Icons.file}
          title={lang === "fr" ? "Ressources" : "Resources"}
          subtitle={lang === "fr"
            ? "Supports de cours disponibles par matière."
            : "Course materials available by subject."}
          dark={dark}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 16 }}>
          {cours.map((c, i) => (
            <RessourceCard key={c.id || i} cours={c} dark={dark} lang={lang} t={t}/>
          ))}
        </div>

      </div>
    </section>
  );
}