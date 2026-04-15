// components/sections/AProposSection.jsx
// Fully dynamic À propos section.
// Data comes exclusively from the API via useAproposData.
// No DEFAULT_SKILLS / DEFAULT_PARCOURS — fallback UI when empty.

import { getTheme }       from "../../constants/theme";
import { SectionHeader }  from "../ui/SectionHeader";
import { Icons }          from "../ui/Icons";
import { useAproposData } from "../../hooks/useAproposData";

// ─── SkillBar ─────────────────────────────────────────────────
function SkillBar({ label, icon, pct, dark, t }) {
  const safePct = Math.min(100, Math.max(0, Number(pct) || 0));

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Label row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:14, color: dark ? "#60a5fa" : "#1e3a8a" }}>
            {icon || "◆"}
          </span>
          <span style={{ fontSize:14, fontWeight:600, color:t.text }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize:13, fontWeight:700, color: dark ? "#60a5fa" : "#1e3a8a" }}>
          {safePct}%
        </span>
      </div>

      {/* Track */}
      <div style={{
        height:7, borderRadius:99,
        background: dark ? "rgba(255,255,255,0.07)" : "rgba(30,58,138,0.09)",
        overflow:"hidden",
      }}>
        {/* Fill */}
        <div style={{
          height:"100%", width:`${safePct}%`, borderRadius:99,
          background:"linear-gradient(90deg,#1e3a8a,#2563eb)",
          transition:"width 1s cubic-bezier(.4,0,.2,1)",
        }} />
      </div>
    </div>
  );
}

// ─── TimelineItem ─────────────────────────────────────────────
function TimelineItem({ period, titre, lieu, dark, t, isLast }) {
  return (
    <div style={{ display:"flex", gap:16, paddingBottom: isLast ? 0 : 24, position:"relative" }}>
      {/* Dot + vertical line */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
        <div style={{
          width:14, height:14, borderRadius:"50%",
          background:"linear-gradient(135deg,#1e3a8a,#3b82f6)",
          boxShadow:`0 0 0 3px ${dark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.15)"}`,
          flexShrink:0, marginTop:3,
        }} />
        {!isLast && (
          <div style={{
            width:2, flex:1, marginTop:6,
            background: dark ? "rgba(255,255,255,0.08)" : "rgba(30,58,138,0.1)",
            borderRadius:99,
          }} />
        )}
      </div>

      {/* Text */}
      <div style={{ paddingBottom: isLast ? 0 : 4 }}>
        <div style={{ fontSize:11.5, fontWeight:700, color: dark ? "#60a5fa" : "#2563eb", letterSpacing:"0.04em", marginBottom:3 }}>
          {period}
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:t.text, lineHeight:1.35, marginBottom:3 }}>
          {titre}
        </div>
        {lieu && (
          <div style={{ fontSize:13, color:t.textMuted }}>{lieu}</div>
        )}
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────
function Empty({ icon, message, dark, t }) {
  return (
    <div style={{
      textAlign:"center", padding:"40px 20px",
      border:`1px dashed ${t.border}`,
      borderRadius:16, background:t.bgCard,
    }}>
      <div style={{ marginBottom:12, opacity:.5 }}>{icon}</div>
      <p style={{ margin:0, color:t.textMuted, fontSize:14, lineHeight:1.6 }}>{message}</p>
    </div>
  );
}

// ─── Inline loader skeleton ───────────────────────────────────
function Skeleton({ dark, t }) {
  const bar = (w) => (
    <div style={{
      height:12, width:w, borderRadius:99,
      background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      animation:"pulse .8s ease-in-out infinite alternate",
    }} />
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {bar("60%")} {bar("100%")}
        </div>
      ))}
      <style>{`@keyframes pulse { from { opacity:.4 } to { opacity:1 } }`}</style>
    </div>
  );
}

