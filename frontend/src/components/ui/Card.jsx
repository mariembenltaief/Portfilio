import { useState } from "react";
import { getTheme } from "../../constants/theme";

/**
 * Card — generic hoverable container with border highlight and lift effect.
 * @prop {boolean}  dark
 * @prop {boolean}  hover   — enable hover effect (default true)
 * @prop {object}   style   — additional inline styles
 * @prop {ReactNode} children
 */
export function Card({ dark = false, hover = true, style = {}, children }) {
  const t = getTheme(dark);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        borderRadius: 18,
        padding:      24,
        border:       `1px solid ${hovered ? t.accent : t.border}`,
        background:   t.bgCard,
        transition:   "all 0.25s cubic-bezier(.4,0,.2,1)",
        transform:    hovered ? "translateY(-5px)" : "none",
        boxShadow:    hovered
          ? "0 20px 48px rgba(37,99,235,0.12)"
          : "0 1px 3px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}