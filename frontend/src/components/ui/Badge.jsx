import { BADGE_COLORS, TYPE_BADGE_MAP } from "../../constants/theme";

/**
 * Badge — small colored label chip.
 * @prop {string}  label
 * @prop {string}  color  — key of BADGE_COLORS  (default "slate")
 * @prop {boolean} dark
 */
export function Badge({ label, color = "slate", dark = false }) {
  const preset = BADGE_COLORS[color] ?? BADGE_COLORS.slate;
  return (
    <span style={{
      background:   preset.bg(dark),
      color:        preset.text(dark),
      fontSize:     11,
      fontWeight:   700,
      borderRadius: 6,
      padding:      "3px 9px",
      letterSpacing: "0.03em",
      whiteSpace:   "nowrap",
    }}>
      {label}
    </span>
  );
}

/**
 * TypeBadge — quick shortcut for CM / TD / TP course types.
 */
export function TypeBadge({ type }) {
  const color = TYPE_BADGE_MAP[type] ?? "slate";
  return <Badge label={type || "—"} color={color} />;
}