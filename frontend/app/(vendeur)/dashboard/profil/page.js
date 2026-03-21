"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, saveSession } from "../../../../lib/auth";
import api from "../../../../lib/api";
import { THEMES, DEFAULT_THEME } from "../../../../lib/themes";

/* ══════════════════════════════════════════════════════════════
   ThemePickerModal — INCHANGÉ
══════════════════════════════════════════════════════════════ */
function ThemePickerModal({ localTheme, setLocalTheme }) {
  const [open, setOpen] = useState(false);
  const themes = Object.values(THEMES);
  const current = THEMES[localTheme] || themes[0];

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .tpm-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 9px 14px;
          border-radius: 8px;
          border: 1px solid #e2e2e2;
          background: #fafafa;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: #2a2a2a;
          transition: box-shadow .15s, border-color .15s, background .15s;
          user-select: none;
        }
        .tpm-btn:hover {
          background: #fff;
          border-color: #c8c8c8;
          box-shadow: 0 2px 10px rgba(0,0,0,.07);
        }
        .tpm-btn-dots { display: flex; gap: 4px; }
        .tpm-btn-dot  { width: 11px; height: 11px; border-radius: 50%; transition: transform .2s; }
        .tpm-btn:hover .tpm-btn-dot { transform: scale(1.2); }

        .tpm-overlay {
          position: fixed; inset: 0;
          background: rgba(10,10,10,.46);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 1000;
          animation: tpm-fog .2s ease forwards;
        }
        @keyframes tpm-fog { from { opacity: 0 } to { opacity: 1 } }

        .tpm-close {
          width: 28px; height: 28px; border-radius: 7px;
          border: 1px solid #ececec; background: transparent;
          cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #aaa; transition: background .12s, color .12s;
        }
        .tpm-close:hover { background: #f3f3f3; color: #333; }

        .tpm-apply {
          border: none; border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: #fff;
          cursor: pointer;
          transition: opacity .15s, transform .15s;
        }
        .tpm-apply:hover { opacity: .87; transform: translateY(-1px); }

        .tpm-sheet {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 70vh; max-height: 530px;
          background: #fff;
          border-radius: 20px 20px 0 0;
          z-index: 1001;
          display: flex; flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          animation: tpm-rise .3s cubic-bezier(.32,1.4,.6,1) forwards;
        }
        @keyframes tpm-rise {
          from { transform: translateY(100%); opacity: 0 }
          to   { transform: translateY(0);    opacity: 1 }
        }

        .tpm-sheet-drag {
          flex-shrink: 0; padding: 12px 0 0;
          display: flex; justify-content: center;
        }
        .tpm-drag-pill {
          width: 36px; height: 4px;
          border-radius: 2px; background: #e0e0e0;
        }

        .tpm-sheet-head {
          flex-shrink: 0;
          padding: 12px 18px 13px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #f0f0f0;
        }
        .tpm-sheet-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700; color: #111;
        }
        .tpm-sheet-sub { font-size: 11px; color: #bbb; margin-top: 2px; }

        .tpm-sheet-body {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 14px 14px 0;
          -webkit-overflow-scrolling: touch;
        }
        .tpm-sheet-body::-webkit-scrollbar { width: 3px; }
        .tpm-sheet-body::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

        .tpm-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
        }

        .tpm-card {
          border-radius: 10px;
          padding: 11px 10px 10px;
          cursor: pointer;
          border: 2px solid transparent;
          position: relative;
          transition: transform .15s, box-shadow .15s;
          outline: 1.5px solid rgba(0,0,0,.06);
        }
        .tpm-card:hover  { transform: translateY(-2px); box-shadow: 0 5px 16px rgba(0,0,0,.1); }
        .tpm-card.active { outline: none; }

        .tpm-card-dots  { display: flex; gap: 4px; margin-bottom: 8px; }
        .tpm-dot        { width: 13px; height: 13px; border-radius: 50%; }
        .tpm-card-name  { font-size: 12px; font-weight: 600; line-height: 1.3; }
        .tpm-card-style { font-size: 10px; margin-top: 1px; opacity: .65; }
        .tpm-card-check {
          position: absolute; top: 8px; right: 8px;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        .tpm-sheet-foot {
          flex-shrink: 0;
          padding: 13px 16px 20px;
          border-top: 1px solid #f0f0f0;
          background: #fff;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .tpm-foot-label { font-size: 11px; color: #bbb; }
        .tpm-foot-name  { font-size: 13px; font-weight: 600; color: #111; margin-top: 1px; }

        .tpm-panel {
          position: fixed;
          top: 50%; right: 0;
          transform: translateY(-50%);
          width: 290px;
          height: 65vh; max-height: 560px;
          background: #fff;
          border-radius: 16px 0 0 16px;
          z-index: 1001;
          display: flex; flex-direction: column;
          box-shadow: -6px 0 36px rgba(0,0,0,.13);
          font-family: 'DM Sans', sans-serif;
          animation: tpm-slide-in .3s cubic-bezier(.32,1.3,.6,1) forwards;
        }
        @keyframes tpm-slide-in {
          from { transform: translateY(-50%) translateX(100%); opacity: 0 }
          to   { transform: translateY(-50%) translateX(0);    opacity: 1 }
        }

        .tpm-panel-head {
          flex-shrink: 0;
          padding: 22px 18px 16px;
          border-bottom: 1px solid #f0f0f0;
          display: flex; align-items: flex-start; justify-content: space-between;
        }
        .tpm-panel-title {
          font-family: 'Syne', sans-serif;
          font-size: 19px; font-weight: 700; color: #111; line-height: 1.15;
        }
        .tpm-panel-sub { font-size: 11px; color: #bbb; margin-top: 4px; }

        .tpm-panel-body {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 12px 12px 0;
        }
        .tpm-panel-body::-webkit-scrollbar { width: 3px; }
        .tpm-panel-body::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

        .tpm-list { display: flex; flex-direction: column; gap: 6px; }

        .tpm-row {
          display: flex; align-items: center; gap: 11px;
          border-radius: 10px;
          padding: 10px 12px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: background .12s, border-color .12s, box-shadow .12s;
          outline: 1.5px solid rgba(0,0,0,.06);
        }
        .tpm-row:hover  { background: rgba(0,0,0,.02); box-shadow: 0 2px 8px rgba(0,0,0,.05); }
        .tpm-row.active { outline: none; }

        .tpm-row-dots  { display: flex; gap: 4px; flex-shrink: 0; }
        .tpm-row-info  { flex: 1; min-width: 0; }
        .tpm-row-name  { font-size: 13px; font-weight: 600; color: #1a1a1a; }
        .tpm-row-style { font-size: 11px; color: #999; margin-top: 1px; }
        .tpm-row-check {
          flex-shrink: 0; margin-left: auto;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        .tpm-panel-foot {
          flex-shrink: 0;
          padding: 13px 14px 18px;
          border-top: 1px solid #f0f0f0;
          background: #fff;
          border-radius: 0 0 0 16px;
        }
        .tpm-apply-full {
          display: block; width: 100%; padding: 10px;
          text-align: center;
        }

        .tpm-mobile-only  { display: flex !important; }
        .tpm-desktop-only { display: none  !important; }
        @media (min-width: 640px) {
          .tpm-mobile-only  { display: none  !important; }
          .tpm-desktop-only { display: flex  !important; }
        }
      `}</style>

      <button className="tpm-btn" type="button" onClick={() => setOpen(true)}>
        <div className="tpm-btn-dots">
          <div
            className="tpm-btn-dot"
            style={{ background: current.colors.primary }}
          />
          <div
            className="tpm-btn-dot"
            style={{ background: current.colors.accent }}
          />
        </div>
        <span>{current.label}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#aaa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="tpm-overlay" onClick={() => setOpen(false)} />

          <div
            className="tpm-sheet tpm-mobile-only"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tpm-sheet-drag">
              <div className="tpm-drag-pill" />
            </div>
            <div className="tpm-sheet-head">
              <div>
                <div className="tpm-sheet-title">Theme boutique</div>
                <div className="tpm-sheet-sub">
                  Choisissez l'ambiance de votre vitrine
                </div>
              </div>
              <button
                className="tpm-close"
                type="button"
                onClick={() => setOpen(false)}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="tpm-sheet-body">
              <div className="tpm-grid">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    className={`tpm-card${localTheme === t.id ? " active" : ""}`}
                    style={{
                      background: t.colors.background,
                      borderColor:
                        localTheme === t.id ? t.colors.primary : "transparent",
                    }}
                    onClick={() => setLocalTheme(t.id)}
                  >
                    <div className="tpm-card-dots">
                      <div
                        className="tpm-dot"
                        style={{ background: t.colors.primary }}
                      />
                      <div
                        className="tpm-dot"
                        style={{ background: t.colors.accent }}
                      />
                    </div>
                    <div
                      className="tpm-card-name"
                      style={{ color: t.colors.text }}
                    >
                      {t.label}
                    </div>
                    <div
                      className="tpm-card-style"
                      style={{ color: t.colors.textMuted }}
                    >
                      {t.style}
                    </div>
                    {localTheme === t.id && (
                      <div
                        className="tpm-card-check"
                        style={{ background: t.colors.primary }}
                      >
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ height: "10px", gridColumn: "1 / -1" }} />
              </div>
            </div>
            <div className="tpm-sheet-foot">
              <div>
                <div className="tpm-foot-label">Selectionne</div>
                <div className="tpm-foot-name">
                  {current.label} · {current.style}
                </div>
              </div>
              <button
                className="tpm-apply"
                type="button"
                style={{
                  background: current.colors.primary,
                  padding: "9px 20px",
                }}
                onClick={() => setOpen(false)}
              >
                Appliquer
              </button>
            </div>
          </div>

          <div
            className="tpm-panel tpm-desktop-only"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tpm-panel-head">
              <div>
                <div className="tpm-panel-title">
                  Theme
                  <br />
                  boutique
                </div>
                <div className="tpm-panel-sub">Ambiance de votre vitrine</div>
              </div>
              <button
                className="tpm-close"
                type="button"
                onClick={() => setOpen(false)}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="tpm-panel-body">
              <div className="tpm-list">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    className={`tpm-row${localTheme === t.id ? " active" : ""}`}
                    style={{
                      background:
                        localTheme === t.id
                          ? t.colors.background
                          : "transparent",
                      borderColor:
                        localTheme === t.id ? t.colors.primary : "transparent",
                    }}
                    onClick={() => setLocalTheme(t.id)}
                  >
                    <div className="tpm-row-dots">
                      <div
                        className="tpm-dot"
                        style={{ background: t.colors.primary }}
                      />
                      <div
                        className="tpm-dot"
                        style={{ background: t.colors.accent }}
                      />
                    </div>
                    <div className="tpm-row-info">
                      <div className="tpm-row-name">{t.label}</div>
                      <div className="tpm-row-style">{t.style}</div>
                    </div>
                    {localTheme === t.id && (
                      <div
                        className="tpm-row-check"
                        style={{ background: t.colors.primary }}
                      >
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ height: "10px" }} />
              </div>
            </div>
            <div className="tpm-panel-foot">
              <button
                className="tpm-apply tpm-apply-full"
                type="button"
                style={{ background: current.colors.primary }}
                onClick={() => setOpen(false)}
              >
                Appliquer — {current.label}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   Page principale — redesign
══════════════════════════════════════════════════════════════ */
export default function ProfilPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    shopName: "",
    description: "",
    whatsapp: "",
    facebookUrl: "",
    profileImageUrl: "",
  });
  const [localTheme, setLocalTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/me");
      const u = data.user;
      const dbTheme = u.theme && THEMES[u.theme] ? u.theme : null;
      const localStore = localStorage.getItem("shop_theme");
      const resolved =
        dbTheme ||
        (localStore && THEMES[localStore] ? localStore : DEFAULT_THEME);
      setLocalTheme(resolved);
      setForm({
        shopName: u.shop_name || "",
        description: u.description || "",
        whatsapp: u.whatsapp || "",
        facebookUrl: u.facebook_url || "",
        profileImageUrl: u.profile_image_url || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.put("/auth/profile", { ...form, theme: localTheme });
      localStorage.setItem("shop_theme", localTheme);
      setSuccess("Profil mis a jour.");
      const session = getSession();
      saveSession(session.token, { ...session.user, shopName: form.shopName });
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await api.post("/upload/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, profileImageUrl: data.profileImageUrl }));
    } catch {
      setError("Erreur lors de l'upload.");
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f7f5",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "2px solid #e0e0e0",
              borderTopColor: "#111",
              animation: "spin .7s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <span
            style={{
              fontSize: "13px",
              color: "#999",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Chargement...
          </span>
        </div>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Epilogue:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pf-root {
          min-height: 100vh;
          background: #f7f7f5;
          font-family: 'Epilogue', system-ui, sans-serif;
          color: #111;
        }

        /* ── Navbar ── */
        .pf-nav {
          position: sticky; top: 0; z-index: 100;
          background: #111;
          display: flex; align-items: center;
          height: 52px;
          padding: 0 20px;
        }
        .pf-nav-brand {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          color: #fff; letter-spacing: -.3px;
          text-decoration: none; flex-shrink: 0;
        }
        .pf-nav-links {
          display: flex; align-items: center; gap: 4px;
          margin-left: auto;
        }
        .pf-nav-link {
          font-size: 12px; font-weight: 500;
          color: #aaa; text-decoration: none;
          padding: 6px 12px; border-radius: 6px;
          transition: color .15s, background .15s;
          letter-spacing: .01em;
        }
        .pf-nav-link:hover { color: #fff; background: rgba(255,255,255,.08); }
        .pf-nav-link.active { color: #fff; }

        /* ── Layout desktop: sidebar gauche + form droite ── */
        .pf-layout {
          display: grid;
          grid-template-columns: 1fr;
          min-height: calc(100vh - 52px);
        }
        @media (min-width: 900px) {
          .pf-layout {
            grid-template-columns: 280px 1fr;
          }
        }

        /* ── Sidebar ── */
        .pf-sidebar {
          display: none;
          background: #fff;
          border-right: 1px solid #ebebeb;
          padding: 40px 28px;
          flex-direction: column;
          gap: 32px;
          position: sticky;
          top: 52px;
          height: calc(100vh - 52px);
          overflow-y: auto;
        }
        @media (min-width: 900px) {
          .pf-sidebar { display: flex; }
        }

        .pf-sidebar-avatar-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .pf-sidebar-avatar {
          width: 88px; height: 88px; border-radius: 50%;
          border: 3px solid #f0f0f0;
          object-fit: cover; cursor: pointer;
          transition: border-color .2s, transform .2s;
          display: block;
        }
        .pf-sidebar-avatar:hover { border-color: #111; transform: scale(1.03); }
        .pf-avatar-placeholder {
          width: 88px; height: 88px; border-radius: 50%;
          background: #f2f2f2; border: 2px dashed #d8d8d8;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color .2s, background .2s;
        }
        .pf-avatar-placeholder:hover { border-color: #999; background: #ebebeb; }

        .pf-sidebar-name {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 700;
          color: #111; text-align: center; line-height: 1.2;
          word-break: break-word;
        }
        .pf-sidebar-hint {
          font-size: 11px; color: #bbb; text-align: center;
          margin-top: -8px;
        }

        .pf-sidebar-divider {
          height: 1px; background: #f0f0f0; width: 100%;
        }

        .pf-sidebar-section-title {
          font-size: 10px; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase;
          color: #bbb; margin-bottom: 10px;
        }

        .pf-info-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f5f5f5;
        }
        .pf-info-item:last-child { border-bottom: none; }
        .pf-info-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #f5f5f5;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: #555;
        }
        .pf-info-text { flex: 1; min-width: 0; }
        .pf-info-label { font-size: 10px; color: #bbb; font-weight: 500; margin-bottom: 2px; text-transform: uppercase; letter-spacing: .05em; }
        .pf-info-val   { font-size: 13px; color: #222; font-weight: 500; word-break: break-all; }
        .pf-info-empty { font-size: 13px; color: #ccc; font-style: italic; }

        /* ── Main ── */
        .pf-main {
          padding: 32px 20px 60px;
        }
        @media (min-width: 640px) {
          .pf-main { padding: 40px 40px 60px; }
        }
        @media (min-width: 1100px) {
          .pf-main { padding: 48px 64px 60px; }
        }

        .pf-page-header {
          margin-bottom: 32px;
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .pf-page-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px; font-weight: 800;
          color: #111; line-height: 1.05; letter-spacing: -.5px;
        }
        .pf-page-sub {
          font-size: 13px; color: #999; margin-top: 6px;
        }

        /* ── Alerts ── */
        .pf-alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 13px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          margin-bottom: 20px;
          animation: pf-fade-in .2s ease;
        }
        @keyframes pf-fade-in { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: none } }
        .pf-alert-err  { background: #fdf2f2; border: 1px solid #f5c5c5; color: #b91c1c; }
        .pf-alert-ok   { background: #f0faf4; border: 1px solid #a7d7b8; color: #166534; }

        /* ── Form card sections ── */
        .pf-sections {
          display: flex; flex-direction: column; gap: 20px;
        }

        .pf-section {
          background: #fff;
          border: 1px solid #ebebeb;
          border-radius: 14px;
          overflow: hidden;
        }

        .pf-section-header {
          padding: 18px 22px 0;
          border-bottom: 1px solid #f5f5f5;
          padding-bottom: 14px;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .pf-section-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f5f5f5;
          display: flex; align-items: center; justify-content: center;
          color: #555; flex-shrink: 0;
        }
        .pf-section-label {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #111;
        }

        .pf-section-body {
          padding: 0 22px 22px;
          display: flex; flex-direction: column; gap: 18px;
        }

        /* ── Field ── */
        .pf-field { display: flex; flex-direction: column; gap: 6px; }
        .pf-label {
          font-size: 12px; font-weight: 600;
          color: #555; letter-spacing: .02em; text-transform: uppercase;
        }
        .pf-hint {
          font-size: 12px; font-weight: 400; color: #bbb;
          text-transform: none; letter-spacing: 0;
          display: inline-block; margin-left: 6px;
        }
        .pf-input, .pf-textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e8e8e8;
          border-radius: 8px;
          font-family: 'Epilogue', system-ui, sans-serif;
          font-size: 14px; color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color .15s, background .15s, box-shadow .15s;
          -webkit-appearance: none;
        }
        .pf-input:focus, .pf-textarea:focus {
          border-color: #111;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,.06);
        }
        .pf-input::placeholder, .pf-textarea::placeholder { color: #ccc; }
        .pf-textarea { resize: vertical; line-height: 1.6; min-height: 90px; }

        /* ── Mobile avatar (inside main, only < 900px) ── */
        .pf-mobile-avatar {
          display: flex; align-items: center; gap: 16px;
        }
        @media (min-width: 900px) {
          .pf-mobile-avatar-section { display: none; }
        }

        .pf-mobile-avatar-img {
          width: 72px; height: 72px; border-radius: 50%;
          object-fit: cover; border: 2px solid #e8e8e8;
          display: block; cursor: pointer;
          transition: border-color .2s;
        }
        .pf-mobile-avatar-img:hover { border-color: #111; }
        .pf-mobile-avatar-placeholder {
          width: 72px; height: 72px; border-radius: 50%;
          background: #f2f2f2; border: 2px dashed #d8d8d8;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
        }
        .pf-mobile-avatar-info { flex: 1; }
        .pf-mobile-avatar-name {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700; color: #111;
        }
        .pf-mobile-avatar-hint { font-size: 12px; color: #bbb; margin-top: 3px; }

        /* ── Save button ── */
        .pf-save-bar {
          margin-top: 24px;
          display: flex; align-items: center; justify-content: flex-end;
          gap: 12px;
        }
        .pf-btn-save {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px;
          background: #111; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'Epilogue', system-ui, sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: background .15s, transform .15s, box-shadow .15s;
          letter-spacing: .01em;
        }
        .pf-btn-save:hover:not(:disabled) {
          background: #222;
          box-shadow: 0 4px 16px rgba(0,0,0,.18);
          transform: translateY(-1px);
        }
        .pf-btn-save:disabled {
          background: #bbb; cursor: not-allowed;
        }
        .pf-btn-save-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,.4);
          border-top-color: #fff;
          animation: spin .6s linear infinite;
        }

        /* ── Two-col grid for fields on wide screens ── */
        .pf-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 640px) {
          .pf-grid-2 { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="pf-root">
        {/* ── Navbar ── */}
        <nav className="pf-nav">
          <a href="/dashboard" className="pf-nav-brand">
            Tsen@be
          </a>
          <div className="pf-nav-links">
            <a href="/dashboard" className="pf-nav-link">
              Accueil
            </a>
            <a href="/dashboard/produits" className="pf-nav-link">
              Produits
            </a>
            <a href="/dashboard/stats" className="pf-nav-link">
              Stats
            </a>
            <a href="/dashboard/profil" className="pf-nav-link active">
              Profil
            </a>
          </div>
        </nav>

        <div className="pf-layout">
          {/* ── Sidebar desktop ── */}
          <aside className="pf-sidebar">
            <div className="pf-sidebar-avatar-wrap">
              <label style={{ cursor: "pointer" }}>
                {form.profileImageUrl ? (
                  <img
                    src={form.profileImageUrl}
                    alt="profil"
                    className="pf-sidebar-avatar"
                  />
                ) : (
                  <div className="pf-avatar-placeholder">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bbb"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
              <div>
                <div className="pf-sidebar-name">
                  {form.shopName || "Votre boutique"}
                </div>
                <div className="pf-sidebar-hint">
                  Cliquez pour changer la photo
                </div>
              </div>
            </div>

            <div className="pf-sidebar-divider" />

            <div>
              <div className="pf-sidebar-section-title">Infos boutique</div>
              {[
                {
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  label: "Nom",
                  val: form.shopName,
                },
                {
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  label: "WhatsApp",
                  val: form.whatsapp,
                },
                {
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                  label: "Facebook",
                  val: form.facebookUrl,
                },
              ].map((item, i) => (
                <div className="pf-info-item" key={i}>
                  <div className="pf-info-icon">{item.icon}</div>
                  <div className="pf-info-text">
                    <div className="pf-info-label">{item.label}</div>
                    {item.val ? (
                      <div className="pf-info-val">{item.val}</div>
                    ) : (
                      <div className="pf-info-empty">Non renseigne</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="pf-main">
            <div className="pf-page-header">
              <div>
                <h1 className="pf-page-title">Mon profil</h1>
                <p className="pf-page-sub">
                  Personnalisez votre boutique en ligne
                </p>
              </div>
            </div>

            {error && (
              <div className="pf-alert pf-alert-err">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: "1px" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="pf-alert pf-alert-ok">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: "1px" }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {success}
              </div>
            )}

            <div className="pf-sections">
              {/* ── Photo + nom (mobile only) ── */}
              <div className="pf-section pf-mobile-avatar-section">
                <div className="pf-section-body" style={{ paddingTop: "22px" }}>
                  <div className="pf-mobile-avatar">
                    <label style={{ cursor: "pointer", flexShrink: 0 }}>
                      {form.profileImageUrl ? (
                        <img
                          src={form.profileImageUrl}
                          alt="profil"
                          className="pf-mobile-avatar-img"
                        />
                      ) : (
                        <div className="pf-mobile-avatar-placeholder">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#bbb"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                    <div className="pf-mobile-avatar-info">
                      <div className="pf-mobile-avatar-name">
                        {form.shopName || "Votre boutique"}
                      </div>
                      <div className="pf-mobile-avatar-hint">
                        Appuyez sur la photo pour la modifier
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Identite ── */}
              <div className="pf-section">
                <div className="pf-section-header">
                  <div className="pf-section-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 9h6M9 13h6M9 17h4" />
                    </svg>
                  </div>
                  <span className="pf-section-label">Identite</span>
                </div>
                <div className="pf-section-body">
                  <div className="pf-field">
                    <label className="pf-label">Nom de la boutique</label>
                    <input
                      type="text"
                      className="pf-input"
                      value={form.shopName}
                      onChange={(e) =>
                        setForm({ ...form, shopName: e.target.value })
                      }
                      placeholder="Ma super boutique"
                    />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label">Description</label>
                    <textarea
                      className="pf-textarea"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Decrivez votre boutique en quelques mots..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* ── Contact ── */}
              <div className="pf-section">
                <div className="pf-section-header">
                  <div className="pf-section-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span className="pf-section-label">Contact</span>
                </div>
                <div className="pf-section-body">
                  <div className="pf-grid-2">
                    <div className="pf-field">
                      <label className="pf-label">
                        WhatsApp
                        <span className="pf-hint">ex: 261341234567</span>
                      </label>
                      <input
                        type="text"
                        className="pf-input"
                        value={form.whatsapp}
                        onChange={(e) =>
                          setForm({ ...form, whatsapp: e.target.value })
                        }
                        placeholder="261341234567"
                      />
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">
                        Facebook
                        <span className="pf-hint">optionnel</span>
                      </label>
                      <input
                        type="text"
                        className="pf-input"
                        value={form.facebookUrl}
                        onChange={(e) =>
                          setForm({ ...form, facebookUrl: e.target.value })
                        }
                        placeholder="https://facebook.com/votreboutique"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Theme ── */}
              <div className="pf-section">
                <div className="pf-section-header">
                  <div className="pf-section-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20A14.5 14.5 0 0 0 12 2" />
                    </svg>
                  </div>
                  <span className="pf-section-label">Apparence</span>
                </div>
                <div className="pf-section-body">
                  <div className="pf-field">
                    <label className="pf-label">Theme de la boutique</label>
                    <div style={{ marginTop: "2px" }}>
                      <ThemePickerModal
                        localTheme={localTheme}
                        setLocalTheme={setLocalTheme}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Save bar ── */}
            <div className="pf-save-bar">
              <button
                className="pf-btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving && <div className="pf-btn-save-spinner" />}
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
