import { getTheme } from "../../constants/theme";

/**
 * SectionHeader — centred icon + title + subtitle block used by every section.
 * @prop {Function} iconFn   — Icons.xxx function
 * @prop {string}   title
 * @prop {string}   [subtitle]
 * @prop {boolean}  dark
 */
export function SectionHeader({ iconFn, title, subtitle, dark }) {
  const t = getTheme(dark);
  return (
    <div style={{ textAlign: "center", marginBottom: 56 }}>
      <div style={{
        width: 60, height: 60, borderRadius: 20,
        background: t.accentDim, border: `1px solid ${t.accentBdr}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 18px",
      }}>
        {iconFn(26, dark ? "#60a5fa" : "#1e3a8a")}
      </div>

      <h2 style={{
        margin: "0 0 10px",
        fontSize: "clamp(22px,3vw,30px)",
        fontWeight: 800,
        letterSpacing: -0.8,
        color: t.text,
        fontFamily: "'Playfair Display', Georgia, serif",
      }}>
        {title}
      </h2>

      {subtitle && (
        <p style={{
          margin: 0,
          color: t.textMuted,
          fontSize: 15.5,
          maxWidth: 520,
          marginInline: "auto",
          lineHeight: 1.65,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}