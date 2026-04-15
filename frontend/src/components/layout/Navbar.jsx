import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_IDS, NAV_LABELS } from "../../constants/nav";
import { useScrolled } from "../../hooks/useScrolled";
import { getInitials } from "../../utils/formatters";
import { Icons } from "../ui/Icons";

export default function Navbar({ dark, setDark, lang, setLang, visiteur, theme = {} }) {
  const ACCENT = theme?.accent ?? "#2563eb";

  const scrolled = useScrolled();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenu] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_IDS[0]);
  const [isMobile, setIsMobile] = useState(false);

  const isScrollingRef = useRef(false);
  const timeoutRef = useRef(null);

  const safeLang = NAV_LABELS[lang] ? lang : "fr";
  const labels = NAV_LABELS[safeLang];

  const initials = getInitials(visiteur);
  const fullName = `Pr. ${(visiteur?.nom || "BENALI").toUpperCase()}`;
  const firstName = visiteur?.prenom || "AMIR";

  // ───────────────────────────────
  // Detect mobile
  // ───────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ───────────────────────────────
  // Scroll helper
  // ───────────────────────────────
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ───────────────────────────────
  // NAV HANDLER
  // ───────────────────────────────
  const handleNav = useCallback((id) => {
    setMenu(false);
    setActiveSection(id);

    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => scrollToId(id), 300);
      return;
    }

    isScrollingRef.current = true;
    scrollToId(id);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, [location, navigate]);

  // ───────────────────────────────
  // Scroll spy
  // ───────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const sections = NAV_IDS.map(id => ({
        id,
        el: document.getElementById(id)
      })).filter(s => s.el);

      let current = NAV_IDS[0];
      let min = Infinity;

      sections.forEach(({ id, el }) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top);

        if (dist < min && rect.top < 200) {
          min = dist;
          current = id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .nb-link { transition: all .2s; }
        .nb-link:hover { color:${ACCENT}; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: scrolled ? (dark ? "#0b1120" : "#fff") : "transparent",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,.08)" : "none",
        transition: "all 0.3s ease",
      }}>

        {/* LOGO */}
        <button onClick={() => handleNav("hero")} style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          cursor: "pointer"
        }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: ACCENT,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700
          }}>
            {initials}
          </div>

          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{fullName}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>{firstName}</div>
          </div>
        </button>

        {/* LINKS → PC ONLY */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 10 }}>
            {labels.map((label, i) => {
              const id = NAV_IDS[i];
              const active = activeSection === id;

              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className="nb-link"
                  style={{
                    background: active ? ACCENT : "transparent",
                    color: active ? "#fff" : "#64748b",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    fontSize: 13.5,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* CONTROLS */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>

          <button onClick={() => setLang(l => l === "fr" ? "en" : "fr")} style={{
            background: "transparent",
            border: "1px solid rgba(0,0,0,.1)",
            borderRadius: 6,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}>
            {lang.toUpperCase()}
          </button>

          <button onClick={() => setDark(d => !d)} style={{
            background: "transparent",
            border: "1px solid rgba(0,0,0,.1)",
            borderRadius: 6,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 16,
          }}>
            {dark ? "🌙" : "☀️"}
          </button>

          {/* HAMBURGER → MOBILE ONLY */}
          {isMobile && (
            <button
              onClick={() => setMenu(m => !m)}
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,.1)",
                borderRadius: 8,
                padding: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {menuOpen ? Icons?.close?.(20) || "✕" : Icons?.menu?.(20) || "☰"}
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && isMobile && (
        <div style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          zIndex: 999,
          background: dark ? "#0b1120" : "#fff",
          borderBottom: "1px solid rgba(0,0,0,.08)",
          boxShadow: "0 4px 12px rgba(0,0,0,.1)",
          display: "flex",
          flexDirection: "column",
          padding: 12,
          gap: 6,
          animation: "slideDown 0.2s ease",
        }}>
          <style>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          {labels.map((label, i) => {
            const id = NAV_IDS[i];
            const active = activeSection === id;

            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: active ? ACCENT : "transparent",
                  color: active ? "#fff" : "#64748b",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}