'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession } from '../../../../lib/auth';
import api from '../../../../lib/api';

export default function AdminVendeursPage() {
  const router = useRouter();
  const [vendors, setVendors]     = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [form, setForm] = useState({
    email: '', password: '', shopName: '', whatsapp: '', plan: 'free'
  });

  useEffect(() => {
    const session = getAdminSession();
    if (!session) { router.push('/admin/login'); return; }
    fetchVendors();
  }, [search, filterPlan]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)     params.append('search', search);
      if (filterPlan) params.append('plan', filterPlan);

      const { data } = await api.get(`/admin/vendors?${params}`, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      setVendors(data.vendors);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setError('');
    if (!form.email || !form.password || !form.shopName) {
      setError('Email, mot de passe et nom de boutique requis.'); return;
    }
    setSaving(true);
    try {
      await api.post('/admin/vendors', form, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      setShowForm(false);
      setForm({ email: '', password: '', shopName: '', whatsapp: '', plan: 'free' });
      fetchVendors();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la creation.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.put(`/admin/vendors/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      fetchVendors();
    } catch {
      alert('Erreur.');
    }
  };

  const handlePlan = async (id, currentPlan) => {
    const newPlan = currentPlan === 'premium' ? 'free' : 'premium';
    try {
      await api.put(`/admin/vendors/${id}/plan`, { plan: newPlan, months: 1 }, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      fetchVendors();
    } catch {
      alert('Erreur.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer definitivement ce compte ?')) return;
    try {
      await api.delete(`/admin/vendors/${id}`, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      fetchVendors();
    } catch {
      alert('Erreur.');
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
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#111', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <a href="/admin" style={{ fontWeight: '700', fontSize: '15px', color: '#fff', textDecoration: 'none' }}>Keyros Admin</a>
        <a href="/admin" style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none' }}>Dashboard</a>
        <a href="/admin/abonnements" style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none' }}>
        <span>Abonnements</span>
      </a>
            </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>Vendeurs</h1>
            <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>{total} compte(s) au total</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
          >
            Creer un compte
          </button>
        </div>

        {/* Formulaire creation */}
        {showForm && (
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111', margin: '0 0 20px' }}>
              Nouveau compte vendeur
            </h2>

            {error && (
              <div style={{ padding: '10px 12px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#c00' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nom de la boutique</label>
                <input type="text" value={form.shopName} onChange={e => setForm({ ...form, shopName: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mot de passe</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp</label>
                <input type="text" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="261341234567" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Plan</label>
                <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} style={{ ...inputStyle }}>
                  <option value="trial">Essai (7 jours)</option>
                  <option value="active">Actif</option>
                  <option value="expired">Expiré</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleCreate}
                disabled={saving}
                style={{ padding: '9px 18px', background: saving ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Creation...' : 'Creer le compte'}
              </button>
              <button
                onClick={() => { setShowForm(false); setError(''); }}
                style={{ padding: '9px 18px', background: '#fff', color: '#555', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            style={{ flex: 1, padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
          />
          <select
            value={filterPlan}
            onChange={e => setFilterPlan(e.target.value)}
            style={{ padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff' }}
          >
            <option value="">Tous les plans</option>
            <option value="free">Gratuit</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        {/* Tableau vendeurs */}
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>Aucun vendeur trouve.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                {['Boutique', 'Email', 'WhatsApp', 'Plan', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#999', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <span>{h}</span>
                  </th>
                ))}
                </tr>
              </thead>
              <tbody>
                {vendors.map((v, i) => (
                  <tr key={v.id} style={{ borderBottom: i < vendors.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#111', margin: '0 0 2px' }}>{v.shop_name}</p>
                      <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{v.shop_slug}</p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{v.email}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{v.whatsapp || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                    <div>
  <span style={{
    fontSize: '11px', fontWeight: '600',
    padding: '3px 10px', borderRadius: '20px', display: 'inline-block',
    background: v.plan === 'monthly' ? '#f0fff4'
      : v.plan === 'annual' ? '#f0f4ff'
      : v.plan === 'trial' ? '#fffbe6'
      : '#fff0f0',
    color: v.plan === 'monthly' ? '#060'
      : v.plan === 'annual' ? '#1D4ED8'
      : v.plan === 'trial' ? '#b8860b'
      : '#c00'
  }}>
    {v.plan === 'monthly' ? 'Mensuel'
      : v.plan === 'annual' ? 'Annuel'
      : v.plan === 'trial' ? 'Essai'
      : 'Expire'}
  </span>
  {v.plan === 'trial' && v.plan_expires_at && (
    <p style={{ fontSize: '11px', color: '#999', margin: '3px 0 0' }}>
      {Math.max(0, Math.ceil((new Date(v.plan_expires_at) - new Date()) / (1000 * 60 * 60 * 24)))} jours
    </p>
  )}
  {(v.plan === 'monthly' || v.plan === 'annual') && v.plan_expires_at && (
    <p style={{ fontSize: '11px', color: '#999', margin: '3px 0 0' }}>
      expire le {new Date(v.plan_expires_at).toLocaleDateString('fr-FR')}
    </p>
  )}
</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleToggle(v.id)}
                        style={{
                          fontSize: '11px', fontWeight: '500',
                          padding: '4px 10px', borderRadius: '4px', cursor: 'pointer',
                          background: v.is_active ? '#f0fff4' : '#fff0f0',
                          color: v.is_active ? '#060' : '#c00',
                          border: 'none'
                        }}
                      >
                        {v.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a
                          href={`/admin/vendeurs/${v.id}`}
                          style={{ 
                            fontSize: '12px', 
                            padding: '5px 10px', 
                            border: '1px solid #e5e5e5', 
                            borderRadius: '4px', 
                            color: '#333', 
                            textDecoration: 'none', 
                            display: 'inline-block',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span>Detail</span>
                        </a>

                        <button
                          onClick={() => handleDelete(v.id)}
                          style={{ 
                            fontSize: '12px', 
                            padding: '5px 10px', 
                            border: '1px solid #fcc', 
                            borderRadius: '4px', 
                            color: '#c00', 
                            background: '#fff', 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => e.target.style.background = '#fff0f0'}
                          onMouseLeave={e => e.target.style.background = '#fff'}
                        >
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}