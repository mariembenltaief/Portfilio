import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/public/HomePage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import CourseDetailPage from "./pages/public/CoursesPage.jsx";
import CoursPage from "./pages/public/CoursPage.jsx";
import { getTheme } from "./constants/theme.js";
import ProjetDetailPage from "./pages/public/ProjetDetailPage.jsx";
import PublicationDetailPage from "./pages/public/PublicationDetailPage.jsx";
import BlogDetailPage from "./pages/public/BlogDetailPage.jsx";

export default function App() {
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState("fr");

  const theme = getTheme(dark);

  return (
    <BrowserRouter>
      <div style={{ background: theme.bg, color: theme.text, minHeight: "100vh" }}>

        <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} theme={theme} />

        <Routes>
          <Route path="/"         element={<Home             dark={dark} lang={lang} />} />
          <Route path="/cours"    element={<CoursPage        dark={dark} lang={lang} />} />
          <Route path="/cours/:id" element={<CourseDetailPage dark={dark} lang={lang} />} />
<Route path="/projets/:id" element={<ProjetDetailPage dark={dark} lang={lang} />} />
    <Route path="/publications/:id" element={<PublicationDetailPage dark={dark} lang={lang} />} />
    <Route path="/blog/:id" element={<BlogDetailPage dark={dark} lang={lang}/>}/>
        </Routes>

        <Footer theme={theme} />

      </div>
    </BrowserRouter>
  );
}