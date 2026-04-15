import { Icons } from "../ui/Icons";

/**
 * StatsBar — full-width gradient band showing key numbers.
 * @prop {{ total_cours, total_publications, total_projets }} stats
 * @prop {"fr"|"en"} lang
 */
export function StatsBar({ stats, lang }) {
  const items = [
    { icon: Icons.book,  value: stats.total_cours,        label: lang === "fr" ? "Cours"       : "Courses" },
    { icon: Icons.file,  value: stats.total_publications,  label: "Publications" },
    { icon: Icons.flask, value: stats.total_projets,       label: lang === "fr" ? "Projets"     : "Projects" },
  ];

  return (
    <div style={{
      background: "linear-gradient(130deg,#1e3a8a 0%,#1d4ed8 60%,#2563eb 100%)",
      padding: "52px 2rem",
    }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
        gap: 16,
      }}>
        {items.map(({ icon, value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ display:"flex",justifyContent:"center",marginBottom:12,opacity:.75 }}>
              {icon(30, "#fff")}
            </div>
            <div style={{ fontSize:"clamp(32px,3.5vw,44px)",fontWeight:900,color:"#fff",marginBottom:6,lineHeight:1 }}>
              {value}
            </div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,.55)",letterSpacing:".06em",textTransform:"uppercase",fontWeight:600 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}