// src/components/cv/CVModal.jsx
import { useState, useEffect } from "react";
import { generateAcademicCV, generateProfessionalCV } from "../../utils/cvGenerator";

export default function CVModal({ visiteur, cours, publications, projets, dark, onClose }) {
  const [selected,   setSelected]   = useState("academic");
  const [generating, setGenerating] = useState(false);

  // ESC pour fermer
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleGenerate = () => {
    setGenerating(true);
    const data = { ...visiteur, cours, publications, projets };
    setTimeout(() => {
      try {
        if (selected === "academic") generateAcademicCV(data);
        else                         generateProfessionalCV(data);
      } finally {
        setGenerating(false);
      }
    }, 100);
  };

  const bg      = dark ? "#0f172a" : "#ffffff";
  const border  = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.09)";
  const text    = dark ? "#e2e8f0" : "#0f172a";
  const muted   = dark ? "#7c8fb5" : "#64748b";

  const templates = [
    {
      id: "academic",
      icon: "🎓",
      label: "Académique",
      desc: "Style classique — bleu marine, idéal pour les dossiers universitaires.",
      preview: ["Header bleu", "Enseignements", "Publications", "Projets"],
    },
    {
      id: "professional",
      icon: "💼",
      label: "Professionnel",
      desc: "Style moderne — sidebar sombre avec initiales, idéal pour candidatures.",
      preview: ["Sidebar + Avatar", "Profil", "Enseignements", "Statistiques"],
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 16px",
      }}>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560,
          background: bg,
          borderRadius: 20,
          border: `1px solid ${border}`,
          boxShadow: "0 32px 80px rgba(0,0,0,.5)",
          overflow: "hidden",
        }}>

        {/* ── Header ── */}
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: `1px solid ${border}`,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: text }}>
              📄 Télécharger mon CV
            </h2>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: muted }}>
              Choisissez un template — les données sont chargées automatiquement
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "none",
            fontSize: 18, cursor: "pointer", color: muted,
            width: 30, height: 30, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* ── Templates ── */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {templates.map(tp => (
            <button
              key={tp.id}
              onClick={() => setSelected(tp.id)}
              style={{
                width: "100%", textAlign: "left", cursor: "pointer",
                padding: "16px 18px", borderRadius: 14,
                border: `2px solid ${selected === tp.id ? "#2563eb" : border}`,
                background: selected === tp.id
                  ? (dark ? "rgba(37,99,235,.12)" : "rgba(37,99,235,.05)")
                  : (dark ? "rgba(255,255,255,.03)" : "#f8fafc"),
                transition: "all .18s",
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: selected === tp.id ? "rgba(37,99,235,.15)" : (dark ? "rgba(255,255,255,.06)" : "#e2e8f0"),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>
                {tp.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14.5, fontWeight: 700,
                  color: selected === tp.id ? "#2563eb" : text,
                  marginBottom: 4,
                }}>
                  {tp.label}
                  {selected === tp.id && (
                    <span style={{
                      marginLeft: 8, fontSize: 10, fontWeight: 700,
                      background: "#2563eb", color: "#fff",
                      borderRadius: 20, padding: "2px 8px",
                    }}>Sélectionné</span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: muted, marginBottom: 8, lineHeight: 1.5 }}>
                  {tp.desc}
                </div>
                {/* Preview tags */}
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {tp.preview.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 600,
                      background: dark ? "rgba(255,255,255,.06)" : "#e2e8f0",
                      color: muted, borderRadius: 6, padding: "3px 8px",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Data summary ── */}
        <div style={{
          margin: "0 24px 18px",
          padding: "12px 16px", borderRadius: 12,
          background: dark ? "rgba(255,255,255,.04)" : "#f1f5f9",
          border: `1px solid ${border}`,
          display: "flex", gap: 20, flexWrap: "wrap",
        }}>
          {[
            { label: "Cours",        val: cours?.length        || 0, icon: "📚" },
            { label: "Publications", val: publications?.length  || 0, icon: "📝" },
            { label: "Projets",      val: projets?.length       || 0, icon: "🔬" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{ fontSize: 12.5, color: muted }}>{s.label}:</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* ── Generate button ── */}
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              flex: 1, padding: "13px 20px",
              background: generating ? "#94a3b8" : "linear-gradient(135deg,#1e3a8a,#2563eb)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 14.5, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer",
              boxShadow: generating ? "none" : "0 4px 20px rgba(37,99,235,.4)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all .2s",
            }}>
            {generating ? "⏳ Génération…" : "⬇ Télécharger le PDF"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "13px 18px",
              background: "transparent",
              color: muted, border: `1.5px solid ${border}`,
              borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}