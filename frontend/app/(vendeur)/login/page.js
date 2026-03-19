'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { saveSession } from '../../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 16px' }}>

        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111', marginBottom: '8px', textAlign: 'center' }}>
          Keyros
        </h1>
        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '32px' }}>
          Connectez-vous a votre boutique
        </p>

        {error && (
          <div style={{ padding: '12px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#c00' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#333', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="votre@email.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#333', display: 'block', marginBottom: '6px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '11px', background: loading ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '24px' }}>
          Pas encore de compte ?{' '}
          <a href="/signup" style={{ color: '#111', fontWeight: '500' }}>
            Creer une boutique
          </a>
        </p>
      </div>
    </div>
  );
}