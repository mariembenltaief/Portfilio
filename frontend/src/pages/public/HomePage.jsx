// pages/public/HomePage.jsx
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollSpy }     from "../../hooks/useScrollSpy";
import { NAV_IDS }          from "../../constants/nav";

import Navbar  from "../../components/layout/Navbar";
import Footer  from "../../components/layout/Footer";
import { Loader } from "../../components/ui/Loader";

import { HeroSection }         from "../../components/sections/HeroSection";
import { StatsBar }            from "../../components/sections/StatsBar";
import { CoursSection }        from "../../components/sections/CoursSection";
import { ProjetsSection }      from "../../components/sections/ProjetsSection";
import { PublicationsSection } from "../../components/sections/PublicationsSection";
import { RessourcesSection }   from "../../components/sections/RessourcesSection";
import { AProposSection }      from "../../components/sections/AProposSection";
import { BlogSection }         from "../../components/sections/BlogSection";
import { ContactSection }      from "../../components/sections/ContactSection";

const GLOBAL_CSS = `
  @keyframes fadeUp    { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:none } }
  @keyframes floatY    { 0%,100% { transform:translateY(0) }  50% { transform:translateY(-16px) } }
  @keyframes pulseRing { 0%,100% { transform:scale(1) }       50% { transform:scale(1.07) } }
  @keyframes shimmer   { 0%,100% { opacity:.5 }               50% { opacity:1 } }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
`;

export default function HomePage({ dark, lang }) {
  const activeSection = useScrollSpy(NAV_IDS);

  const {
    loading,
    visiteur,
    cours,
    publications,
    projets,
    liens,
    articlesBlog,
    stats,
    socialLinks,
  } = usePortfolioData();

  if (loading) return <Loader dark={dark} />;

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      background: dark ? "#0b1120" : "#f7f9fc",
      color:      dark ? "#e8edf5" : "#0f172a",
    }}>
      <style>{GLOBAL_CSS}</style>

      <HeroSection
        visiteur={visiteur}
        dark={dark}
        lang={lang}
        socialLinks={socialLinks}
        cours={cours}
        publications={publications}
        projets={projets}
      />

      <StatsBar stats={stats} lang={lang} />

      <CoursSection dark={dark} lang={lang} />

      <ProjetsSection      projets={projets}          dark={dark} lang={lang} />
      <PublicationsSection publications={publications} dark={dark} lang={lang} />

      <RessourcesSection cours={cours} dark={dark} lang={lang} />

      <AProposSection visiteur={visiteur} dark={dark} lang={lang} />
      <BlogSection    articlesBlog={articlesBlog}     dark={dark} lang={lang} />

      <ContactSection
        visiteur={visiteur}
        liens={liens}
        dark={dark}
        lang={lang}
      />
    </div>
  );
}