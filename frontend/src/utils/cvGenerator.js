// src/utils/cvGenerator.js
import { jsPDF } from "jspdf";

function wrap(doc, text, maxW) {
  return doc.splitTextToSize(text || "", maxW);
}

function checkPage(doc, y) {
  if (y > 275) { doc.addPage(); return 20; }
  return y;
}

// ══════════════════════════════════════════════════════════════
// TEMPLATE 1 — ACADÉMIQUE (bleu marine classique)
// ══════════════════════════════════════════════════════════════
export function generateAcademicCV(data) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;

  const { nom, prenom, email, etablissement, specialite, grade, bio,
          cours = [], publications = [], projets = [] } = data;

  const fullName = `${prenom || ""} ${nom || ""}`.trim();

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 50, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(fullName || "Nom Prénom", 20, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(147, 197, 253);
  doc.text(grade || "Enseignant-Chercheur", 20, 32);

  if (specialite) {
    doc.setFontSize(9.5);
    doc.setTextColor(191, 219, 254);
    doc.text(specialite, 20, 40);
  }

  // Contact right
  doc.setFontSize(8.5);
  doc.setTextColor(219, 234, 254);
  let cy = 16;
  if (email)         { doc.text(email,         205, cy, { align: "right" }); cy += 7; }
  if (etablissement) { doc.text(etablissement, 205, cy, { align: "right" }); }

  y = 62;

  // ── Section helper ────────────────────────────────────────────
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

  // ── Bio ───────────────────────────────────────────────────────
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
    cours.forEach(c => {
      y = checkPage(doc, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      const txt = `• ${c.intitule || c.titre || ""}${c.type ? ` (${c.type})` : ""}${c.niveau ? ` — ${c.niveau}` : ""}${c.annee_universitaire ? ` | ${c.annee_universitaire}` : ""}`;
      const ls = wrap(doc, txt, 165);
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
      const txt = `[${i + 1}] ${p.titre || ""}${p.annee ? `, ${p.annee}` : ""}${p.revue || p.conference ? ` — ${p.revue || p.conference}` : ""}`;
      const ls = wrap(doc, txt, 165);
      doc.text(ls, 22, y);
      y += ls.length * 4.5 + 3;
    });
    y += 3;
  }

  // ── Projets ───────────────────────────────────────────────────
  if (projets.length > 0) {
    section("Projets de Recherche");
    projets.forEach(p => {
      y = checkPage(doc, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 58, 138);
      doc.text(`• ${p.titre || ""}`, 22, y);
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
  }

  // ── Footer ────────────────────────────────────────────────────
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
// TEMPLATE 2 — PROFESSIONNEL (sidebar sombre)
// ══════════════════════════════════════════════════════════════
export function generateProfessionalCV(data) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const sideW = 65;
  let sideY = 20;
  let mainY = 20;
  const mainX = sideW + 12;
  const mainW = W - sideW - 18;

  const { nom, prenom, email, etablissement, specialite, grade, bio,
          cours = [], publications = [], projets = [] } = data;

  const fullName = `${prenom || ""} ${nom || ""}`.trim();
  const initials = `${(prenom || "?")[0]}${(nom || "?")[0]}`.toUpperCase();

  // ── Sidebar ───────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, sideW, 297, "F");

  // Avatar
  doc.setFillColor(37, 99, 235);
  doc.circle(sideW / 2, 28, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(initials, sideW / 2, 32, { align: "center" });

  // Name
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  const nameLines = wrap(doc, fullName, sideW - 8);
  doc.text(nameLines, sideW / 2, 52, { align: "center" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(96, 165, 250);
  doc.text(grade || "Enseignant-Chercheur", sideW / 2, 52 + nameLines.length * 5 + 2, { align: "center" });
  sideY = 52 + nameLines.length * 5 + 14;

  // Sidebar section
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

  // Contact
  sideSection("CONTACT");
  [email, etablissement].filter(Boolean).forEach(val => {
    const ls = wrap(doc, val, sideW - 10);
    doc.text(ls, 6, sideY);
    sideY += ls.length * 4.5 + 1.5;
  });
  sideY += 4;

  // Spécialité
  if (specialite) {
    sideSection("SPÉCIALITÉ");
    const ls = wrap(doc, specialite, sideW - 10);
    doc.text(ls, 6, sideY);
    sideY += ls.length * 4.5 + 6;
  }

  // Statistiques
  sideSection("APERÇU");
  [
    { label: "Cours",        val: cours.length },
    { label: "Publications", val: publications.length },
    { label: "Projets",      val: projets.length },
  ].forEach(s => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225);
    doc.text(`${s.label}:`, 6, sideY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(96, 165, 250);
    doc.text(`${s.val}`, 40, sideY);
    doc.setFont("helvetica", "normal");
    sideY += 5.5;
  });

  // ── Main area ─────────────────────────────────────────────────
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

  // Bio
  if (bio) {
    mainSection("Profil");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const ls = wrap(doc, bio, mainW);
    doc.text(ls, mainX, mainY);
    mainY += ls.length * 4.5 + 6;
  }

  // Enseignements
  if (cours.length > 0) {
    mainSection("Enseignements");
    cours.forEach(c => {
      mainY = checkPage(doc, mainY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      const txt = `• ${c.intitule || c.titre || ""}${c.type ? ` (${c.type})` : ""}${c.niveau ? ` — ${c.niveau}` : ""}`;
      const ls = wrap(doc, txt, mainW);
      doc.text(ls, mainX + 2, mainY);
      mainY += ls.length * 4.5 + 2;
    });
    mainY += 4;
  }

  // Publications
  if (publications.length > 0) {
    mainSection("Publications");
    publications.forEach((p, i) => {
      mainY = checkPage(doc, mainY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      const txt = `[${i + 1}] ${p.titre || ""}${p.annee ? `, ${p.annee}` : ""}`;
      const ls = wrap(doc, txt, mainW);
      doc.text(ls, mainX + 2, mainY);
      mainY += ls.length * 4 + 3;
    });
    mainY += 2;
  }

  // Projets
  if (projets.length > 0) {
    mainSection("Projets de Recherche");
    projets.forEach(p => {
      mainY = checkPage(doc, mainY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 58, 138);
      doc.text(`• ${p.titre || ""}`, mainX + 2, mainY);
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
  }

  // ── Footer ────────────────────────────────────────────────────
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