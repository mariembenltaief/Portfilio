// src/utils/cvGenerator.js
import { jsPDF } from "jspdf";

// ══════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════

/** Split long text into lines that fit maxW (mm). */
function wrap(doc, text, maxW) {
  return doc.splitTextToSize(String(text || ""), maxW);
}

/** Add a new page if y is too low; reset y to top margin. */
function checkPage(doc, y) {
  if (y > 272) { doc.addPage(); return 22; }
  return y;
}

/** Guarantee a safe, non-null array regardless of input. */
function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

// ══════════════════════════════════════════════════════════════
// SKILLS RENDERERS  (shared by both templates)
// ══════════════════════════════════════════════════════════════

/**
 * Render "Compétences Techniques" with a labelled progress bar per skill.
 * Uses filled / empty block characters that jsPDF renders reliably.
 *
 * @param {jsPDF}  doc
 * @param {Array}  skills   – normalised skillsTech array from mapToCVData
 * @param {number} x        – left margin (mm)
 * @param {number} maxW     – available width (mm)
 * @param {number} startY   – current y position
 * @returns {number}  updated y position
 */
function renderSkillsTech(doc, skills, x, maxW, startY) {
  let y = startY;

  skills.forEach((s) => {
    y = checkPage(doc, y);

    const pct     = Math.min(100, Math.max(0, Number(s.pct) || 0));
    const BLOCKS  = 28;                             // total bar character count
    const filled  = Math.round((pct / 100) * BLOCKS);
    const empty   = BLOCKS - filled;

    // ── Label + percentage ──────────────────────────────────
    const icon  = s.icon && s.icon !== "◆" ? `${s.icon} ` : "";
    const label = `${icon}${s.label || ""}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);
    doc.text(label, x, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 110);
    doc.text(`${pct}%`, x + maxW, y, { align: "right" });

    // ── Progress bar (two-tone block characters) ────────────
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);

    if (filled > 0) {
      doc.setTextColor(37, 99, 235);
      doc.text("█".repeat(filled), x, y);
    }
    if (empty > 0) {
      // Position empty blocks right after the filled ones
      const filledW = doc.getTextWidth("█".repeat(filled));
      doc.setTextColor(190, 205, 230);
      doc.text("░".repeat(empty), x + filledW, y);
    }

    y += 6;
  });

  return y;
}

/**
 * Render "Compétences Générales" as flowing pill tags.
 *
 * @param {jsPDF}  doc
 * @param {Array}  skills   – normalised skillsSoft array from mapToCVData
 * @param {number} x
 * @param {number} maxW
 * @param {number} startY
 * @returns {number}  updated y position
 */
function renderSkillsSoft(doc, skills, x, maxW, startY) {
  let y    = startY;
  let rowX = x;

  const PILL_H   = 6;    // pill height (mm)
  const PAD_H    = 3;    // horizontal padding inside pill
  const PAD_V    = 1.5;  // vertical gap between pill rows
  const GAP      = 2.5;  // horizontal gap between pills

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  skills.forEach((s) => {
    const icon  = s.icon && s.icon !== "◆" ? `${s.icon} ` : "";
    const label = `${icon}${s.label || ""}`;
    const w     = doc.getTextWidth(label) + PAD_H * 2 + 2;

    // Wrap to next row if pill doesn't fit
    if (rowX + w > x + maxW) {
      rowX = x;
      y += PILL_H + PAD_V + 1;
    }

    y = checkPage(doc, y);

    // Pill background
    doc.setFillColor(235, 242, 255);
    doc.roundedRect(rowX, y - PILL_H + 1.5, w, PILL_H, 2, 2, "F");

    // Pill border
    doc.setDrawColor(180, 200, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(rowX, y - PILL_H + 1.5, w, PILL_H, 2, 2, "S");

    // Pill text
    doc.setTextColor(30, 58, 138);
    doc.text(label, rowX + PAD_H, y + 0.2);

    rowX += w + GAP;
  });

  return y + PILL_H + 4;
}

// ══════════════════════════════════════════════════════════════
// TEMPLATE 1 — ACADÉMIQUE  (bleu marine classique)
// ══════════════════════════════════════════════════════════════

/**
 * Generate an academic-style CV PDF.
 *
 * Expects a normalised CVData object produced by mapToCVData():
 * {
 *   visiteur:     { nom, prenom, email, grade, bio, etablissement, specialite },
 *   cours:        [{ titre, type, niveau, annee }],
 *   publications: [{ titre, auteurs, annee, revue }],
 *   projets:      [{ titre, description }],
 *   skillsTech:   [{ label, icon, pct }],
 *   skillsSoft:   [{ label, icon }],
 * }
 */
export function generateAcademicCV(cvData = {}) {
  // ── Safe destructure — every field has a fallback ───────────
  const visiteur     = cvData.visiteur     || {};
  const cours        = safeArr(cvData.cours);
  const publications = safeArr(cvData.publications);
  const projets      = safeArr(cvData.projets);
  const skillsTech   = safeArr(cvData.skillsTech);
  const skillsSoft   = safeArr(cvData.skillsSoft);

  const {
    nom           = "",
    prenom        = "",
    email         = "",
    grade         = "",
    bio           = "",
    etablissement = "",
    specialite    = "",
  } = visiteur;

  const fullName = `${prenom} ${nom}`.trim() || "Enseignant";

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 50, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(fullName, 20, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(147, 197, 253);
  doc.text(grade || "Enseignant-Chercheur", 20, 32);

  if (specialite) {
    doc.setFontSize(9.5);
    doc.setTextColor(191, 219, 254);
    doc.text(specialite, 20, 40);
  }

  // Contact (right-aligned in header)
  doc.setFontSize(8.5);
  doc.setTextColor(219, 234, 254);
  let cy = 16;
  if (email)         { doc.text(email,         205, cy, { align: "right" }); cy += 7; }
  if (etablissement) { doc.text(etablissement, 205, cy, { align: "right" }); }

  y = 62;

  // ── Section heading helper ────────────────────────────────────
  const section = (title) => {
    y = checkPage(doc, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 58, 138);
    doc.text(title.toUpperCase(), 20, y);
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.3);
    doc.line(20, y + 2, 190, y + 2);
    y += 9;
  };

  // ── Profil ────────────────────────────────────────────────────
  if (bio) {
    section("Profil");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    const ls = wrap(doc, bio, 170);
    doc.text(ls, 20, y);
    y += ls.length * 5 + 6;
  }

  // ── Enseignements ─────────────────────────────────────────────
  if (cours.length > 0) {
    section("Enseignements");
    cours.forEach((c) => {
      y = checkPage(doc, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      // Use normalised field names from mapToCVData
      const label = [
        `• ${c.titre}`,
        c.type   ? `(${c.type})`   : "",
        c.niveau ? `— ${c.niveau}` : "",
        c.annee  ? `| ${c.annee}`  : "",
      ].filter(Boolean).join(" ");
      const ls = wrap(doc, label, 165);
      doc.text(ls, 22, y);
      y += ls.length * 5 + 2;
    });
    y += 4;
  }

  // ── Publications ──────────────────────────────────────────────
  if (publications.length > 0) {
    section("Publications");
    publications.forEach((p, i) => {
      y = checkPage(doc, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      const label = [
        `[${i + 1}] ${p.titre}`,
        p.annee ? `, ${p.annee}` : "",
        p.revue ? ` — ${p.revue}` : "",
      ].join("");
      const ls = wrap(doc, label, 165);
      doc.text(ls, 22, y);
      y += ls.length * 4.5 + 3;
    });
    y += 3;
  }

  // ── Projets de Recherche ──────────────────────────────────────
  if (projets.length > 0) {
    section("Projets de Recherche");
    projets.forEach((p) => {
      y = checkPage(doc, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 58, 138);
      doc.text(`• ${p.titre}`, 22, y);
      if (p.description) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(8.5);
        const ls = wrap(doc, p.description, 160);
        doc.text(ls, 24, y + 4.5);
        y += ls.length * 4 + 9;
      } else {
        y += 7;
      }
    });
    y += 4;
  }

  // ── Compétences Techniques ────────────────────────────────────
  if (skillsTech.length > 0) {
    section("Compétences Techniques");
    y = renderSkillsTech(doc, skillsTech, 22, 165, y);
    y += 4;
  }

  // ── Compétences Générales ─────────────────────────────────────
  if (skillsSoft.length > 0) {
    section("Compétences Générales");
    y = renderSkillsSoft(doc, skillsSoft, 22, 165, y);
  }

  // ── Footer (every page) ───────────────────────────────────────
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 160);
    doc.text(`${fullName} — CV Académique`, 20, 292);
    doc.text(`${i} / ${total}`, 205, 292, { align: "right" });
  }

  doc.save(`CV_Academique_${fullName.replace(/\s+/g, "_")}.pdf`);
}

// ══════════════════════════════════════════════════════════════
// TEMPLATE 2 — PROFESSIONNEL  (sidebar sombre)
// ══════════════════════════════════════════════════════════════

/**
 * Generate a professional-style CV PDF with a dark sidebar.
 * Accepts the same normalised CVData object as generateAcademicCV().
 */
export function generateProfessionalCV(cvData = {}) {
  // ── Safe destructure ─────────────────────────────────────────
  const visiteur     = cvData.visiteur     || {};
  const cours        = safeArr(cvData.cours);
  const publications = safeArr(cvData.publications);
  const projets      = safeArr(cvData.projets);
  const skillsTech   = safeArr(cvData.skillsTech);
  const skillsSoft   = safeArr(cvData.skillsSoft);

  const {
    nom           = "",
    prenom        = "",
    email         = "",
    grade         = "",
    bio           = "",
    etablissement = "",
    specialite    = "",
  } = visiteur;

  const fullName = `${prenom} ${nom}`.trim() || "Enseignant";
  const initials = `${(prenom || "?")[0]}${(nom || "?")[0]}`.toUpperCase();

  const doc   = new jsPDF({ unit: "mm", format: "a4" });
  const W     = 210;
  const sideW = 65;
  const mainX = sideW + 12;
  const mainW = W - sideW - 18;

  let sideY = 20;
  let mainY = 20;

  // ── Sidebar background ────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, sideW, 297, "F");

  // Avatar circle
  doc.setFillColor(37, 99, 235);
  doc.circle(sideW / 2, 28, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(initials, sideW / 2, 32, { align: "center" });

  // Name + grade
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  const nameLines = wrap(doc, fullName, sideW - 8);
  doc.text(nameLines, sideW / 2, 52, { align: "center" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(96, 165, 250);
  doc.text(
    grade || "Enseignant-Chercheur",
    sideW / 2,
    52 + nameLines.length * 5 + 2,
    { align: "center" }
  );
  sideY = 52 + nameLines.length * 5 + 14;

  // ── Sidebar section heading helper ────────────────────────────
  const sideSection = (title) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text(title, 6, sideY);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.3);
    doc.line(6, sideY + 1.5, sideW - 4, sideY + 1.5);
    sideY += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(7.5);
  };

  // ── Contact ───────────────────────────────────────────────────
  sideSection("CONTACT");
  [email, etablissement].filter(Boolean).forEach((val) => {
    const ls = wrap(doc, val, sideW - 10);
    doc.text(ls, 6, sideY);
    sideY += ls.length * 4.5 + 1.5;
  });
  sideY += 4;

  // ── Spécialité ────────────────────────────────────────────────
  if (specialite) {
    sideSection("SPÉCIALITÉ");
    const ls = wrap(doc, specialite, sideW - 10);
    doc.text(ls, 6, sideY);
    sideY += ls.length * 4.5 + 6;
  }

  // ── Aperçu (stats) ────────────────────────────────────────────
  sideSection("APERÇU");
  [
    { label: "Cours",        val: cours.length        },
    { label: "Publications", val: publications.length  },
    { label: "Projets",      val: projets.length       },
    { label: "Compétences",  val: skillsTech.length + skillsSoft.length },
  ].forEach((s) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225);
    doc.text(`${s.label}:`, 6, sideY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(96, 165, 250);
    doc.text(`${s.val}`, 46, sideY, { align: "right" });
    doc.setFont("helvetica", "normal");
    sideY += 5.5;
  });
  sideY += 4;

  // ── Compétences Techniques in sidebar ────────────────────────
  if (skillsTech.length > 0 && sideY < 230) {
    sideSection("COMPÉTENCES TECH.");

    skillsTech.forEach((s) => {
      if (sideY > 255) return;   // stop before overflow

      const pct   = Math.min(100, Math.max(0, Number(s.pct) || 0));
      const barW  = sideW - 12;  // available bar width (mm)
      const icon  = s.icon && s.icon !== "◆" ? `${s.icon} ` : "";

      // Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(203, 213, 225);
      const labelLines = wrap(doc, `${icon}${s.label}`, sideW - 18);
      doc.text(labelLines, 6, sideY);

      // Percentage (right-aligned on first line)
      doc.setFontSize(7);
      doc.setTextColor(96, 165, 250);
      doc.text(`${pct}%`, sideW - 4, sideY, { align: "right" });

      sideY += labelLines.length * 4;

      // Mini bar — track
      doc.setFillColor(30, 50, 90);
      doc.roundedRect(6, sideY - 1.5, barW, 2.5, 1, 1, "F");
      // Mini bar — fill
      const fillW = Math.max(1.5, (pct / 100) * barW);
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(6, sideY - 1.5, fillW, 2.5, 1, 1, "F");

      sideY += 5;
    });
    sideY += 2;
  }

  // ── Compétences Générales in sidebar (as bullet list) ────────
  if (skillsSoft.length > 0 && sideY < 262) {
    sideSection("COMPÉTENCES SOFT");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(203, 213, 225);

    skillsSoft.forEach((s) => {
      if (sideY > 270) return;
      const icon  = s.icon && s.icon !== "◆" ? `${s.icon} ` : "";
      const ls    = wrap(doc, `• ${icon}${s.label}`, sideW - 10);
      doc.text(ls, 6, sideY);
      sideY += ls.length * 4.5 + 0.5;
    });
  }

  // ── Main area section heading helper ──────────────────────────
  const mainSection = (title) => {
    mainY = checkPage(doc, mainY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 58, 138);
    doc.text(title.toUpperCase(), mainX, mainY);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.4);
    doc.line(mainX, mainY + 1.5, W - 8, mainY + 1.5);
    mainY += 8;
  };

  // ── Profil ────────────────────────────────────────────────────
  if (bio) {
    mainSection("Profil");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const ls = wrap(doc, bio, mainW);
    doc.text(ls, mainX, mainY);
    mainY += ls.length * 4.5 + 6;
  }

  // ── Enseignements ─────────────────────────────────────────────
  if (cours.length > 0) {
    mainSection("Enseignements");
    cours.forEach((c) => {
      mainY = checkPage(doc, mainY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      const label = [
        `• ${c.titre}`,
        c.type   ? `(${c.type})`   : "",
        c.niveau ? `— ${c.niveau}` : "",
      ].filter(Boolean).join(" ");
      const ls = wrap(doc, label, mainW);
      doc.text(ls, mainX + 2, mainY);
      mainY += ls.length * 4.5 + 2;
    });
    mainY += 4;
  }

  // ── Publications ──────────────────────────────────────────────
  if (publications.length > 0) {
    mainSection("Publications");
    publications.forEach((p, i) => {
      mainY = checkPage(doc, mainY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      const label = [
        `[${i + 1}] ${p.titre}`,
        p.annee ? `, ${p.annee}` : "",
        p.revue ? ` — ${p.revue}` : "",
      ].join("");
      const ls = wrap(doc, label, mainW);
      doc.text(ls, mainX + 2, mainY);
      mainY += ls.length * 4 + 3;
    });
    mainY += 2;
  }

  // ── Projets de Recherche ──────────────────────────────────────
  if (projets.length > 0) {
    mainSection("Projets de Recherche");
    projets.forEach((p) => {
      mainY = checkPage(doc, mainY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 58, 138);
      doc.text(`• ${p.titre}`, mainX + 2, mainY);
      if (p.description) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(80, 80, 80);
        const ls = wrap(doc, p.description, mainW - 4);
        doc.text(ls, mainX + 4, mainY + 4.5);
        mainY += ls.length * 4 + 9;
      } else {
        mainY += 7;
      }
    });
    mainY += 4;
  }

  // ── Footer (every page) ───────────────────────────────────────
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text(`${fullName} — CV Professionnel`, mainX, 292);
    doc.text(`${i} / ${total}`, W - 8, 292, { align: "right" });
  }

  doc.save(`CV_Professionnel_${fullName.replace(/\s+/g, "_")}.pdf`);
}