// ─── AProposSection ───────────────────────────────────────────
export function AProposSection({ visiteur, dark, lang }) {
  const t = getTheme(dark);
  const { skills, parcours, loading, error } = useAproposData();

  // Visiteur profile fields — safe extraction
  const bio           = visiteur?.bio?.trim()           || "";
  const grade         = visiteur?.grade?.trim()         || "";
  const etablissement = visiteur?.etablissement?.trim() || "";

  const hasBio           = bio.length > 0;
  const hasGrade         = grade.length > 0;
  const hasEtablissement = etablissement.length > 0;

  return (
    <section id="apropos" style={{ padding:"96px 2rem", background:t.bg }}>
      <div style={{ maxWidth:1160, margin:"0 auto" }}>

        <SectionHeader
          iconFn={Icons.user}
          title={lang === "fr" ? "À propos" : "About"}
          subtitle={lang === "fr"
            ? "Mon parcours académique et mes compétences."
            : "My academic background and expertise."}
          dark={dark}
        />

        {/* ── 2-column grid ────────────────────────────── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
          gap:32, alignItems:"start",
        }}>

          {/* ── LEFT: Bio + Skills ──────────────────────── */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Bio card */}
            <div style={{
              borderRadius:18, padding:28,
              border:`1px solid ${t.border}`, background:t.bgCard,
            }}>
              {hasBio
                ? <p style={{ margin:0, color:t.textMuted, lineHeight:1.9, fontSize:15 }}>{bio}</p>
                : <p style={{ margin:0, color:t.textMuted, fontSize:14, fontStyle:"italic", opacity:.7 }}>
                    {lang === "fr" ? "Aucune biographie disponible." : "No biography available."}
                  </p>
              }
            </div>

            {/* Skills card */}
            <div style={{
              borderRadius:18, padding:"24px 28px",
              border:`1px solid ${t.border}`, background:t.bgCard,
            }}>
              <h3 style={{
                margin:"0 0 22px", fontSize:16, fontWeight:700,
                color:t.text, display:"flex", alignItems:"center", gap:8,
              }}>
                {Icons.sparkles(16, dark ? "#60a5fa" : "#2563eb")}
                {lang === "fr" ? "Compétences" : "Skills"}
              </h3>

              {loading
                ? <Skeleton dark={dark} t={t} />
                : error
                  ? <p style={{ color:"#dc2626", fontSize:13, margin:0 }}>
                      {lang === "fr" ? "Erreur de chargement." : "Failed to load."}
                    </p>
                  : skills.length > 0
                    ? skills.map((sk) => (
                        <SkillBar key={sk.id} {...sk} dark={dark} t={t} />
                      ))
                    : <Empty
                        dark={dark} t={t}
                        icon={Icons.sparkles(32, t.textMuted)}
                        message={lang === "fr"
                          ? "Aucune compétence renseignée pour le moment."
                          : "No skills listed yet."}
                      />
              }
            </div>
          </div>

          {/* ── RIGHT: Parcours timeline ─────────────────── */}
          <div style={{
            borderRadius:18, padding:"24px 28px",
            border:`1px solid ${t.border}`, background:t.bgCard,
          }}>
            <h3 style={{
              margin:"0 0 28px", fontSize:16, fontWeight:700,
              color:t.text, display:"flex", alignItems:"center", gap:8,
            }}>
              {Icons.mortarboard(18, dark ? "#60a5fa" : "#1e3a8a")}
              {lang === "fr" ? "Parcours" : "Career"}
            </h3>

            {loading
              ? <Skeleton dark={dark} t={t} />
              : error
                ? <p style={{ color:"#dc2626", fontSize:13, margin:0 }}>
                    {lang === "fr" ? "Erreur de chargement." : "Failed to load."}
                  </p>
                : parcours.length > 0
                  ? parcours.map((item, i) => (
                      <TimelineItem
                        key={item.id}
                        {...item}
                        dark={dark} t={t}
                        isLast={i === parcours.length - 1}
                      />
                    ))
                  : <Empty
                      dark={dark} t={t}
                      icon={Icons.mortarboard(32, t.textMuted)}
                      message={lang === "fr"
                        ? "Aucun parcours renseigné pour le moment."
                        : "No career entries yet."}
                    />
            }

            {/* Grade + établissement from visiteur profile */}
            {(hasGrade || hasEtablissement) && (
              <div style={{
                marginTop:24, paddingTop:20,
                borderTop:`1px solid ${t.border}`,
                display:"flex", flexDirection:"column", gap:10,
              }}>
                {hasGrade && (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {Icons.mortarboard(16, dark ? "#60a5fa" : "#1e3a8a")}
                    <span style={{ fontSize:14, fontWeight:700, color:t.text }}>{grade}</span>
                  </div>
                )}
                {hasEtablissement && (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {Icons.globe(16, t.textMuted)}
                    <span style={{ fontSize:13.5, color:t.textMuted }}>{etablissement}</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}