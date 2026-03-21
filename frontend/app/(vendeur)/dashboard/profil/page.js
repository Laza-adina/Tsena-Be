"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession, saveSession } from "../../../../lib/auth";
import api from "../../../../lib/api";
import { THEMES, DEFAULT_THEME } from "../../../../lib/themes";

const C = {
  main: "#CCD5AE",
  light: "#E9EDC9",
  cream: "#FEFAE0",
  beige: "#FAEDCD",
  caramel: "#D4A373",
  dark: "#3D4A2A",
  text: "#2D2D2D",
  muted: "#6A7A52",
};

/* ══════════════════════════════════════════════════════════════
   ThemePickerModal — INCHANGÉ fonctionnellement
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .tpm-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 9px 14px; border-radius: 8px;
          border: 1.5px solid ${C.light}; background: ${C.cream};
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: ${C.dark};
          transition: box-shadow .15s, border-color .15s, background .15s;
          user-select: none;
        }
        .tpm-btn:hover { background:#fff; border-color:${C.caramel}; box-shadow:0 2px 10px rgba(61,74,42,.1); }
        .tpm-btn-dots { display:flex; gap:4px; }
        .tpm-btn-dot  { width:11px; height:11px; border-radius:50%; transition:transform .2s; }
        .tpm-btn:hover .tpm-btn-dot { transform:scale(1.2); }

        .tpm-overlay {
          position:fixed; inset:0; background:rgba(61,74,42,.45);
          backdrop-filter:blur(5px); z-index:1000;
          animation:tpm-fog .2s ease forwards;
        }
        @keyframes tpm-fog { from{opacity:0} to{opacity:1} }

        .tpm-close {
          width:28px; height:28px; border-radius:7px;
          border:1px solid ${C.light}; background:transparent;
          cursor:pointer; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          color:${C.muted}; transition:background .12s, color .12s;
        }
        .tpm-close:hover { background:${C.light}; color:${C.dark}; }

        .tpm-apply {
          border:none; border-radius:8px; font-family:'DM Sans',sans-serif;
          font-size:13px; font-weight:600; color:#fff;
          cursor:pointer; transition:opacity .15s, transform .15s;
        }
        .tpm-apply:hover { opacity:.87; transform:translateY(-1px); }

        .tpm-sheet {
          position:fixed; bottom:0; left:0; right:0;
          height:70vh; max-height:530px; background:${C.cream};
          border-radius:20px 20px 0 0; z-index:1001;
          display:flex; flex-direction:column; font-family:'DM Sans',sans-serif;
          animation:tpm-rise .3s cubic-bezier(.32,1.4,.6,1) forwards;
        }
        @keyframes tpm-rise { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }

        .tpm-sheet-drag { flex-shrink:0; padding:12px 0 0; display:flex; justify-content:center; }
        .tpm-drag-pill  { width:36px; height:4px; border-radius:2px; background:${C.light}; }

        .tpm-sheet-head {
          flex-shrink:0; padding:12px 18px 13px;
          display:flex; align-items:center; justify-content:space-between;
          border-bottom:1px solid ${C.light};
        }
        .tpm-sheet-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:18px; font-weight:700; color:${C.dark}; }
        .tpm-sheet-sub   { font-size:11px; color:${C.muted}; margin-top:2px; }

        .tpm-sheet-body { flex:1; overflow-y:auto; overflow-x:hidden; padding:14px 14px 0; }
        .tpm-sheet-body::-webkit-scrollbar { width:3px; }
        .tpm-sheet-body::-webkit-scrollbar-thumb { background:${C.light}; border-radius:2px; }

        .tpm-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:9px; }

        .tpm-card {
          border-radius:10px; padding:11px 10px 10px; cursor:pointer;
          border:2px solid transparent; position:relative;
          transition:transform .15s, box-shadow .15s;
          outline:1.5px solid rgba(61,74,42,.1);
        }
        .tpm-card:hover  { transform:translateY(-2px); box-shadow:0 5px 16px rgba(61,74,42,.12); }
        .tpm-card.active { outline:none; }
        .tpm-card-dots  { display:flex; gap:4px; margin-bottom:8px; }
        .tpm-dot        { width:13px; height:13px; border-radius:50%; }
        .tpm-card-name  { font-size:12px; font-weight:600; line-height:1.3; }
        .tpm-card-style { font-size:10px; margin-top:1px; opacity:.65; }
        .tpm-card-check { position:absolute; top:8px; right:8px; width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; }

        .tpm-sheet-foot {
          flex-shrink:0; padding:13px 16px 20px; border-top:1px solid ${C.light};
          background:${C.cream}; display:flex; align-items:center; justify-content:space-between; gap:12px;
        }
        .tpm-foot-label { font-size:11px; color:${C.muted}; }
        .tpm-foot-name  { font-size:13px; font-weight:600; color:${C.dark}; margin-top:1px; }

        .tpm-panel {
          position:fixed; top:50%; right:0; transform:translateY(-50%);
          width:290px; height:65vh; max-height:560px;
          background:${C.cream}; border-radius:16px 0 0 16px;
          z-index:1001; display:flex; flex-direction:column;
          box-shadow:-6px 0 36px rgba(61,74,42,.14); font-family:'DM Sans',sans-serif;
          animation:tpm-slide-in .3s cubic-bezier(.32,1.3,.6,1) forwards;
        }
        @keyframes tpm-slide-in {
          from{transform:translateY(-50%) translateX(100%);opacity:0}
          to{transform:translateY(-50%) translateX(0);opacity:1}
        }
        .tpm-panel-head {
          flex-shrink:0; padding:22px 18px 16px; border-bottom:1px solid ${C.light};
          display:flex; align-items:flex-start; justify-content:space-between;
        }
        .tpm-panel-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:22px; font-weight:700; color:${C.dark}; line-height:1.15; }
        .tpm-panel-sub   { font-size:11px; color:${C.muted}; margin-top:4px; }

        .tpm-panel-body { flex:1; overflow-y:auto; overflow-x:hidden; padding:12px 12px 0; }
        .tpm-panel-body::-webkit-scrollbar { width:3px; }
        .tpm-panel-body::-webkit-scrollbar-thumb { background:${C.light}; border-radius:2px; }

        .tpm-list { display:flex; flex-direction:column; gap:6px; }
        .tpm-row {
          display:flex; align-items:center; gap:11px; border-radius:10px;
          padding:10px 12px; cursor:pointer; border:2px solid transparent;
          transition:background .12s, border-color .12s, box-shadow .12s;
          outline:1.5px solid rgba(61,74,42,.08);
        }
        .tpm-row:hover  { background:rgba(61,74,42,.04); box-shadow:0 2px 8px rgba(61,74,42,.06); }
        .tpm-row.active { outline:none; }
        .tpm-row-dots  { display:flex; gap:4px; flex-shrink:0; }
        .tpm-row-info  { flex:1; min-width:0; }
        .tpm-row-name  { font-size:13px; font-weight:600; color:${C.dark}; }
        .tpm-row-style { font-size:11px; color:${C.muted}; margin-top:1px; }
        .tpm-row-check { flex-shrink:0; margin-left:auto; width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; }

        .tpm-panel-foot { flex-shrink:0; padding:13px 14px 18px; border-top:1px solid ${C.light}; background:${C.cream}; border-radius:0 0 0 16px; }
        .tpm-apply-full { display:block; width:100%; padding:10px; text-align:center; }

        .tpm-mobile-only  { display:flex !important; }
        .tpm-desktop-only { display:none  !important; }
        @media (min-width:640px) {
          .tpm-mobile-only  { display:none  !important; }
          .tpm-desktop-only { display:flex  !important; }
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
          stroke={C.muted}
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

          {/* MOBILE */}
          <div
            className="tpm-sheet tpm-mobile-only"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tpm-sheet-drag">
              <div className="tpm-drag-pill" />
            </div>
            <div className="tpm-sheet-head">
              <div>
                <div className="tpm-sheet-title">Th&egrave;me boutique</div>
                <div className="tpm-sheet-sub">
                  Choisissez l&apos;ambiance de votre vitrine
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
                <div className="tpm-foot-label">S&eacute;lectionn&eacute;</div>
                <div className="tpm-foot-name">
                  {current.label} &middot; {current.style}
                </div>
              </div>
              <button
                className="tpm-apply"
                type="button"
                style={{ background: C.dark, padding: "9px 20px" }}
                onClick={() => setOpen(false)}
              >
                Appliquer
              </button>
            </div>
          </div>

          {/* DESKTOP */}
          <div
            className="tpm-panel tpm-desktop-only"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tpm-panel-head">
              <div>
                <div className="tpm-panel-title">
                  Th&egrave;me
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
                style={{ background: C.dark }}
                onClick={() => setOpen(false)}
              >
                Appliquer &mdash; {current.label}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   Page principale
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

  const fetchProfile = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [router, fetchProfile]);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.put("/auth/profile", { ...form, theme: localTheme });
      localStorage.setItem("shop_theme", localTheme);
      setSuccess("Profil mis \u00e0 jour.");
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
      setError("Erreur lors de l\u0027upload.");
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
          background: C.cream,
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
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: `2px solid ${C.light}`,
              borderTopColor: C.dark,
              animation: "spin .7s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <span
            style={{
              fontSize: "13px",
              color: C.muted,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .pf-root { min-height:100vh; background:${C.cream}; font-family:'DM Sans',sans-serif; color:${C.text}; }

        .pf-nav {
          background:${C.cream}; border-bottom:1px solid ${C.light};
          height:60px; display:flex; align-items:center;
          position:sticky; top:0; z-index:100;
        }
        .pf-nav-inner { display:flex; align-items:center; justify-content:space-between; width:100%; padding:0 40px; }
        .pf-nav-brand {
          font-family:'Cormorant Garamond',Georgia,serif;
          font-size:22px; font-weight:700; color:${C.dark}; text-decoration:none; letter-spacing:-0.5px;
        }
        .pf-nav-links { display:flex; align-items:center; gap:24px; }
        .pf-nav-link {
          font-size:14px; font-weight:500; color:${C.dark};
          text-decoration:none; position:relative; padding-bottom:2px;
        }
        .pf-nav-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:${C.dark}; transition:width .25s; }
        .pf-nav-link:hover::after { width:100%; }
        .pf-nav-link.active::after { width:100%; }

        .pf-layout { display:grid; grid-template-columns:1fr; min-height:calc(100vh - 60px); }
        @media (min-width:900px) { .pf-layout { grid-template-columns:260px 1fr; } }

        .pf-sidebar {
          display:none; background:${C.light}; border-right:1px solid ${C.main};
          padding:48px 28px; flex-direction:column; gap:32px;
          position:sticky; top:60px; height:calc(100vh - 60px); overflow-y:auto;
        }
        @media (min-width:900px) { .pf-sidebar { display:flex; } }

        .pf-sidebar-avatar-wrap { display:flex; flex-direction:column; align-items:center; gap:14px; }
        .pf-sidebar-avatar {
          width:88px; height:88px; border-radius:50%;
          border:3px solid ${C.main}; cursor:pointer;
          transition:border-color .2s, transform .2s; overflow:hidden; position:relative;
        }
        .pf-sidebar-avatar:hover { border-color:${C.caramel}; transform:scale(1.03); }
        .pf-avatar-placeholder {
          width:88px; height:88px; border-radius:50%;
          background:${C.main}; border:2px dashed ${C.muted};
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:border-color .2s, background .2s;
        }
        .pf-avatar-placeholder:hover { border-color:${C.caramel}; background:${C.beige}; }
        .pf-sidebar-name {
          font-family:'Cormorant Garamond',Georgia,serif;
          font-size:18px; font-weight:700; color:${C.dark}; text-align:center; line-height:1.2; word-break:break-word;
        }
        .pf-sidebar-hint { font-size:11px; color:${C.muted}; text-align:center; margin-top:-6px; font-weight:300; }
        .pf-sidebar-divider { height:1px; background:${C.main}; width:100%; }
        .pf-sidebar-section-title {
          font-size:10px; font-weight:600; letter-spacing:.1em;
          text-transform:uppercase; color:${C.muted}; margin-bottom:10px;
        }
        .pf-info-item { display:flex; align-items:flex-start; gap:10px; padding:10px 0; border-bottom:1px solid ${C.main}; }
        .pf-info-item:last-child { border-bottom:none; }
        .pf-info-icon { width:30px; height:30px; border-radius:8px; background:${C.main}; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:${C.muted}; }
        .pf-info-text { flex:1; min-width:0; }
        .pf-info-label { font-size:10px; color:${C.muted}; font-weight:600; margin-bottom:2px; text-transform:uppercase; letter-spacing:.05em; }
        .pf-info-val   { font-size:13px; color:${C.dark}; font-weight:500; word-break:break-all; }
        .pf-info-empty { font-size:13px; color:${C.muted}; font-style:italic; font-weight:300; }

        .pf-main { padding:40px 24px 80px; }
        @media (min-width:640px)  { .pf-main { padding:48px 40px 80px; } }
        @media (min-width:1100px) { .pf-main { padding:56px 64px 80px; } }

        .pf-page-header { margin-bottom:40px; }
        .pf-page-eyebrow {
          display:inline-block; font-size:10px; font-weight:600; letter-spacing:2px;
          text-transform:uppercase; color:${C.muted}; background:${C.light};
          padding:4px 16px; border-radius:20px; margin-bottom:16px;
        }
        .pf-page-title {
          font-family:'Cormorant Garamond',Georgia,serif;
          font-size:38px; font-weight:700; color:${C.dark}; line-height:1.05; letter-spacing:-1px;
        }
        .pf-page-sub { font-size:15px; color:${C.muted}; margin-top:8px; font-weight:300; line-height:1.7; }

        .pf-alert {
          display:flex; align-items:flex-start; gap:10px;
          padding:13px 18px; border-radius:10px;
          font-size:13px; font-weight:500; margin-bottom:24px;
          animation:pf-fade-in .2s ease;
        }
        @keyframes pf-fade-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }
        .pf-alert-err { background:#FEF2F2; border:1px solid #FECACA; color:#991B1B; }
        .pf-alert-ok  { background:${C.light}; border:1px solid ${C.main}; color:${C.dark}; }

        .pf-sections { display:flex; flex-direction:column; gap:20px; }

        .pf-section { background:#fff; border:1px solid ${C.light}; border-radius:20px; overflow:hidden; transition:box-shadow .2s; }
        .pf-section:hover { box-shadow:0 4px 20px rgba(61,74,42,.07); }

        .pf-section-header {
          padding:20px 24px 16px; border-bottom:1px solid ${C.light};
          display:flex; align-items:center; gap:12px; background:${C.cream};
        }
        .pf-section-icon { width:32px; height:32px; border-radius:8px; background:${C.light}; display:flex; align-items:center; justify-content:center; color:${C.muted}; flex-shrink:0; }
        .pf-section-label { font-family:'Cormorant Garamond',Georgia,serif; font-size:16px; font-weight:700; color:${C.dark}; letter-spacing:-0.3px; }

        .pf-section-body { padding:22px 24px 24px; display:flex; flex-direction:column; gap:18px; }

        .pf-field { display:flex; flex-direction:column; gap:6px; }
        .pf-label { font-size:11px; font-weight:600; color:${C.muted}; letter-spacing:.08em; text-transform:uppercase; }
        .pf-hint  { font-size:11px; font-weight:300; color:${C.muted}; text-transform:none; letter-spacing:0; margin-left:6px; }
        .pf-input, .pf-textarea {
          width:100%; padding:11px 14px;
          border:1.5px solid ${C.light}; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:14px; font-weight:400;
          color:${C.dark}; background:${C.cream}; outline:none;
          transition:border-color .15s, background .15s, box-shadow .15s;
        }
        .pf-input:focus, .pf-textarea:focus {
          border-color:${C.caramel}; background:#fff;
          box-shadow:0 0 0 3px rgba(212,163,115,.15);
        }
        .pf-input::placeholder, .pf-textarea::placeholder { color:${C.muted}; opacity:.5; font-weight:300; }
        .pf-textarea { resize:vertical; line-height:1.65; min-height:90px; }

        .pf-mobile-avatar { display:flex; align-items:center; gap:16px; }
        @media (min-width:900px) { .pf-mobile-avatar-section { display:none; } }
        .pf-mobile-avatar-img {
          width:72px; height:72px; border-radius:50%;
          border:2px solid ${C.main}; cursor:pointer;
          overflow:hidden; position:relative; flex-shrink:0;
        }
        .pf-mobile-avatar-placeholder {
          width:72px; height:72px; border-radius:50%;
          background:${C.main}; border:2px dashed ${C.muted};
          display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0;
        }
        .pf-mobile-avatar-info { flex:1; }
        .pf-mobile-avatar-name { font-family:'Cormorant Garamond',Georgia,serif; font-size:17px; font-weight:700; color:${C.dark}; }
        .pf-mobile-avatar-hint { font-size:12px; color:${C.muted}; margin-top:3px; font-weight:300; }

        .pf-grid-2 { display:grid; grid-template-columns:1fr; gap:18px; }
        @media (min-width:640px) { .pf-grid-2 { grid-template-columns:1fr 1fr; } }

        .pf-save-bar { margin-top:28px; display:flex; align-items:center; justify-content:flex-end; }
        .pf-btn-save {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 32px; background:${C.dark}; color:${C.cream};
          border:none; border-radius:8px; font-family:'DM Sans',sans-serif;
          font-size:14px; font-weight:600; cursor:pointer;
          transition:transform .2s, box-shadow .2s; letter-spacing:.01em;
        }
        .pf-btn-save:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(61,74,42,.18); }
        .pf-btn-save:disabled { background:${C.muted}; cursor:not-allowed; }
        .pf-btn-spinner {
          width:14px; height:14px; border-radius:50%;
          border:2px solid rgba(255,255,255,.4); border-top-color:#fff;
          animation:spin .6s linear infinite;
        }

        @media (max-width:768px) {
          .pf-nav-links { display:none; }
          .pf-page-title { font-size:28px !important; }
        }
      `}</style>

      <div className="pf-root">
        {/* Navbar */}
        <nav className="pf-nav">
          <div className="pf-nav-inner">
            <Link href="/dashboard" className="pf-nav-brand">
              Tsen<span style={{ color: C.caramel }}>@</span>be
            </Link>
            <div className="pf-nav-links">
              <Link href="/dashboard" className="pf-nav-link">
                Accueil
              </Link>
              <Link href="/dashboard/produits" className="pf-nav-link">
                Produits
              </Link>
              <Link href="/dashboard/stats" className="pf-nav-link">
                Stats
              </Link>
              <Link href="/dashboard/profil" className="pf-nav-link active">
                Profil
              </Link>
            </div>
          </div>
        </nav>

        <div className="pf-layout">
          {/* Sidebar */}
          <aside className="pf-sidebar">
            <div className="pf-sidebar-avatar-wrap">
              <label style={{ cursor: "pointer" }}>
                {form.profileImageUrl ? (
                  <div className="pf-sidebar-avatar">
                    <Image
                      src={form.profileImageUrl}
                      alt="profil"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="88px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="pf-avatar-placeholder">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.muted}
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
                  label: "Nom",
                  val: form.shopName,
                  icon: (
                    <svg
                      width="13"
                      height="13"
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
                },
                {
                  label: "WhatsApp",
                  val: form.whatsapp,
                  icon: (
                    <svg
                      width="13"
                      height="13"
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
                },
                {
                  label: "Facebook",
                  val: form.facebookUrl,
                  icon: (
                    <svg
                      width="13"
                      height="13"
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
                },
              ].map((item) => (
                <div className="pf-info-item" key={item.label}>
                  <div className="pf-info-icon">{item.icon}</div>
                  <div className="pf-info-text">
                    <div className="pf-info-label">{item.label}</div>
                    {item.val ? (
                      <div className="pf-info-val">{item.val}</div>
                    ) : (
                      <div className="pf-info-empty">Non renseign&eacute;</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className="pf-main">
            <div className="pf-page-header">
              <div className="pf-page-eyebrow">Dashboard</div>
              <h1 className="pf-page-title">Mon profil</h1>
              <p className="pf-page-sub">
                Personnalisez votre boutique en ligne
              </p>
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
              {/* Mobile avatar */}
              <div className="pf-section pf-mobile-avatar-section">
                <div className="pf-section-body" style={{ paddingTop: "22px" }}>
                  <div className="pf-mobile-avatar">
                    <label style={{ cursor: "pointer" }}>
                      {form.profileImageUrl ? (
                        <div className="pf-mobile-avatar-img">
                          <Image
                            src={form.profileImageUrl}
                            alt="profil"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="72px"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="pf-mobile-avatar-placeholder">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={C.muted}
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

              {/* Identité */}
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
                  <span className="pf-section-label">Identit&eacute;</span>
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
                      placeholder="D&#233;crivez votre boutique en quelques mots..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
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
                        WhatsApp{" "}
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
                        Facebook <span className="pf-hint">optionnel</span>
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

              {/* Apparence */}
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
                    <label className="pf-label">
                      Th&egrave;me de la boutique
                    </label>
                    <div style={{ marginTop: "4px" }}>
                      <ThemePickerModal
                        localTheme={localTheme}
                        setLocalTheme={setLocalTheme}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pf-save-bar">
              <button
                className="pf-btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving && <div className="pf-btn-spinner" />}
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
