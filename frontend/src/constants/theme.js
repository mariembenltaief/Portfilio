// ─── Design Tokens ────────────────────────────────────────────
export const ACCENT = "#2563eb";

export const getTheme = (dark) => ({
  bg:         dark ? "#0b1120"                    : "#f7f9fc",
  bgCard:     dark ? "#151f35"                    : "#ffffff",
  bgSection:  dark ? "#101828"                    : "#eef2f9",
  border:     dark ? "rgba(255,255,255,0.07)"     : "rgba(15,23,42,0.07)",
  text:       dark ? "#e8edf5"                    : "#0f172a",
  textMuted:  dark ? "#8b9dc3"                    : "#64748b",
  accent:     ACCENT,
  accentDim:  dark ? "rgba(37,99,235,0.14)"       : "rgba(37,99,235,0.08)",
  accentBdr:  dark ? "rgba(37,99,235,0.30)"       : "rgba(37,99,235,0.18)",
});

/** Badge color presets */
export const BADGE_COLORS = {
  blue:    { bg: (dark) => dark ? "rgba(37,99,235,0.15)"  : "#dbeafe", text: (dark) => dark ? "#93c5fd" : "#1d4ed8" },
  green:   { bg: (dark) => dark ? "rgba(5,150,105,0.15)"  : "#d1fae5", text: (dark) => dark ? "#6ee7b7" : "#065f46" },
  amber:   { bg: (dark) => dark ? "rgba(245,158,11,0.15)" : "#fef3c7", text: (dark) => dark ? "#fcd34d" : "#92400e" },
  slate:   { bg: (dark) => dark ? "rgba(100,116,139,0.2)" : "#f1f5f9", text: (dark) => dark ? "#94a3b8" : "#475569" },
  navy:    { bg: () => "#1e3a8a",  text: () => "#fff" },
  cyan:    { bg: () => "#0891b2",  text: () => "#fff" },
  emerald: { bg: () => "#059669",  text: () => "#fff" },
};

/** Map cours type → badge color key */
export const TYPE_BADGE_MAP = { CM: "navy", TD: "cyan", TP: "emerald" };