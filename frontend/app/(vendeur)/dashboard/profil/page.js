'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, saveSession } from '../../../../lib/auth';
import api from '../../../../lib/api';
import { THEMES, DEFAULT_THEME } from '../../../../lib/themes';

/* ══════════════════════════════════════════════════════════════
   ThemePickerModal
   < 640px  → bottom-sheet mobile  (hauteur fixe, grille 2 col, scroll interne)
   ≥ 640px  → panel latéral droit  (hauteur fixe, liste 1 col,  scroll interne)
══════════════════════════════════════════════════════════════ */
function ThemePickerModal({ localTheme, setLocalTheme }) {
  const [open, setOpen] = useState(false);
  const themes  = Object.values(THEMES);
  const current = THEMES[localTheme] || themes[0];

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
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

        /* ── MOBILE bottom-sheet ── */
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

        /* ── DESKTOP side panel ── */
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

      {/* ── Trigger ── */}
      <button className="tpm-btn" type="button" onClick={() => setOpen(true)}>
        <div className="tpm-btn-dots">
          <div className="tpm-btn-dot" style={{ background: current.colors.primary }} />
          <div className="tpm-btn-dot" style={{ background: current.colors.accent }} />
        </div>
        <span>{current.label}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="tpm-overlay" onClick={() => setOpen(false)} />

          {/* ══ MOBILE – bottom-sheet ══ */}
          <div className="tpm-sheet tpm-mobile-only" onClick={(e) => e.stopPropagation()}>
            <div className="tpm-sheet-drag"><div className="tpm-drag-pill" /></div>

            <div className="tpm-sheet-head">
              <div>
                <div className="tpm-sheet-title">Thème boutique</div>
                <div className="tpm-sheet-sub">Choisissez l'ambiance de votre vitrine</div>
              </div>
              <button className="tpm-close" type="button" onClick={() => setOpen(false)}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="tpm-sheet-body">
              <div className="tpm-grid">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    className={`tpm-card${localTheme === t.id ? ' active' : ''}`}
                    style={{
                      background:  t.colors.background,
                      borderColor: localTheme === t.id ? t.colors.primary : 'transparent',
                    }}
                    onClick={() => setLocalTheme(t.id)}
                  >
                    <div className="tpm-card-dots">
                      <div className="tpm-dot" style={{ background: t.colors.primary }} />
                      <div className="tpm-dot" style={{ background: t.colors.accent }} />
                    </div>
                    <div className="tpm-card-name"  style={{ color: t.colors.text }}>{t.label}</div>
                    <div className="tpm-card-style" style={{ color: t.colors.textMuted }}>{t.style}</div>
                    {localTheme === t.id && (
                      <div className="tpm-card-check" style={{ background: t.colors.primary }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff"
                          strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ height: '10px', gridColumn: '1 / -1' }} />
              </div>
            </div>

            <div className="tpm-sheet-foot">
              <div>
                <div className="tpm-foot-label">Sélectionné</div>
                <div className="tpm-foot-name">{current.label} · {current.style}</div>
              </div>
              <button
                className="tpm-apply"
                type="button"
                style={{ background: current.colors.primary, padding: '9px 20px' }}
                onClick={() => setOpen(false)}
              >
                Appliquer
              </button>
            </div>
          </div>

          {/* ══ DESKTOP – side panel ══ */}
          <div className="tpm-panel tpm-desktop-only" onClick={(e) => e.stopPropagation()}>
            <div className="tpm-panel-head">
              <div>
                <div className="tpm-panel-title">Thème<br />boutique</div>
                <div className="tpm-panel-sub">Ambiance de votre vitrine</div>
              </div>
              <button className="tpm-close" type="button" onClick={() => setOpen(false)}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="tpm-panel-body">
              <div className="tpm-list">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    className={`tpm-row${localTheme === t.id ? ' active' : ''}`}
                    style={{
                      background:  localTheme === t.id ? t.colors.background : 'transparent',
                      borderColor: localTheme === t.id ? t.colors.primary    : 'transparent',
                    }}
                    onClick={() => setLocalTheme(t.id)}
                  >
                    <div className="tpm-row-dots">
                      <div className="tpm-dot" style={{ background: t.colors.primary }} />
                      <div className="tpm-dot" style={{ background: t.colors.accent }} />
                    </div>
                    <div className="tpm-row-info">
                      <div className="tpm-row-name">{t.label}</div>
                      <div className="tpm-row-style">{t.style}</div>
                    </div>
                    {localTheme === t.id && (
                      <div className="tpm-row-check" style={{ background: t.colors.primary }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff"
                          strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ height: '10px' }} />
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
   Page principale
══════════════════════════════════════════════════════════════ */
export default function ProfilPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    shopName: '', description: '', whatsapp: '', facebookUrl: '', profileImageUrl: '',
  });
  // ── Un seul état thème, initialisé avec DEFAULT_THEME ──
  const [localTheme, setLocalTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const u = data.user;

      // Thème : priorité DB → localStorage → DEFAULT_THEME
      const dbTheme    = u.theme && THEMES[u.theme] ? u.theme : null;
      const localStore = localStorage.getItem('shop_theme');
      const resolved   = dbTheme || (localStore && THEMES[localStore] ? localStore : DEFAULT_THEME);
      setLocalTheme(resolved);

      setForm({
        shopName:        u.shop_name         || '',
        description:     u.description       || '',
        whatsapp:        u.whatsapp          || '',
        facebookUrl:     u.facebook_url      || '',
        profileImageUrl: u.profile_image_url || '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError(''); setSuccess('');
    setSaving(true);
    try {
      // Thème envoyé en DB avec le reste du profil
      await api.put('/auth/profile', { ...form, theme: localTheme });
      // Miroir localStorage pour éviter un aller-retour au prochain chargement
      localStorage.setItem('shop_theme', localTheme);
      setSuccess('Profil mis à jour.');
      const session = getSession();
      saveSession(session.token, { ...session.user, shopName: form.shopName });
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(f => ({ ...f, profileImageUrl: data.profileImageUrl }));
    } catch {
      setError("Erreur lors de l'upload.");
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #e5e5e5', borderRadius: '6px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = {
    fontSize: '13px', fontWeight: '500',
    color: '#333', display: 'block', marginBottom: '6px',
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Navbar ── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e5e5e5',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '56px',
      }}>
        <a href="/dashboard"
          style={{ fontWeight: '700', fontSize: '16px', color: '#111', textDecoration: 'none' }}>
          Tsen@be
        </a>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/dashboard"          style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Accueil</a>
          <a href="/dashboard/produits" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Produits</a>
          <a href="/dashboard/stats"    style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Stats</a>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 24px' }}>
          Mon profil
        </h1>

        {error && (
          <div style={{
            padding: '12px', background: '#fff0f0', border: '1px solid #fcc',
            borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#c00',
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            padding: '12px', background: '#f0fff4', border: '1px solid #9de',
            borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#060',
          }}>
            {success}
          </div>
        )}

        <div style={{
          background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px',
          padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
        }}>

          {/* ── Photo de profil (clic sur l'avatar) ── */}
          <div>
            <label style={labelStyle}>Photo de profil</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
                {form.profileImageUrl ? (
                  <img
                    src={form.profileImageUrl}
                    alt="profil"
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      objectFit: 'cover', border: '1px solid #e5e5e5', display: 'block',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: '#f5f5f5', border: '1px solid #e5e5e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#bbb',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{ fontSize: '13px', color: '#777' }}>
                Cliquez sur l'image pour la modifier
              </span>
            </div>
          </div>

          {/* ── Nom de la boutique ── */}
          <div>
            <label style={labelStyle}>Nom de la boutique</label>
            <input
              type="text"
              value={form.shopName}
              onChange={e => setForm({ ...form, shopName: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* ── Description ── */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Décrivez votre boutique en quelques mots..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
            />
          </div>

          {/* ── WhatsApp ── */}
          <div>
            <label style={labelStyle}>
              Numéro WhatsApp
              <span style={{ color: '#999', fontWeight: '400', marginLeft: '6px' }}>
                ex: 261341234567
              </span>
            </label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={e => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="261341234567"
              style={inputStyle}
            />
          </div>

          {/* ── Facebook ── */}
          <div>
            <label style={labelStyle}>Lien Facebook (optionnel)</label>
            <input
              type="text"
              value={form.facebookUrl}
              onChange={e => setForm({ ...form, facebookUrl: e.target.value })}
              placeholder="https://facebook.com/votreboutique"
              style={inputStyle}
            />
          </div>

          {/* ── Thème (modal uniquement, grille inline supprimée) ── */}
          <div>
            <label style={{ ...labelStyle, marginBottom: '10px' }}>
              Thème de la boutique
            </label>
            <ThemePickerModal
              localTheme={localTheme}
              setLocalTheme={setLocalTheme}
            />
          </div>

          {/* ── Enregistrer ── */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '11px',
              background: saving ? '#999' : '#111',
              color: '#fff', border: 'none', borderRadius: '6px',
              fontSize: '14px', fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
              marginTop: '4px',
            }}
          >
            {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}