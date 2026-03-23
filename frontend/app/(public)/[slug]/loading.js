// app/(public)/[slug]/loading.js
export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ color: "#999", fontSize: "14px" }}>Chargement...</p>
    </div>
  );
}
