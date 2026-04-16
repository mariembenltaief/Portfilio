// src/components/cv/CVPreview.jsx
import { useMemo } from "react";

// Utility
const safeArray = (val) => (Array.isArray(val) ? val : []);

function Initials({ name }) {
  if (!name) return <span>?</span>;
  const parts = name.trim().split(" ");
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : name.slice(0, 2);
  return <span>{initials.toUpperCase()}</span>;
}

function SectionList({ items, color = "#1e3a8a", dark = false }) {
  const validItems = safeArray(items).filter(Boolean);
  
  if (!validItems.length) {
    return (
      <p style={{ 
        fontSize: 13, 
        color: dark ? "#6b7280" : "#9ca3af",
        fontStyle: "italic",
        margin: "8px 0 16px"
      }}>
        Aucun élément
      </p>
    );
  }
  
  return (
    <ul style={{ listStyle: "none", margin: "0 0 20px", padding: 0 }}>
      {validItems.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <div style={{ 
            width: 4, 
            height: 4, 
            borderRadius: "50%", 
            background: color, 
            flexShrink: 0,
            marginTop: 6 
          }} />
          <span style={{ fontSize: 13, color: dark ? "#e2e8f0" : "#1f2937", lineHeight: 1.4 }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function StatCard({ value, label, dark = false }) {
  return (
    <div style={{
      background: dark ? "rgba(255,255,255,0.07)" : "#f1f5f9",
      borderRadius: 8,
      padding: "10px 12px",
      textAlign: "center",
    }}>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: dark ? "#fff" : "#1e293b" }}>
        {value}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 11, color: dark ? "rgba(255,255,255,0.6)" : "#64748b" }}>
        {label}
      </p>
    </div>
  );
}

