'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { saveSession } from '../../../lib/auth';

const C = {
  cream:   '#FEFAE0',
  beige:   '#FAEDCD',
  sage:    '#CCD5AE',
  light:   '#E9EDC9',
  caramel: '#D4A373',
  dark:    '#3D4A2A',
  muted:   '#6A7A52'
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      saveSession(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: `1px solid ${C.sage}`,
    borderRadius: '8px', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    background: C.cream, color: C.dark,
    fontFamily: 'Georgia, serif'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.cream, fontFamily: 'Georgia, serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <p style={{ fontSize: '24px', fontWeight: '700', color: C.dark, margin: '0 0 4px' }}>
              Tsen@be
              <span style={{ fontSize: '12px', fontWeight: '400', color: C.muted, marginLeft: '8px' }}>by Keyros</span>
            </p>
          </a>
          <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
            Connectez-vous a votre boutique
          </p>
        </div>

        {/* Card */}
        <div style={{ background: C.sage, border: `1px solid ${C.sage}`, borderRadius: '16px', padding: '32px' }}>

          {error && (
            <div style={{ padding: '12px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#c00' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: C.dark, display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: C.dark, display: 'block', marginBottom: '6px' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••"
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: loading ? C.muted : C.dark, color: C.cream, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif', marginTop: '4px' }}
            >
              <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: C.muted, marginTop: '24px' }}>
          Pas encore de compte ?{' '}
          <a href="/signup" style={{ color: C.dark, fontWeight: '700', textDecoration: 'none' }}>
            <span>Creer une boutique</span>
          </a>
        </p>

        <p style={{ textAlign: 'center', fontSize: '12px', color: C.muted, marginTop: '40px' }}>
          Tsen@be. Developpe par Keyros.
        </p>
      </div>
    </div>
  );
}