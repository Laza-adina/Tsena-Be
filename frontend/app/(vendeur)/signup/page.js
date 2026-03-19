'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { saveSession } from '../../../lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '', shopName: '', whatsapp: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      saveSession(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la creation.');
    } finally {
      setLoading(false);
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 16px' }}>

        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111', marginBottom: '8px', textAlign: 'center' }}>
          Keyros
        </h1>
        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '32px' }}>
          Creez votre boutique en ligne
        </p>

        {error && (
          <div style={{ padding: '12px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#c00' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Nom de la boutique</label>
            <input
              type="text"
              value={form.shopName}
              onChange={e => setForm({ ...form, shopName: e.target.value })}
              placeholder="Ex: Fringues Miora"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="votre@email.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 caracteres"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Numero WhatsApp{' '}
              <span style={{ color: '#999', fontWeight: '400' }}>(ex: 261341234567)</span>
            </label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={e => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="261341234567"
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '11px', background: loading ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
          >
            {loading ? 'Creation...' : 'Creer ma boutique'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '24px' }}>
          Deja un compte ?{' '}
          <a href="/login" style={{ color: '#111', fontWeight: '500' }}>
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}