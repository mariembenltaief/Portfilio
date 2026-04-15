import { getTheme }      from "../../constants/theme";
import { Icons }         from "../ui/Icons";
import { scrollToSection, getInitials } from "../../utils/formatters";

export function HeroSection({ visiteur, dark, lang, socialLinks }) {
  const t = getTheme(dark);

  const nom      = visiteur?.prenom || visiteur?.nom || "Enseignant";
  const titre    = visiteur?.grade || visiteur?.titre || (lang === "fr" ? "Enseignant-Chercheur" : "Teacher-Researcher");
  const bio      = visiteur?.bio   || visiteur?.description || "";
  const photo    = visiteur?.photo || visiteur?.photo_url   || null;
  const initials = getInitials(visiteur);

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "90px 2rem 70px", position: "relative", overflow: "hidden",
      background: dark
        ? "radial-gradient(ellipse 80% 60% at 60% 40%,rgba(37,99,235,.06) 0%,transparent 60%),#0b1120"
        : "radial-gradient(ellipse 80% 60% at 60% 40%,rgba(37,99,235,.06) 0%,transparent 60%),#f7f9fc",
    }}>
      {/* Decorative blobs */}
      <div style={{ position:"absolute",top:80,right:"12%",width:420,height:420,borderRadius:"50%",background:dark?"rgba(37,99,235,.04)":"rgba(37,99,235,.05)",filter:"blur(48px)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:60,left:"8%",width:300,height:300,borderRadius:"50%",background:dark?"rgba(96,165,250,.03)":"rgba(147,197,253,.15)",filter:"blur(40px)",pointerEvents:"none" }}/>

      <div style={{ maxWidth:1180,margin:"0 auto",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:64,flexWrap:"wrap" }}>
        {/* Text block */}
        <div style={{ flex:1,minWidth:290,animation:"fadeUp .7s ease both" }}>
          {/* Titre badge */}
          <div style={{ display:"inline-flex",alignItems:"center",gap:7,background:t.accentDim,border:`1px solid ${t.accentBdr}`,borderRadius:24,padding:"7px 16px",marginBottom:28 }}>
            {Icons.sparkles(12,dark?"#60a5fa":"#2563eb")}
            <span style={{ fontSize:12.5,color:dark?"#60a5fa":"#2563eb",fontWeight:700,letterSpacing:".04em" }}>{titre}</span>
          </div>

          <h1 style={{ margin:"0 0 6px",fontSize:"clamp(1.9rem,4vw,3rem)",fontWeight:300,color:t.textMuted,fontFamily:"'Playfair Display',Georgia,serif" }}>
            {lang === "fr" ? "Bonjour, je suis" : "Hello, I am"}
          </h1>
          <h1 style={{ margin:"0 0 26px",fontSize:"clamp(2.2rem,4.5vw,3.4rem)",fontWeight:900,letterSpacing:-1.5,background:"linear-gradient(125deg,#1e3a8a,#2563eb,#60a5fa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Playfair Display',Georgia,serif" }}>
            {nom} 👋
          </h1>

          {bio && <p style={{ fontSize:16,color:t.textMuted,lineHeight:1.85,maxWidth:500,marginBottom:32 }}>{bio}</p>}

          {/* Social icons */}
          {socialLinks.length > 0 && (
            <div style={{ display:"flex",gap:10,marginBottom:36,flexWrap:"wrap" }}>
              {socialLinks.map((l) => (
                <a key={l.id} href={l.href} target="_blank" rel="noreferrer" title={l.titre}
                  style={{ width:44,height:44,borderRadius:"50%",border:`1.5px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",textDecoration:"none",transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#2563eb";e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.transform="none";}}>
                  {l.iconFn(17,dark?"#94a3b8":"#475569")}
                </a>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            <button onClick={() => scrollToSection("contact")} style={{ background:"linear-gradient(135deg,#1e3a8a,#2563eb)",color:"#fff",border:"none",borderRadius:12,padding:"13px 28px",fontSize:14.5,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(37,99,235,.4)",display:"flex",alignItems:"center",gap:8,transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(37,99,235,.5)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 20px rgba(37,99,235,.4)";}}>
              {Icons.mail(16,"#fff")} {lang==="fr"?"Me contacter":"Contact me"}
            </button>
            <button onClick={() => scrollToSection("cours")} style={{ background:"transparent",color:dark?"#93c5fd":"#1e3a8a",border:`1.5px solid ${dark?"rgba(37,99,235,.4)":"rgba(30,58,138,.25)"}`,borderRadius:12,padding:"13px 28px",fontSize:14.5,fontWeight:700,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:8 }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#2563eb";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?"rgba(37,99,235,.4)":"rgba(30,58,138,.25)";e.currentTarget.style.transform="none";}}>
              {Icons.book(16,"currentColor")} {lang==="fr"?"Mes cours":"My courses"}
            </button>
          </div>
        </div>

        {/* Avatar */}
        <div style={{ position:"relative",flexShrink:0,animation:"floatY 5s ease-in-out infinite" }}>
          <div style={{ width:300,height:300,borderRadius:"50%",background:dark?"rgba(37,99,235,.05)":"rgba(30,58,138,.05)",border:`2px solid ${dark?"rgba(37,99,235,.2)":"rgba(30,58,138,.12)"}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxShadow:dark?"0 0 0 12px rgba(37,99,235,.04),0 0 0 24px rgba(37,99,235,.02)":"0 0 0 12px rgba(30,58,138,.04),0 0 0 24px rgba(30,58,138,.02)" }}>
            {photo
              ? <img src={photo} alt={nom} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
              : <span style={{ fontSize:88,fontWeight:900,color:dark?"rgba(96,165,250,.2)":"rgba(30,58,138,.12)",userSelect:"none" }}>{initials}</span>
            }
          </div>
          <div style={{ position:"absolute",bottom:16,right:0,width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#1e3a8a,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:15,border:`3px solid ${dark?"#0b1120":"#f7f9fc"}`,boxShadow:"0 6px 20px rgba(37,99,235,.5)",animation:"pulseRing 2.5s ease-in-out infinite" }}>{initials}</div>
        </div>
      </div>

      {/* Scroll hint */}
      <div onClick={() => scrollToSection("cours")} style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,color:t.textMuted,fontSize:11,letterSpacing:".06em",opacity:.6,animation:"shimmer 2s ease-in-out infinite",cursor:"pointer" }}>
        <span>{lang==="fr"?"Défiler":"Scroll"}</span>
        {Icons.chevDown(16,"currentColor")}
      </div>
    </section>
  );
}