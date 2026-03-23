'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession } from '../../../../lib/auth';
import api from '../../../../lib/api';

export default function AbonnementsPage() {
  const router = useRouter();
  const [subscriptions, setSubs] = useState([]);
  const [loading, setLoading]    = useState(true);
  const [filter, setFilter]      = useState('');

  useEffect(() => {
    const session = getAdminSession();
    if (!session) { router.push('/admin/login'); return; }
    fetchSubs();
  }, [filter]);

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const { data } = await api.get(`/admin/subscriptions${params}`);
      setSubs(data.subscriptions);
    } finally {
      setLoading(false);
    }
  };

  const planLabel = {
    monthly: 'Mensuel',
    annual:  'Annuel',
    trial:   'Essai'
  };

  const statusColor = {
    pending:   { background: '#fffbe6', color: '#b8860b' },
    confirmed: { background: '#f0fff4', color: '#060' },
    rejected:  { background: '#fff0f0', color: '#c00' }
  };

  const statusLabel = {
    pending:   'En attente',
    confirmed: 'Confirme',
    rejected:  'Rejete'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#111', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <a href="/admin" style={{ fontWeight: '700', fontSize: '15px', color: '#fff', textDecoration: 'none' }}>
          <span>Keyros Admin</span>
        </a>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/admin" style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none' }}>
            <span>Dashboard</span>
          </a>
          <a href="/admin/vendeurs" style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none' }}>
            <span>Vendeurs</span>
          </a>
          <a href="/admin/abonnements" style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none' }}>
            <span>Abonnements</span>
            </a>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: 0 }}>
            Abonnements
          </h1>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff' }}
          >
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmes</option>
            <option value="rejected">Rejetes</option>
          </select>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>Aucun abonnement.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  {['Vendeur', 'Plan', 'Montant', 'Date', 'Statut', 'Plan actuel'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#999', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <span>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < subscriptions.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#111', margin: '0 0 2px' }}>
                        {s.users?.shop_name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                        {s.users?.email}
                      </p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>
                      {planLabel[s.plan_type] || s.plan_type}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>
                      {s.amount.toLocaleString()} Ar
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>
                      {new Date(s.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '4px', ...statusColor[s.status] }}>
                        {statusLabel[s.status]}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: '12px', color: '#555', margin: '0 0 2px' }}>
                        {s.users?.plan}
                      </p>
                      {s.users?.plan_expires_at && (
                        <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
                          {Math.max(0, Math.ceil((new Date(s.users.plan_expires_at) - new Date()) / (1000 * 60 * 60 * 24)))} jours
                        </p>
                      )}
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