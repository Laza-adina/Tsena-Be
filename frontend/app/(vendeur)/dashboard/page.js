'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, clearSession } from '../../../lib/auth';
import api from '../../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const router              = useRouter();
  const [user, setUser]     = useState(null);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    setUser(session.user);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/stats');
      console.log('STATS RESPONSE:', JSON.stringify(data));
      setStats(data.stats);
    } catch (err) {
      console.log('STATS ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  // Données du graphe — 7 derniers jours simulés depuis les stats globales
  const chartData = [
    { jour: 'J-6', vues: 0, clics: 0 },
    { jour: 'J-5', vues: 0, clics: 0 },
    { jour: 'J-4', vues: 0, clics: 0 },
    { jour: 'J-3', vues: 0, clics: 0 },
    { jour: 'J-2', vues: 0, clics: 0 },
    { jour: 'J-1', vues: 0, clics: 0 },
    { jour: "Auj", vues: stats?.last30Days?.pageViews || 0, clics: stats?.last30Days?.whatsappClicks || 0 },
  ];

  const cardStyle = {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    padding: '20px'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

   {/* Navbar */}
<div style={{ background: '#ccd5ae', borderBottom: '1px solid #E9EDC9', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
  <span style={{ fontWeight: '700', fontSize: '16px', color: '#3D4A2A', fontFamily: 'Georgia, serif' }}>
    Tsen@be
    <span style={{ fontSize: '11px', fontWeight: '400', color: '#3D4A2A', marginLeft: '6px' }}>by Keyros</span>
  </span>
  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
    <a href="/dashboard/produits" style={{ fontSize: '13px', color: '#3D4A2A', textDecoration: 'none' }}><span>Produits</span></a>
    <a href="/dashboard/stats" style={{ fontSize: '13px', color: '#3D4A2A', textDecoration: 'none' }}><span>Stats</span></a>
    <a href="/dashboard/profil" style={{ fontSize: '13px', color: '#3D4A2A', textDecoration: 'none' }}><span>Profil</span></a>
    <a href="/dashboard/qrcode" style={{ fontSize: '13px', color: '#3D4A2A', textDecoration: 'none' }}><span>QR Code</span></a>
    <a href="/dashboard/abonnement" style={{ fontSize: '13px', color: '#3D4A2A', textDecoration: 'none' }}><span>Abonnement</span></a>
    <button
      onClick={handleLogout}
      style={{ fontSize: '13px', color: '#3D4A2A', background: '#CCD5AE', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: '600' }}
    >
      <span>Deconnexion</span>
    </button>
  </div>
</div>

      {/* Contenu */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px', }}>

        {/* Titre */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>
            Bonjour, {user?.shopName}
          </h1>
          <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
            Votre lien :{' '}
            <a
              href={user?.shopUrl}
              rel="noreferrer"
              target="_blank"
              style={{ color: '#111', fontWeight: '500' }}
            >
              {user?.shopUrl}
            </a>
          </p>
        </div>

        {/* Cartes stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={cardStyle}>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Vues (30j)
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#111' }}>
            {stats?.last30Days?.pageViews || 0}
            </p>
          </div>

          <div style={cardStyle}>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Clics WhatsApp
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#111' }}>
            {stats?.last30Days?.whatsappClicks || 0}
            </p>
          </div>

          <div style={cardStyle}>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Produits
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#111' }}>
            {stats?.productCount || 0}
            </p>
          </div>
        </div>

        {/* Graphe */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 20px' }}>
            Activite de la boutique
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="jour" tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '12px' }}
                cursor={{ fill: '#f5f5f5' }}
              />
              <Bar dataKey="vues" name="Vues" fill="#111" radius={[3, 3, 0, 0]} />
              <Bar dataKey="clics" name="Clics WA" fill="#ccc" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Acces rapides */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <a href="/dashboard/produits" style={{ ...cardStyle, textDecoration: 'none', display: 'block' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px' }}>
              Gerer les produits
            </p>
            <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
              Ajouter, modifier ou supprimer vos articles
            </p>
          </a>
          <a href="/dashboard/profil" style={{ ...cardStyle, textDecoration: 'none', display: 'block' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px' }}>
              Modifier le profil
            </p>
            <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
              Photo, description, liens de contact
            </p>
          </a>
        </div>

        {/* Banner upgrade si free */}
        {user?.plan === 'trial' && (
          <div style={{ marginTop: '24px', padding: '16px 20px', background: '#000', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 2px' }}>
              Periode d'essai
            </p>
            <p style={{ fontSize: '13px', color: '#fff', margin: 0 }}>
              Votre essai gratuit expire le {new Date(user?.planExpiresAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}