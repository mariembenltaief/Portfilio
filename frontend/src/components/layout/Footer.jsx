// ─── components/layout/Footer.jsx ────────────────────────────
// Premium footer: logo + nav columns + social links + copyright
// Props: dark, lang, visiteur, socialLinks
// ─────────────────────────────────────────────────────────────

import { NAV_IDS, NAV_LABELS } from "../../constants/nav";
import { getTheme }            from "../../constants/theme";
import { scrollToSection, getInitials } from "../../utils/formatters";
import { Icons }               from "../ui/Icons";

// ── Static footer columns ────────────────────────────────────
const COLUMNS = {
  fr: [
    {
      heading: "Navigation",
      links: [
        { label: "Accueil",       id: "hero" },
        { label: "Cours",         id: "cours" },
        { label: "Projets",       id: "projets" },
        { label: "Publications",  id: "publications" },
      ],
    },
    {
      heading: "Explorer",
      links: [
        { label: "Ressources",  id: "ressources" },
        { label: "À propos",    id: "apropos" },
        { label: "Blog",        id: "blog" },
        { label: "Contact",     id: "contact" },
      ],
    },
  ],
  en: [
    {
      heading: "Navigation",
      links: [
        { label: "Home",         id: "hero" },
        { label: "Courses",      id: "cours" },
        { label: "Projects",     id: "projets" },
        { label: "Publications", id: "publications" },
      ],
    },
    {
      heading: "Explore",
      links: [
        { label: "Resources", id: "ressources" },
        { label: "About",     id: "apropos" },
        { label: "Blog",      id: "blog" },
        { label: "Contact",   id: "contact" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
export default function Footer({ dark, lang = "fr", visiteur, socialLinks = [] }) {
  const t        = getTheme(dark);
  const safeLang = COLUMNS[lang] ? lang : "fr";
  const columns  = COLUMNS[safeLang];
  const year     = new Date().getFullYear();

  const nom      = visiteur?.prenom
    ? `${visiteur.prenom} ${visiteur.nom || ""}`.trim()
    : visiteur?.nom || "Enseignant-Chercheur";
  const initials = getInitials(visiteur);
  const grade    = visiteur?.grade || (lang === "fr" ? "Enseignant-Chercheur" : "Teacher-Researcher");
  const email    = visiteur?.email || null;
  const etab     = visiteur?.etablissement || null;

  // ── Shared micro-styles ─────────────────────────────────────
  const linkStyle = {
    background: "none", border: "none", cursor: "pointer",
    color: t.textMuted, fontSize: 13.5, fontWeight: 500,
    padding: "4px 0", textAlign: "left",
    transition: "color .18s",
    display: "block",
    textDecoration: "none",
  };

  return (
    <footer style={{
      background: dark
        ? "linear-gradient(170deg,#0b1120 0%,#0f1a2e 100%)"
        : "linear-gradient(170deg,#0f172a 0%,#1e3a8a 100%)",
      color: "#fff",
      paddingTop: 64,
    }}>

      {/* ── Main grid ─────────────────────────────────────── */}
      <div style={{
        maxWidth: 1160, margin: "0 auto",
        padding: "0 2rem 56px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 48,
        alignItems: "start",
      }}>

        {/* Brand column */}
        <div style={{ gridColumn: "span 1" }}>
          {/* Logo row */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{
              width:46, height:46, borderRadius:"50%",
              background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:900, fontSize:15,
              boxShadow:"0 4px 16px rgba(37,99,235,.5)",
              flexShrink:0,
            }}>{initials}</div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:"#f1f5f9", lineHeight:1.2 }}>
                {nom}
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, marginTop:2 }}>
                {grade}
              </div>
            </div>
          </div>

          {/* Short tagline */}
          <p style={{ fontSize:13.5, color:"rgba(255,255,255,.5)", lineHeight:1.75, maxWidth:240, margin:"0 0 24px" }}>
            {lang === "fr"
              ? "Plateforme académique — enseignement, recherche et publications."
              : "Academic platform — teaching, research and publications."}
          </p>

          {/* Contact info */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {email && (
              <a href={`mailto:${email}`} style={{ display:"flex", alignItems:"center", gap:8, color:"rgba(255,255,255,.55)", fontSize:13, textDecoration:"none", transition:"color .18s" }}
                onMouseEnter={e => e.currentTarget.style.color="#93c5fd"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,.55)"}>
                {Icons.mail(14,"currentColor")} {email}
              </a>
            )}
            {etab && (
              <div style={{ display:"flex", alignItems:"center", gap:8, color:"rgba(255,255,255,.45)", fontSize:13 }}>
                {Icons.mortarboard(14,"currentColor")} {etab}
              </div>
            )}
          </div>
        </div>

        {/* Nav columns */}
        {columns.map((col) => (
          <div key={col.heading}>
            <h4 style={{
              margin:"0 0 18px", fontSize:12,
              fontWeight:700, letterSpacing:"0.1em",
              textTransform:"uppercase", color:"rgba(255,255,255,.4)",
            }}>
              {col.heading}
            </h4>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {col.links.map(({ label, id }) => (
                <button key={id}
                  onClick={() => scrollToSection(id)}
                  style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color="#93c5fd"}
                  onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,.55)"}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Social column */}
        <div>
          <h4 style={{
            margin:"0 0 18px", fontSize:12,
            fontWeight:700, letterSpacing:"0.1em",
            textTransform:"uppercase", color:"rgba(255,255,255,.4)",
          }}>
            {lang === "fr" ? "Réseaux" : "Connect"}
          </h4>

          {socialLinks.length > 0 ? (
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {socialLinks.map((l) => (
                <SocialPill key={l.id} link={l} />
              ))}
            </div>
          ) : (
            <p style={{ fontSize:13, color:"rgba(255,255,255,.35)", margin:0 }}>
              {lang === "fr" ? "Aucun lien configuré." : "No links configured."}
            </p>
          )}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────── */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,.08)" }}>
        <div style={{
          maxWidth:1160, margin:"0 auto",
          padding:"20px 2rem",
          display:"flex", alignItems:"center",
          justifyContent:"space-between", flexWrap:"wrap", gap:12,
        }}>
          <p style={{ margin:0, fontSize:12.5, color:"rgba(255,255,255,.3)" }}>
            © {year} {nom}. {lang === "fr" ? "Tous droits réservés." : "All rights reserved."}
          </p>
          <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,.2)" }}>
            {lang === "fr"
              ? "Conçu avec ❤️ pour l'enseignement et la recherche."
              : "Built with ❤️ for teaching and research."}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── SocialPill ───────────────────────────────────────────────
function SocialPill({ link: l }) {
  return (
    <a href={l.href} target="_blank" rel="noreferrer" title={l.titre}
      style={{
        display:"flex", alignItems:"center", gap:7,
        background:"rgba(255,255,255,.07)",
        border:"1px solid rgba(255,255,255,.1)",
        borderRadius:10, padding:"8px 13px",
        color:"rgba(255,255,255,.65)", fontSize:12.5, fontWeight:600,
        textDecoration:"none", transition:"all .2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background="rgba(37,99,235,.3)";
        e.currentTarget.style.borderColor="rgba(37,99,235,.6)";
        e.currentTarget.style.color="#fff";
        e.currentTarget.style.transform="translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background="rgba(255,255,255,.07)";
        e.currentTarget.style.borderColor="rgba(255,255,255,.1)";
        e.currentTarget.style.color="rgba(255,255,255,.65)";
        e.currentTarget.style.transform="none";
      }}>
      {l.iconFn(14,"currentColor")} {l.titre}
    </a>
  );
}