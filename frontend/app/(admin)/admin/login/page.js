'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { saveAdminSession } from '../../../../lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', form);
      saveAdminSession(data.token, data.admin);
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #e5e5e5', borderRadius: '6px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 16px' }}>

        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '4px', textAlign: 'center' }}>
          Keyros Admin
        </h1>
        <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', marginBottom: '32px' }}>
          Acces reserve
        </p>

        {error && (
          <div style={{ padding: '12px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#c00' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#333', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#333', display: 'block', marginBottom: '6px' }}>Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ padding: '11px', background: loading ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}