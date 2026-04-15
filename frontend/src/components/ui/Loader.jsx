/**
 * Loader — full-viewport centred spinner shown while data loads.
 */
export function Loader({ dark = false }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100vh", gap: 18,
      background: dark ? "#0b1120" : "#f7f9fc",
    }}>
      <div style={{
        width: 48, height: 48,
        border: `3px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(37,99,235,0.1)"}`,
        borderTopColor: "#2563eb",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ color: "#64748b", margin: 0, fontSize: 14, letterSpacing: "0.05em" }}>
        Chargement…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}