export default function CVPreview({ data, template, dark = false }) {
  if (!data) return null;

  // Transform data to expected format for display
  const displayData = useMemo(() => {
    // Extract basic info
const fullName =
  `${data.visiteur?.prenom || ""} ${data.visiteur?.nom || ""}`.trim() ||
  data.fullName ||
  "Nom non renseigné";    const title = data.title || data.grade || data.role || "Enseignant-Chercheur";
    const bio = data.bio || data.summary || data.profile || "";
    
    // Extract arrays safely
    const cours = safeArray(data.cours || data.courses);
    const publications = safeArray(data.publications);
    const projets = safeArray(data.projets || data.projects);
    const education = safeArray(data.education || data.diplomes);
    const experience = safeArray(data.experience);
    
    // Extract skills
    const techSkills = safeArray(data.techSkills || data.skillsTech || data.competences);
    const softSkills = safeArray(data.softSkills || data.skillsSoft);
    
    // Format items for display
    const coursTitres = cours.map(c => {
      const titre = c.title || c.titre || c.intitule;
      const niveau = c.level || c.niveau;
      const annee = c.date || c.annee;
      let result = titre || "Cours";
      if (niveau) result += ` (${niveau})`;
      if (annee) result += ` - ${annee}`;
      return result;
    });
    
    const pubTitres = publications.map(p => {
      const titre = p.title || p.titre;
      const revue = p.venue || p.revue || p.journal;
      const annee = p.date || p.annee;
      let result = titre || "Publication";
      if (revue) result += ` — ${revue}`;
      if (annee) result += ` (${annee})`;
      return result;
    });
    
    const projetsTitres = projets.map(p => {
      const titre = p.title || p.titre;
      const tech = p.technologies || p.tech;
      let result = titre || "Projet";
      if (tech && tech.length) result += ` [${safeArray(tech).join(', ')}]`;
      return result;
    });
    
    const expTitres = experience.map(e => {
      const title = e.title || e.poste;
      const company = e.company || e.entreprise || e.etablissement;
      const date = e.date;
      let result = `${title || 'Poste'} - ${company || 'Entreprise'}`;
      if (date) result += ` (${date})`;
      return result;
    });
    
    const eduTitres = education.map(e => {
      const degree = e.degree || e.intitule || e.diplome;
      const institution = e.institution || e.etablissement || e.university;
      const date = e.date;
      let result = `${degree || 'Diplôme'} - ${institution || 'Établissement'}`;
      if (date) result += ` (${date})`;
      return result;
    });
    
    return {
      fullName,
      title,
      bio,
      email: data.email || "",
      phone: data.phone || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      address: data.address || "",
      coursTitres,
      pubTitres,
      projetsTitres,
      expTitres,
      eduTitres,
      techSkills: techSkills.map(s => typeof s === 'string' ? s : s.label || s.name),
      softSkills: softSkills.map(s => typeof s === 'string' ? s : s.label || s.name),
      totalCourses: cours.length,
      totalPublications: publications.length,
      totalProjects: projets.length,
      totalSkills: techSkills.length + softSkills.length
    };
  }, [data]);

  const {
    fullName,
    title,
    bio,
    email,
    phone,
    linkedin,
    github,
    coursTitres,
    pubTitres,
    projetsTitres,
    expTitres,
    eduTitres,
    techSkills,
    softSkills,
    totalCourses,
    totalPublications,
    totalProjects,
    totalSkills
  } = displayData;

  const allSkills = [...techSkills, ...softSkills];
  
  const stats = [
    { value: totalCourses, label: "Cours" },
    { value: totalPublications, label: "Publications" },
    { value: totalProjects, label: "Projets" },
    { value: totalSkills, label: "Compétences" },
  ];

  // Theme colors based on dark mode
  const theme = {
    bg: dark ? "#0f172a" : "#ffffff",
    headerBg: dark ? "#1e293b" : "#1e3a8a",
    sidebarBg: dark ? "#0f172a" : "#0f172a",
    border: dark ? "#334155" : "#e5e7eb",
    text: dark ? "#f1f5f9" : "#1f2937",
    textMuted: dark ? "#94a3b8" : "#6b7280",
    textLight: dark ? "#cbd5e1" : "#374151",
    bioBg: dark ? "#1e293b" : "#f8fafc",
  };

  // ═══════════════════════════════════════════════
  // 🎓 ACADEMIC TEMPLATE
  // ═══════════════════════════════════════════════
  if (template === "academic") {
    return (
      <div style={{ 
        fontFamily: "system-ui, -apple-system, sans-serif", 
        maxWidth: 720, 
        margin: "0 auto", 
        border: `1px solid ${theme.border}`, 
        borderRadius: 12, 
        overflow: "hidden",
        background: theme.bg,
        color: theme.text,
      }}>
        
        {/* Header */}
        <div style={{ background: theme.headerBg, padding: "28px 32px 24px" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 12,
          }}>
            <Initials name={fullName} />
          </div>
          <h1 style={{ margin: 0, fontSize: 22, color: "#fff", fontWeight: 600 }}>
            {fullName}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            {title}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 32px" }}>
          
          {bio && (
            <div style={{ 
              background: theme.bioBg, 
              borderRadius: 8,
              padding: "12px 16px", 
              marginBottom: 20,
              fontSize: 13, 
              color: theme.textLight, 
              lineHeight: 1.6,
              border: dark ? `1px solid ${theme.border}` : "none",
            }}>
              {bio}
            </div>
          )}

          {eduTitres.length > 0 && (
            <>
              <p style={{ 
                margin: "0 0 8px", 
                fontSize: 11, 
                fontWeight: 600,
                letterSpacing: "0.08em", 
                color: theme.textMuted, 
                textTransform: "uppercase",
              }}>
                Formation
              </p>
              <SectionList items={eduTitres} color={theme.headerBg} dark={dark} />
            </>
          )}

          {expTitres.length > 0 && (
            <>
              <p style={{ 
                margin: "16px 0 8px", 
                fontSize: 11, 
                fontWeight: 600,
                letterSpacing: "0.08em", 
                color: theme.textMuted, 
                textTransform: "uppercase",
              }}>
                Expérience
              </p>
              <SectionList items={expTitres} color={theme.headerBg} dark={dark} />
            </>
          )}

          {techSkills.length > 0 && (
            <>
              <p style={{ 
                margin: "16px 0 8px", 
                fontSize: 11, 
                fontWeight: 600,
                letterSpacing: "0.08em", 
                color: theme.textMuted, 
                textTransform: "uppercase",
              }}>
                Compétences techniques
              </p>
              <SectionList items={techSkills} color={theme.headerBg} dark={dark} />
            </>
          )}

          {coursTitres.length > 0 && (
            <>
              <p style={{ 
                margin: "16px 0 8px", 
                fontSize: 11, 
                fontWeight: 600,
                letterSpacing: "0.08em", 
                color: theme.textMuted, 
                textTransform: "uppercase",
              }}>
                Enseignements
              </p>
              <SectionList items={coursTitres} color={theme.headerBg} dark={dark} />
            </>
          )}

          {pubTitres.length > 0 && (
            <>
              <p style={{ 
                margin: "16px 0 8px", 
                fontSize: 11, 
                fontWeight: 600,
                letterSpacing: "0.08em", 
                color: theme.textMuted, 
                textTransform: "uppercase",
              }}>
                Publications
              </p>
              <SectionList items={pubTitres} color={theme.headerBg} dark={dark} />
            </>
          )}

          {projetsTitres.length > 0 && (
            <>
              <p style={{ 
                margin: "16px 0 8px", 
                fontSize: 11, 
                fontWeight: 600,
                letterSpacing: "0.08em", 
                color: theme.textMuted, 
                textTransform: "uppercase",
              }}>
                Projets
              </p>
              <SectionList items={projetsTitres} color={theme.headerBg} dark={dark} />
            </>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // 💼 PROFESSIONAL TEMPLATE
  // ═══════════════════════════════════════════════
  return (
    <div style={{ 
      display: "flex", 
      maxWidth: 800, 
      margin: "0 auto", 
      border: `1px solid ${theme.border}`, 
      borderRadius: 12, 
      overflow: "hidden",
      background: theme.bg,
    }}>
      
      {/* Sidebar */}
      <div style={{ width: 220, background: theme.sidebarBg, padding: "24px 18px" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 12,
        }}>
          <Initials name={fullName} />
        </div>

        <h2 style={{ color: "#fff", fontSize: 16, margin: "0 0 4px", fontWeight: 600 }}>
          {fullName.split(" ")[0]}
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>
          {title}
        </p>

        {/* Contact */}
        {[email, phone, linkedin, github].some(Boolean) && (
          <div style={{ marginTop: 20 }}>
            <p style={{ 
              margin: "0 0 8px", 
              fontSize: 11, 
              fontWeight: 600,
              letterSpacing: "0.08em", 
              color: "#94a3b8", 
              textTransform: "uppercase",
            }}>
              Contact
            </p>
            <SectionList 
              items={[email, phone, linkedin, github].filter(Boolean)} 
              color="#60a5fa"
              dark={true}
            />
          </div>
        )}

        {/* Skills */}
        {allSkills.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ 
              margin: "0 0 8px", 
              fontSize: 11, 
              fontWeight: 600,
              letterSpacing: "0.08em", 
              color: "#94a3b8", 
              textTransform: "uppercase",
            }}>
              Compétences
            </p>
            <SectionList items={allSkills} color="#60a5fa" dark={true} />
          </div>
        )}

        {/* Stats */}
        <div style={{ marginTop: 20 }}>
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} dark={true} />
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "24px 28px" }}>
        
        {bio && (
          <div style={{ 
            background: theme.bioBg, 
            borderRadius: 8,
            padding: "12px 16px", 
            marginBottom: 20,
            fontSize: 13, 
            color: theme.textLight, 
            lineHeight: 1.6,
            border: dark ? `1px solid ${theme.border}` : "none",
          }}>
            {bio}
          </div>
        )}

        {expTitres.length > 0 && (
          <>
            <p style={{ 
              margin: "0 0 8px", 
              fontSize: 11, 
              fontWeight: 600,
              letterSpacing: "0.08em", 
              color: theme.textMuted, 
              textTransform: "uppercase",
            }}>
              Expérience
            </p>
            <SectionList items={expTitres} color={theme.headerBg} dark={dark} />
          </>
        )}

        {projetsTitres.length > 0 && (
          <>
            <p style={{ 
              margin: "16px 0 8px", 
              fontSize: 11, 
              fontWeight: 600,
              letterSpacing: "0.08em", 
              color: theme.textMuted, 
              textTransform: "uppercase",
            }}>
              Projets
            </p>
            <SectionList items={projetsTitres} color={theme.headerBg} dark={dark} />
          </>
        )}

        {eduTitres.length > 0 && (
          <>
            <p style={{ 
              margin: "16px 0 8px", 
              fontSize: 11, 
              fontWeight: 600,
              letterSpacing: "0.08em", 
              color: theme.textMuted, 
              textTransform: "uppercase",
            }}>
              Formation
            </p>
            <SectionList items={eduTitres} color={theme.headerBg} dark={dark} />
          </>
        )}

        {pubTitres.length > 0 && (
          <>
            <p style={{ 
              margin: "16px 0 8px", 
              fontSize: 11, 
              fontWeight: 600,
              letterSpacing: "0.08em", 
              color: theme.textMuted, 
              textTransform: "uppercase",
            }}>
              Publications
            </p>
            <SectionList items={pubTitres} color={theme.headerBg} dark={dark} />
          </>
        )}
      </div>
    </div>
  );
}