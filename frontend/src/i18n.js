// ─── Central translations for the entire site ────────────────
// Usage:
//   import { useTranslation } from "@/i18n";
//   const { t, lang, setLang } = useTranslation();
//
// Or just import the raw object:
//   import translations from "@/i18n";

import { useState, useEffect, createContext, useContext } from "react";

const translations = {
  fr: {
    // ── Navbar ──────────────────────────────────────────────
    nav: {
      home:               "Accueil",
      courses:            "Cours",
      publications:       "Publications",
      projects:           "Projets",
      blog:               "Blog",
      dashboard:          "Tableau de bord",
      manage:             "Gérer",
      manageCourses:      "Cours",
      managePublications: "Publications",
      manageProjects:     "Projets",
      manageBlog:         "Blog",
      manageLinks:        "Liens externes",
      uploadResource:     "Uploader ressource",
      logout:             "Déconnexion",
      adminBadge:         "Admin",
      menuOpen:           "Ouvrir le menu",
      menuClose:          "Fermer le menu",
    },

    // ── Home ────────────────────────────────────────────────
    home: {
      greeting:           "Bonjour, je suis",
      role:               "Enseignante-Chercheuse",
      bio:                "Spécialisée en informatique et systèmes intelligents. Je partage mes travaux de recherche, mes cours et mes projets académiques.",
      ctaPrimary:         "Voir les publications",
      ctaSecondary:       "Me contacter",
      statsPublications:  "Publications",
      statsCourses:       "Cours",
      statsProjects:      "Projets",
      statsYears:         "Ans d'expérience",
      sectionPublications:"Publications récentes",
      sectionCourses:     "Cours",
      sectionProjects:    "Projets",
      viewAll:            "Voir tout",
      contactTitle:       "Travaillons ensemble",
      contactDesc:        "Vous souhaitez collaborer sur un projet ou en savoir plus sur mes recherches ?",
      contactBtn:         "Envoyer un message",
      statusActive:       "En cours",
      statusPublished:    "Publié",
    },
  },

  en: {
    // ── Navbar ──────────────────────────────────────────────
    nav: {
      home:               "Home",
      courses:            "Courses",
      publications:       "Publications",
      projects:           "Projects",
      blog:               "Blog",
      dashboard:          "Dashboard",
      manage:             "Manage",
      manageCourses:      "Courses",
      managePublications: "Publications",
      manageProjects:     "Projects",
      manageBlog:         "Blog",
      manageLinks:        "External Links",
      uploadResource:     "Upload Resource",
      logout:             "Logout",
      adminBadge:         "Admin",
      menuOpen:           "Open menu",
      menuClose:          "Close menu",
    },

    // ── Home ────────────────────────────────────────────────
    home: {
      greeting:           "Hello, I'm",
      role:               "Lecturer & Researcher",
      bio:                "Specializing in computer science and intelligent systems. I share my research, courses and academic projects.",
      ctaPrimary:         "View publications",
      ctaSecondary:       "Contact me",
      statsPublications:  "Publications",
      statsCourses:       "Courses",
      statsProjects:      "Projects",
      statsYears:         "Years of experience",
      sectionPublications:"Recent publications",
      sectionCourses:     "Courses",
      sectionProjects:    "Projects",
      viewAll:            "View all",
      contactTitle:       "Let's work together",
      contactDesc:        "Want to collaborate on a project or learn more about my research?",
      contactBtn:         "Send a message",
      statusActive:       "Active",
      statusPublished:    "Published",
    },
  },
};

export default translations;

// ─── Context ──────────────────────────────────────────────────
export const LangContext = createContext({ lang: "fr", setLang: () => {} });
export const useLang = () => useContext(LangContext);

// ─── Hook ─────────────────────────────────────────────────────
// Returns { lang, setLang, t } where t = translations[lang]
export function useTranslation() {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("lang") || "fr";
    return "fr";
  });

  const setLang = (next) => {
    localStorage.setItem("lang", next);
    setLangState(next);
    // Notify other components that read localStorage directly
    window.dispatchEvent(new StorageEvent("storage", { key: "lang", newValue: next }));
  };

  // Sync when another component changes lang (e.g. Navbar toggle)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "lang" && e.newValue) setLangState(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { lang, setLang, t: translations[lang] };
}