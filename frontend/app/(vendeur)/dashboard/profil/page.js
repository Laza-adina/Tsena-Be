'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, saveSession } from '../../../../lib/auth';
import api from '../../../../lib/api';
import { THEMES, DEFAULT_THEME } from '../../../../lib/themes';

export default function ProfilPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ shopName: '', description: '', whatsapp: '', facebookUrl: '', profileImageUrl: '' });
  const [localTheme, setLocalTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const u = data.user;
      const savedTheme = localStorage.getItem('shop_theme') || DEFAULT_THEME;
      setLocalTheme(savedTheme);
      
      setForm({
        shopName:        u.shop_name        || '',
        description:     u.description      || '',
        whatsapp:        u.whatsapp         || '',
        facebookUrl:     u.facebook_url     || '',
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
      // On sauvegarde le profil en DB
      const { data } = await api.put('/auth/profile', form);
      // On sauvegarde le thème en local
      localStorage.setItem('shop_theme', localTheme);
      
      setSuccess('Profil mis a jour.');
      // Mettre à jour la session locale
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(f => ({ ...f, profileImageUrl: data.profileImageUrl }));
    } catch {
      setError("Erreur lors de l'upload.");
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #e5e5e5', borderRadius: '6px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '13px', fontWeight: '500',
    color: '#333', display: 'block', marginBottom: '6px'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <a href="/dashboard" style={{ fontWeight: '700', fontSize: '16px', color: '#111', textDecoration: 'none' }}>Keyros</a>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/dashboard" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Accueil</a>
          <a href="/dashboard/produits" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Produits</a>
          <a href="/dashboard/stats" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Stats</a>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>

        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 24px' }}>
          Mon profil
        </h1>

        {error && (
          <div style={{ padding: '12px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#c00' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '12px', background: '#f0fff4', border: '1px solid #9de', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#060' }}>
            {success}
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Photo de profil */}
          <div>
            <label style={labelStyle}>Photo de profil</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {form.profileImageUrl ? (
                <img
                  src={form.profileImageUrl}
                  alt="profil"
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e5e5' }}
                />
              ) : (
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f5f5f5', border: '1px solid #e5e5e5' }} />
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '13px', color: '#555' }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Nom de la boutique</label>
            <input
              type="text"
              value={form.shopName}
              onChange={e => setForm({ ...form, shopName: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Decrivez votre boutique en quelques mots..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Numero WhatsApp
              <span style={{ color: '#999', fontWeight: '400', marginLeft: '6px' }}>ex: 261341234567</span>
            </label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={e => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="261341234567"
              style={inputStyle}
            />
          </div>

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

          <div>
            <label style={{ ...labelStyle, marginBottom: '12px' }}>Thème de la boutique</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {Object.values(THEMES).map(t => (
                <div
                  key={t.id}
                  onClick={() => setLocalTheme(t.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: localTheme === t.id ? `2px solid ${t.colors.primary}` : '1px solid #e5e5e5',
                    cursor: 'pointer',
                    background: t.colors.background,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.colors.primary }} />
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.colors.accent }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: t.colors.text }}>{t.label}</div>
                    <div style={{ fontSize: '11px', color: t.colors.textMuted }}>{t.style}</div>
                  </div>
                  {localTheme === t.id && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', color: t.colors.primary }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '11px', background: saving ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer', marginTop: '4px' }}
          >
            {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}