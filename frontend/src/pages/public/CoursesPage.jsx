// ============================================================
// CourseDetailPage.jsx — With PDF Preview Modal
// NEW: Preview modal (iframe) + Download button per resource
// All existing fetch/render logic preserved unchanged.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate }           from "react-router-dom";

const API = "http://localhost:5000/api";

// ─── Global CSS ───────────────────────────────────────────────
const CSS = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  @keyframes modalFade {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes modalSlide {
    from { opacity:0; transform:scale(.96) translateY(12px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  .cd-lift { transition:transform .22s cubic-bezier(.4,0,.2,1),box-shadow .22s cubic-bezier(.4,0,.2,1),border-color .2s; }
  .cd-lift:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(37,99,235,.13) !important; border-color:rgba(37,99,235,.3) !important; }
  .cd-back:hover { border-color:#2563eb !important; color:#2563eb !important; transform:translateX(-3px); }
  .cd-dl-btn:hover  { background:linear-gradient(135deg,#1e3a8a,#2563eb) !important; color:#fff !important; border-color:transparent !important; box-shadow:0 4px 16px rgba(37,99,235,.4) !important; }
  .cd-pre-btn:hover { background:linear-gradient(135deg,#0891b2,#06b6d4) !important; color:#fff !important; border-color:transparent !important; box-shadow:0 4px 16px rgba(8,145,178,.4) !important; }
  .cd-back, .cd-dl-btn, .cd-pre-btn { transition:all .18s cubic-bezier(.4,0,.2,1); }
  .modal-close:hover { background:rgba(255,255,255,.15) !important; }
  * { box-sizing:border-box; }
  @media (max-width:600px) {
    .res-actions { flex-direction:column !important; }
    .res-actions button { width:100% !important; justify-content:center !important; }
  }
`;

// ─── Theme ────────────────────────────────────────────────────
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
  cyanDim:   dark ? "rgba(8,145,178,.14)"   : "rgba(8,145,178,.08)",
  cyanBdr:   dark ? "rgba(8,145,178,.28)"   : "rgba(8,145,178,.16)",
  skA:       dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
  skB:       dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.08)",
});

const TYPE_STYLE = {
  CM: { bg:"#1e3a8a", text:"#fff" },
  TD: { bg:"#0891b2", text:"#fff" },
  TP: { bg:"#059669", text:"#fff" },
};
const LEVEL_ICON = { Licence:"📘","Licence 1":"📘","Licence 2":"📘","Licence 3":"📘",Master:"📗","Master 1":"📗","Master 2":"📗",Doctorat:"📕" };
const lvlIcon = (n) => LEVEL_ICON[n] ?? "📖";

function fileIcon(filename = "") {
  const ext = (filename.split(".").pop() ?? "").toLowerCase();
  if (ext === "pdf")                            return "📄";
  if (["doc","docx"].includes(ext))             return "📝";
  if (["ppt","pptx"].includes(ext))             return "📊";
  if (["jpg","jpeg","png","gif"].includes(ext)) return "🖼️";
  if (["mp4","avi","mov"].includes(ext))         return "🎬";
  if (["zip","rar","7z"].includes(ext))          return "📦";
  return "📁";
}

function isPDF(filename = "") {
  return filename.split(".").pop().toLowerCase() === "pdf";
}

// ─── SVG Icons ────────────────────────────────────────────────
const Ico = {
  arrowL: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  clock:  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  cap:    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 22 8.5 12 15 2 8.5 12 2"/><line x1="12" y1="15" x2="12" y2="22"/><path d="M19 11v5.5a7 7 0 0 1-14 0V11"/></svg>,
  globe:  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  target: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  list:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  star:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  user:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  check:  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  book:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  file:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  retry:  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  clap:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M7 17l-3-3 3-3"/><path d="M5 14h11a4 4 0 0 0 0-8h-1"/></svg>,
  eye:    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  dl:     <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  close:  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────
function parseList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw !== "string") return [];
  const s = raw.trim();
  if (!s) return [];
  try { const p = JSON.parse(s); if (Array.isArray(p)) return p.map(String).filter(Boolean); } catch {}
  const lines = s.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  const numbered = s.split(/\d+[.)]\s+/).map(l => l.trim()).filter(Boolean);
  if (numbered.length > 1) return numbered;
  return [s];
}
function buildFileUrl(storedPath) {
  const p = storedPath.replace(/\\/g, "/");
  if (p.startsWith("http")) return p;                    // déjà URL
  const i = p.indexOf("uploads/");
  if (i !== -1) return `${API_BASE}/${p.slice(i)}`;     // ← legacy absolu
  return `${API_BASE}/${p}`;                             // ← relatif propre
}
function extractCourse(json) {
  if (!json || typeof json !== "object") return null;
  if (json.course && typeof json.course === "object") return json.course;
  if (json.cours  && typeof json.cours  === "object") return json.cours;
  if (json.data   && typeof json.data   === "object") return json.data;
  if (json.id) return json;
  return null;
}
function extractResources(json) {
  if (!json || typeof json !== "object") return [];
  if (Array.isArray(json.resources))  return json.resources;
  if (Array.isArray(json.ressources)) return json.ressources;
  if (Array.isArray(json.data))       return json.data;
  if (Array.isArray(json))            return json;
  return [];
}

// ═══════════════════════════════════════════════════════════════
// PREVIEW MODAL
// ═══════════════════════════════════════════════════════════════
function PreviewModal({ previewUrl, filename, onClose }) {
  const canPreview = previewUrl && isPDF(filename ?? "");

  // ESC key + lock body scroll
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    // Overlay — click outside closes modal
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:9000,
        background:"rgba(0,0,0,.78)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"24px 16px",
        animation:"modalFade .2s ease both",
      }}>

      {/* Modal box */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width:"100%", maxWidth:900,
          height:"min(88vh,720px)",
          background:"#111827",
          borderRadius:18,
          overflow:"hidden",
          display:"flex", flexDirection:"column",
          boxShadow:"0 32px 80px rgba(0,0,0,.65)",
          animation:"modalSlide .25s ease both",
        }}>

        {/* Header bar */}
        <div style={{
          display:"flex", alignItems:"center", gap:12,
          padding:"13px 18px",
          background:"rgba(255,255,255,.05)",
          borderBottom:"1px solid rgba(255,255,255,.08)",
          flexShrink:0,
        }}>
          <span style={{ fontSize:18 }}>{fileIcon(filename ?? "")}</span>
          <span style={{ flex:1, fontSize:13.5, fontWeight:600, color:"#e2e8f0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {filename || "Aperçu"}
          </span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginRight:8, flexShrink:0 }}>
            Esc pour fermer
          </span>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              width:32, height:32, borderRadius:8,
              background:"transparent", border:"none",
              color:"rgba(255,255,255,.55)", cursor:"pointer", flexShrink:0,
            }}>
            {Ico.close}
          </button>
        </div>

        {/* Content area */}
        <div style={{ flex:1, overflow:"hidden", background:"#0f172a", position:"relative" }}>
          {canPreview ? (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              style={{ width:"100%", height:"100%", border:"none", display:"block" }}
            />
          ) : (
            // Non-PDF fallback message
            <div style={{
              height:"100%", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              gap:16, padding:40, textAlign:"center",
            }}>
              <span style={{ fontSize:56 }}>{fileIcon(filename ?? "")}</span>
              <div>
                <p style={{ margin:"0 0 8px", color:"#cbd5e1", fontSize:15.5, fontWeight:600 }}>
                  Aperçu non disponible
                </p>
                <p style={{ margin:0, color:"#64748b", fontSize:13.5, lineHeight:1.6 }}>
                  Seuls les fichiers <strong style={{ color:"#94a3b8" }}>PDF</strong> peuvent être prévisualisés.<br/>
                  Téléchargez le fichier pour l'ouvrir.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────
function Skeleton({ t }) {
  const shimmer = { background:`linear-gradient(90deg,${t.skA} 25%,${t.skB} 50%,${t.skA} 75%)`, backgroundSize:"600px 100%", animation:"shimmer 1.4s linear infinite", borderRadius:8 };
  const bar = (w, h=14, mb=0) => <div style={{ ...shimmer, width:w, height:h, marginBottom:mb }}/>;
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"48px 2rem" }}>
      <div style={{ marginBottom:36 }}>{bar(110,32,20)}{bar("58%",26,12)}{bar("32%",18)}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14, marginBottom:28 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ padding:20, borderRadius:16, background:t.bgCard, border:`1px solid ${t.border}`, display:"flex", gap:14, alignItems:"center" }}>
            <div style={{ ...shimmer, width:42, height:42, borderRadius:12 }}/>
            <div style={{ flex:1 }}>{bar("50%",13,8)}{bar("70%",18)}</div>
          </div>
        ))}
      </div>
      {[1,2].map(i => (
        <div key={i} style={{ padding:28, borderRadius:18, background:t.bgCard, border:`1px solid ${t.border}`, marginBottom:20 }}>
          {bar("30%",18,18)}
          {[80,95,88,70].map((w,j) => <div key={j} style={{ ...shimmer, width:`${w}%`, height:13, marginBottom:10 }}/>)}
        </div>
      ))}
    </div>
  );
}

function InfoChip({ icon, label, value, t, dark }) {
  return (
    <div className="cd-lift" style={{ padding:"18px 20px", borderRadius:16, background:t.bgCard, border:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:42, height:42, borderRadius:12, background:t.accentDim, border:`1px solid ${t.accentBdr}`, display:"flex", alignItems:"center", justifyContent:"center", color:dark?"#60a5fa":"#1e3a8a", flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:15.5, fontWeight:700, color:t.text }}>{value}</div>
      </div>
    </div>
  );
}

function SectionBlock({ icon, title, t, dark, delay=0, children }) {
  return (
    <div style={{ borderRadius:18, padding:"26px 28px", background:t.bgCard, border:`1px solid ${t.border}`, animation:"fadeUp .45s ease both", animationDelay:`${delay}ms` }}>
      <h3 style={{ margin:"0 0 18px", fontSize:17, fontWeight:800, color:t.text, display:"flex", alignItems:"center", gap:10, fontFamily:"'Playfair Display',Georgia,serif" }}>
        <span style={{ color:dark?"#60a5fa":"#2563eb" }}>{icon}</span>{title}
      </h3>
      {children}
    </div>
  );
}

function CourseHeader({ cours, dark, lang, t, onBack }) {
  const titre = cours?.intitule ?? cours?.titre ?? cours?.title ?? "—";
  const type  = cours?.type ?? "";
  const niveau = cours?.niveau ?? "";
  const tc    = TYPE_STYLE[type] ?? { bg:"#64748b", text:"#fff" };
  return (
    <div style={{ background:t.bgHero, borderBottom:`1px solid ${t.border}`, padding:"60px 2rem 44px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <button className="cd-back" onClick={onBack} style={{ display:"inline-flex", alignItems:"center", gap:7, background:"transparent", border:`1.5px solid ${t.border}`, borderRadius:10, padding:"8px 16px", fontSize:13.5, fontWeight:600, color:t.textMuted, cursor:"pointer", marginBottom:28 }}>
          {Ico.arrowL} {lang==="fr" ? "Retour aux cours" : "Back to courses"}
        </button>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
          {type && <span style={{ background:tc.bg, color:tc.text, fontSize:12, fontWeight:800, borderRadius:8, padding:"5px 14px", letterSpacing:"0.06em" }}>{type}</span>}
          {niveau && <span style={{ background:t.accentDim, color:dark?"#93c5fd":"#1d4ed8", border:`1px solid ${t.accentBdr}`, fontSize:12.5, fontWeight:700, borderRadius:8, padding:"5px 14px" }}>{lvlIcon(niveau)} {niveau}</span>}
        </div>
        <h1 style={{ margin:0, lineHeight:1.2, fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:900, color:t.text, letterSpacing:-1, fontFamily:"'Playfair Display',Georgia,serif", animation:"fadeUp .45s ease both" }}>{titre}</h1>
      </div>
    </div>
  );
}

function CourseInfo({ cours, dark, lang, t }) {
  const duree = cours?.volume_horaire ?? cours?.duree_heures ?? cours?.duree ?? null;
  const annee = cours?.annee_universitaire ?? cours?.annee ?? null;
  const inst  = cours?.institution ?? null;
  const chips = [
    duree && { icon:Ico.clock, label:lang==="fr"?"Durée":"Duration",     value:`${duree}h` },
    annee && { icon:Ico.cap,   label:lang==="fr"?"Année":"Year",          value:`${annee}` },
    inst  && { icon:Ico.globe, label:lang==="fr"?"Institution":"Campus",  value:inst },
  ].filter(Boolean);
  if (!chips.length) return null;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14, animation:"fadeUp .45s ease .08s both" }}>
      {chips.map((c,i) => <InfoChip key={i} icon={c.icon} label={c.label} value={c.value} t={t} dark={dark}/>)}
    </div>
  );
}

function CourseContent({ cours, dark, lang, t }) {
  const description  = cours?.description  ?? "";
  const contenu      = cours?.contenu      ?? "";
  const intervenants = cours?.intervenants ?? "";
  const evaluation   = cours?.evaluation   ?? "";
  const objectifs   = parseList(cours?.objectifs);
  const programme   = parseList(cours?.programme ?? (contenu !== description ? contenu : null));
  const competences = parseList(cours?.competences ?? cours?.skills);
  const tx = { desc:lang==="fr"?"Description":"Description", obj:lang==="fr"?"Objectifs":"Objectives", prog:lang==="fr"?"Programme":"Syllabus", skills:lang==="fr"?"Compétences":"Skills", eval:lang==="fr"?"Évaluation":"Assessment", interv:lang==="fr"?"Intervenants":"Instructors" };
  if (!description && !objectifs.length && !programme.length && !competences.length && !evaluation && !intervenants) return null;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      {description && (
        <SectionBlock icon={Ico.book} title={tx.desc} dark={dark} t={t} delay={120}>
          <p style={{ margin:0, fontSize:15.5, color:t.textMuted, lineHeight:1.85, whiteSpace:"pre-wrap" }}>{description}</p>
        </SectionBlock>
      )}
      {objectifs.length>0 && (
        <SectionBlock icon={Ico.target} title={tx.obj} dark={dark} t={t} delay={180}>
          <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
            {objectifs.map((obj,i) => (
              <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <span style={{ marginTop:2, flexShrink:0, width:22, height:22, borderRadius:"50%", background:t.accentDim, border:`1px solid ${t.accentBdr}`, display:"flex", alignItems:"center", justifyContent:"center", color:dark?"#60a5fa":"#2563eb" }}>{Ico.check}</span>
                <span style={{ fontSize:14.5, color:t.textMuted, lineHeight:1.65 }}>{obj}</span>
              </li>
            ))}
          </ul>
        </SectionBlock>
      )}
      {programme.length>0 && (
        <SectionBlock icon={Ico.list} title={tx.prog} dark={dark} t={t} delay={240}>
          <ol style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
            {programme.map((item,i) => (
              <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <span style={{ flexShrink:0, minWidth:28, height:28, borderRadius:8, background:t.accentDim, border:`1px solid ${t.accentBdr}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11.5, fontWeight:800, color:dark?"#60a5fa":"#1d4ed8" }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ fontSize:14.5, color:t.textMuted, lineHeight:1.65, paddingTop:4 }}>{item}</span>
              </li>
            ))}
          </ol>
        </SectionBlock>
      )}
      {competences.length>0 && (
        <SectionBlock icon={Ico.star} title={tx.skills} dark={dark} t={t} delay={300}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {competences.map((comp,i) => <span key={i} style={{ padding:"7px 14px", borderRadius:20, background:t.accentDim, color:dark?"#93c5fd":"#1d4ed8", border:`1px solid ${t.accentBdr}`, fontSize:13, fontWeight:600 }}>{comp}</span>)}
          </div>
        </SectionBlock>
      )}
      {evaluation && (
        <SectionBlock icon={Ico.clap} title={tx.eval} dark={dark} t={t} delay={360}>
          <p style={{ margin:0, fontSize:14.5, color:t.textMuted, lineHeight:1.75 }}>{evaluation}</p>
        </SectionBlock>
      )}
      {intervenants && (
        <SectionBlock icon={Ico.user} title={tx.interv} dark={dark} t={t} delay={420}>
          <p style={{ margin:0, fontSize:14.5, color:t.textMuted, lineHeight:1.75 }}>{intervenants}</p>
        </SectionBlock>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ResourceCard — Preview + Download
// ═══════════════════════════════════════════════════════════════
function ResourceCard({ ressource, dark, lang, t, onPreview }) {
  const [hov,         setHov]         = useState(false);
  const [downloading, setDownloading] = useState(false);

  const titre    = ressource?.titre ?? (lang === "fr" ? "Sans titre" : "Untitled");
  const fichier  = ressource?.fichier ?? "";
  const count    = ressource?.nb_telechargements ?? null;
  const showCount = ressource?.afficher_compteur === true && count !== null;
  const icon     = fileIcon(fichier);
  const resId    = ressource?.id ?? ressource?._id ?? null;
  const dlUrl    = resId ? `${API}/ressources-cours/${resId}/download` : null;

  // Preview URL: served statically by Express (app.use('/uploads', express.static(...)))
  const previewUrl = fichier
    ? `http://localhost:5000/${fichier.replace(/\\/g, "/")}`
    : null;

  const handleDownload = () => {
    if (!dlUrl || downloading) return;
    setDownloading(true);
    window.open(dlUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => setDownloading(false), 1500);
  };

  const btnBase = {
    display:"flex", alignItems:"center", gap:6,
    borderRadius:9, padding:"8px 14px",
    fontSize:12.5, fontWeight:700, cursor:"pointer", flexShrink:0,
    border:"1.5px solid",
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", flexWrap:"wrap", gap:12,
        padding:"16px 20px", borderRadius:14,
        background:t.bgCard,
        border:`1px solid ${hov ? "rgba(37,99,235,.3)" : t.border}`,
        transition:"all .2s cubic-bezier(.4,0,.2,1)",
        transform:hov ? "translateY(-2px)" : "none",
        boxShadow:hov ? "0 8px 24px rgba(37,99,235,.1)" : "none",
      }}>

      {/* File icon bubble */}
      <div style={{ width:46, height:46, borderRadius:12, flexShrink:0, background:t.accentDim, border:`1px solid ${t.accentBdr}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
        {icon}
      </div>

      {/* Title + counter */}
      <div style={{ flex:1, minWidth:120 }}>
        <div style={{ fontSize:14.5, fontWeight:700, color:t.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:3 }}>{titre}</div>
        {showCount && (
          <div style={{ fontSize:12, color:t.textMuted, display:"flex", alignItems:"center", gap:4 }}>
            {Ico.dl} {count} {lang==="fr" ? `téléchargement${count!==1?"s":""}` : `download${count!==1?"s":""}`}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="res-actions" style={{ display:"flex", gap:8, flexShrink:0 }}>

        {/* 👁 Preview */}
        <button
          className="cd-pre-btn"
          onClick={() => onPreview({ url:previewUrl, filename:fichier, titre })}
          disabled={!previewUrl}
          style={{
            ...btnBase,
            background: t.cyanDim,
            color: "#0891b2",
            borderColor: t.cyanBdr,
            opacity: previewUrl ? 1 : 0.4,
            cursor: previewUrl ? "pointer" : "not-allowed",
          }}>
          {Ico.eye}
          {lang==="fr" ? "Aperçu" : "Preview"}
        </button>

        {/* ⬇ Download */}
        <button
          className="cd-dl-btn"
          onClick={handleDownload}
          disabled={!resId || downloading}
          style={{
            ...btnBase,
            background: t.accentDim,
            color: "#2563eb",
            borderColor: t.accentBdr,
            opacity: resId ? 1 : 0.4,
            cursor: resId ? "pointer" : "not-allowed",
          }}>
          {Ico.dl}
          {downloading ? (lang==="fr"?"Ouverture…":"Opening…") : (lang==="fr"?"Télécharger":"Download")}
        </button>
      </div>
    </div>
  );
}

function RessourcesSection({ ressources, loading, dark, lang, t, onPreview }) {
  const tx = {
    title:   lang==="fr" ? "Ressources du cours"  : "Course Resources",
    empty:   lang==="fr" ? "Aucune ressource disponible." : "No resources available.",
    loading: lang==="fr" ? "Chargement…" : "Loading…",
  };
  return (
    <SectionBlock icon={Ico.file} title={tx.title} dark={dark} t={t} delay={480}>
      {loading ? (
        <div style={{ color:t.textMuted, fontSize:14, padding:"16px 0" }}>{tx.loading}</div>
      ) : !ressources?.length ? (
        <div style={{ textAlign:"center", padding:"32px 20px", border:`1px dashed ${t.border}`, borderRadius:12 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <p style={{ margin:0, color:t.textMuted, fontSize:14 }}>{tx.empty}</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ressources.map((r,i) => (
            <ResourceCard key={r?.id??i} ressource={r} dark={dark} lang={lang} t={t} onPreview={onPreview}/>
          ))}
        </div>
      )}
    </SectionBlock>
  );
}

// ─── useCourseDetail ──────────────────────────────────────────
function useCourseDetail(id) {
  const [cours,      setCours]      = useState(null);
  const [ressources, setRessources] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [loadingRes, setLoadingRes] = useState(true);
  const [error,      setError]      = useState(null);
  const [tick,       setTick]       = useState(0);
  const retry = useCallback(() => setTick(t => t+1), []);

  useEffect(() => {
    if (!id) { setLoading(false); setError("ID manquant"); return; }
    let cancelled = false;
    const load = async () => {
      setLoading(true); setLoadingRes(true); setError(null);
      try {
        const res = await fetch(`${API}/cours/${id}`);
        if (!res.ok) throw new Error(res.status===404?"Cours non trouvé":`HTTP ${res.status}`);
        const json = await res.json();
        const data = extractCourse(json);
        if (!data) throw new Error("Réponse invalide");
        if (!cancelled) { setCours(data); setLoading(false); }

        try {
          const rRes  = await fetch(`${API}/ressources-cours/course/${id}`);
          const rJson = rRes.ok ? await rRes.json() : {};
          if (!cancelled) setRessources(extractResources(rJson));
        } catch { if (!cancelled) setRessources([]); }
        finally  { if (!cancelled) setLoadingRes(false); }

      } catch (err) {
        if (!cancelled) { setError(err?.message??"Erreur réseau"); setLoading(false); setLoadingRes(false); }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, tick]);

  return { cours, ressources, loading, loadingRes, error, retry };
}

// ═══════════════════════════════════════════════════════════════
// CourseDetailPage — main export
// ═══════════════════════════════════════════════════════════════
export default function CourseDetailPage({ dark = false, lang = "fr" }) {
  const { id }   = useParams();
  const navigate = useNavigate();
  const t        = tk(dark);

  const { cours, ressources, loading, loadingRes, error, retry } = useCourseDetail(id);
  const onBack = () => navigate(-1);

  // ── Preview modal state ────────────────────────────────────
  // previewFile: { url: string, filename: string, titre: string } | null
  const [previewFile, setPreviewFile] = useState(null);
  const openPreview  = useCallback((file) => setPreviewFile(file), []);
  const closePreview = useCallback(() => setPreviewFile(null), []);

  return (
    <div style={{ minHeight:"100vh", background:t.bg, fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif" }}>
      <style>{CSS}</style>

      {/* Preview modal — rendered at top level to avoid z-index issues */}
      {previewFile && (
        <PreviewModal
          previewUrl={previewFile.url}
          filename={previewFile.filename}
          onClose={closePreview}
        />
      )}

      {loading && <Skeleton t={t}/>}

      {!loading && error && (
        <div style={{ maxWidth:560, margin:"80px auto", padding:"0 2rem", textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:20 }}>⚠️</div>
          <h2 style={{ margin:"0 0 10px", color:t.text, fontSize:22, fontWeight:800 }}>{lang==="fr"?"Cours introuvable":"Course not found"}</h2>
          <p style={{ margin:"0 0 24px", color:t.textMuted, fontSize:14.5 }}>{error}</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <button onClick={retry} style={{ display:"flex", alignItems:"center", gap:7, background:"linear-gradient(135deg,#1e3a8a,#2563eb)", color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(37,99,235,.4)" }}>
              {Ico.retry} {lang==="fr"?"Réessayer":"Retry"}
            </button>
            <button className="cd-back" onClick={onBack} style={{ display:"flex", alignItems:"center", gap:7, background:"transparent", color:t.textMuted, border:`1.5px solid ${t.border}`, borderRadius:10, padding:"10px 22px", fontSize:14, fontWeight:600, cursor:"pointer" }}>
              {Ico.arrowL} {lang==="fr"?"Retour":"Back"}
            </button>
          </div>
        </div>
      )}

      {!loading && !error && cours && (
        <>
          <CourseHeader cours={cours} dark={dark} lang={lang} t={t} onBack={onBack}/>
          <div style={{ maxWidth:1000, margin:"0 auto", padding:"36px 2rem 80px" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
              <CourseInfo    cours={cours}               dark={dark} lang={lang} t={t}/>
              <CourseContent cours={cours}               dark={dark} lang={lang} t={t}/>
              <RessourcesSection
                ressources={ressources} loading={loadingRes}
                dark={dark} lang={lang} t={t}
                onPreview={openPreview}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}