import { useState, useMemo } from "react";
import { getTheme }          from "../../constants/theme";
import { resolveSocialLinks } from "../../utils/linkHelpers";
import { useContactForm }    from "../../hooks/useContactForm";
import { SectionHeader }     from "../ui/SectionHeader";
import { Icons }             from "../ui/Icons";

/**
 * ContactSection — contact form + social/external links panel.
 */
export function ContactSection({ visiteur, liens, dark, lang }) {
  const t = getTheme(dark);
  const { form, sending, status, handleChange, handleSubmit } = useContactForm();

  // Build contact link list: email first, then external liens
  const contactLinks = useMemo(() => {
    const links = [];
    if (visiteur?.email) {
      links.push({ id:"email", titre:"Email", url:`mailto:${visiteur.email}`, iconFn: Icons.mail });
    }
    if (visiteur?.institution) {
      links.push({ id:"inst", titre: visiteur.institution, url: null, iconFn: Icons.mortarboard });
    }
    resolveSocialLinks(liens).forEach((l) => links.push({ ...l, iconFn: l.iconFn }));
    return links;
  }, [visiteur, liens]);

  const inputStyle = {
    padding: "14px 16px", borderRadius: 12,
    border: `1.5px solid ${t.border}`,
    background: t.bgCard, color: t.text, outline: "none",
    width: "100%", fontSize: 14, fontFamily: "inherit",
    transition: "border-color .2s",
  };

  const focusOn  = (e) => (e.target.style.borderColor = "#2563eb");
  const focusOff = (e) => (e.target.style.borderColor = t.border);

  return (
    <section id="contact" style={{ padding: "96px 2rem", background: t.bgSection }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <SectionHeader
          iconFn={Icons.mail}
          title={lang === "fr" ? "Me contacter" : "Contact Me"}
          subtitle={lang === "fr"
            ? "Envoyez-moi un message ou retrouvez-moi sur mes réseaux."
            : "Send a message or find me on my networks."}
          dark={dark}
        />

        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:48 }}>

          {/* ── Form ───────────────────────────────────────── */}
          <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <input
              name="name" placeholder={lang === "fr" ? "Votre nom" : "Your name"}
              value={form.name} onChange={handleChange}
              onFocus={focusOn} onBlur={focusOff}
              style={inputStyle}
            />
            <input
              name="email" type="email" placeholder="Email"
              value={form.email} onChange={handleChange}
              onFocus={focusOn} onBlur={focusOff}
              style={inputStyle}
            />
            <textarea
              name="message" rows={5}
              placeholder={lang === "fr" ? "Votre message…" : "Your message…"}
              value={form.message} onChange={handleChange}
              onFocus={focusOn} onBlur={focusOff}
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <button type="submit" disabled={sending}
              style={{ padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#1e3a8a,#2563eb)",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:"0 4px 18px rgba(37,99,235,.4)",transition:"all .2s",opacity:sending?.7:1 }}
              onMouseEnter={(e) => { if (!sending) e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
              {sending
                ? (lang === "fr" ? "Envoi…"   : "Sending…")
                : (lang === "fr" ? "Envoyer 🚀" : "Send 🚀")}
            </button>

            {status === "success" && (
              <p style={{ color:"#059669",fontSize:13,margin:0 }}>
                ✅ {lang === "fr" ? "Message envoyé avec succès !" : "Message sent successfully!"}
              </p>
            )}
            {status === "error" && (
              <p style={{ color:"#dc2626",fontSize:13,margin:0 }}>
                ❌ {lang === "fr" ? "Erreur. Vérifiez vos informations." : "Error. Please check your info."}
              </p>
            )}
          </form>

          {/* ── Links panel ────────────────────────────────── */}
          <div>
            <h3 style={{ margin:"0 0 20px",fontSize:18,fontWeight:700,color:t.text }}>
              {lang === "fr" ? "Retrouvez-moi sur" : "Find me on"}
            </h3>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {contactLinks.length === 0 && (
                <p style={{ color:t.textMuted,fontSize:14 }}>
                  {lang === "fr" ? "Aucun lien disponible." : "No links available."}
                </p>
              )}
              {contactLinks.map((l) => (
                <ContactLink key={l.id} link={l} dark={dark} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Isolated hover state per link row */
function ContactLink({ link: l, dark, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => l.url && window.open(l.url, "_blank")}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex",alignItems:"center",gap:14,
        padding:"16px 20px", background:t.bgCard,
        borderRadius:14, border:`1.5px solid ${hov && l.url ? t.accent : t.border}`,
        transition:"all .2s",
        transform: hov && l.url ? "translateX(6px)" : "none",
        cursor: l.url ? "pointer" : "default",
        boxShadow: hov && l.url ? "0 6px 20px rgba(37,99,235,.1)" : "none",
      }}>
      <div style={{ width:46,height:46,borderRadius:"50%",background:t.accentDim,border:`1px solid ${t.accentBdr}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
        {l.iconFn(20, dark ? "#60a5fa" : "#1e3a8a")}
      </div>
      <div>
        <div style={{ fontSize:13,color:t.textMuted,marginBottom:2 }}>{l.titre}</div>
        {l.url && (
          <div style={{ fontSize:12,color:t.textMuted,wordBreak:"break-all",opacity:.7 }}>
            {l.url.replace("mailto:","")}
          </div>
        )}
      </div>
    </div>
  );
}