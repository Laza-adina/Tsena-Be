'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession, clearAdminSession } from '../../../lib/auth';
import api from '../../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin]   = useState(null);
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const session = getAdminSession();
    if (!session) { router.push('/admin/login'); return; }
    setAdmin(session.admin);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/admin/dashboard', {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      setStats(data.stats);
      setRecent(data.recentVendors);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Add login logic here
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { label: 'Total',    value: stats?.totalVendors   || 0 },
    { label: 'Actifs',   value: stats?.premiumVendors  || 0 },
    { label: 'En essai', value: stats?.freeVendors     || 0 },
    { label: 'Produits', value: stats?.totalProducts   || 0 },
  ];

  const cardStyle = {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    padding: '20px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '12px'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar admin */}
      <div style={{ background: '#111', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <span style={{ fontWeight: '700', fontSize: '15px', color: '#fff' }}>Keyros Admin</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="/admin/vendeurs" style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none' }}>Vendeurs</a>
          <a href="/admin/abonnements" style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none' }}>
          <span>Abonnements</span>
        </a>
          <button
            onClick={handleLogout}
            style={{ fontSize: '13px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Deconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
            Bienvenue, {admin?.name}
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div>
            <label style={{ 
              fontSize: '13px', 
              fontWeight: '500', 
              color: '#333', 
              display: 'block', 
              marginBottom: '6px' 
            }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <label style={{ 
              fontSize: '13px', 
              fontWeight: '500', 
              color: '#333', 
              display: 'block', 
              marginBottom: '6px' 
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: '#FFE5E5',
              color: '#C00',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '12px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              background: loading ? '#ccc' : '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '12px',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '13px',
            color: '#666'
          }}>
            Pas encore de compte ?{' '}
            <a 
              href="/signup"
              style={{
                color: '#007AFF',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              S'inscrire
            </a>
          </p>
        </div>

        {/* Cartes stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Vendeurs total',  value: stats?.totalVendors   || 0 },
            { label: 'Premium',         value: stats?.premiumVendors  || 0 },
            { label: 'Gratuit',         value: stats?.freeVendors     || 0 },
            { label: 'Produits total',  value: stats?.totalProducts   || 0 },
          ].map((s, i) => (
            <div key={i} style={cardStyle}>
              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {s.label}
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: 0 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Graphe */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 20px' }}>
            Vue globale
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '12px' }}
                cursor={{ fill: '#f5f5f5' }}
              />
              <Bar dataKey="value" name="Total" fill="#111" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Derniers vendeurs */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: 0 }}>
              Derniers inscrits
            </p>
            <a href="/admin/vendeurs" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
              Voir tous
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recent.map(v => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#111', margin: '0 0 2px' }}>{v.shop_name}</p>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{v.email}</p>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: '500',
                  padding: '3px 8px', borderRadius: '4px',
                  background: v.plan === 'premium' ? '#111' : '#f5f5f5',
                  color: v.plan === 'premium' ? '#fff' : '#555'
                }}>
                  {v.plan}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}