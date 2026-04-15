// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/public/HomePage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import CourseDetailPage from "./pages/public/CoursesPage.jsx";
import CoursPage from "./pages/public/CoursPage.jsx";
import { getTheme } from "./constants/theme.js";
import { usePortfolioData } from "./hooks/usePortfolioData.js";
import ProjetDetailPage from "./pages/public/ProjetDetailPage.jsx";
import PublicationDetailPage from "./pages/public/PublicationDetailPage.jsx";
import BlogDetailPage from "./pages/public/BlogDetailPage.jsx";
import ProjetsPage from "./pages/public/ProjetsPage.jsx";


export default function App() {
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState("fr");

  const theme = getTheme(dark);

  // ✅ Fetch les données ici pour les partager avec toutes les pages
  const { visiteur ,socialLinks} = usePortfolioData();

  return (
    <BrowserRouter>
      <div style={{ background: theme.bg, color: theme.text, minHeight: "100vh" }}>

        {/* ✅ visiteur passé au Navbar depuis App.jsx */}
        <Navbar
          dark={dark}
          setDark={setDark}
          lang={lang}
          setLang={setLang}
          theme={theme}
          visiteur={visiteur} 
        />

        <Routes>
          <Route path="/"          element={<Home             dark={dark} lang={lang} />} />
          <Route path="/cours"     element={<CoursPage        dark={dark} lang={lang} />} />
          <Route path="/cours/:id" element={<CourseDetailPage dark={dark} lang={lang} />} />
          <Route path="/projets/:id" element={<ProjetDetailPage dark={dark} lang={lang} />} />
    <Route path="/publications/:id" element={<PublicationDetailPage dark={dark} lang={lang} />} />
    <Route path="/blog/:id" element={<BlogDetailPage dark={dark} lang={lang}/>}/>
    import ProjetsPage from "./pages/public/ProjetsPage";

// dans les routes :
<Route path="/projets" element={<ProjetsPage dark={dark} lang={lang} />} />
        </Routes>

        <Footer
          dark={dark}
          lang={lang}
          visiteur={visiteur}        
          socialLinks={socialLinks}  
          theme={theme}
        />

      </div>
    </BrowserRouter>
  );
}