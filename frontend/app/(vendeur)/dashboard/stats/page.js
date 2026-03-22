"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../../../lib/auth';
import api from '../../../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Link } from 'lucide-react';

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/stats");
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { label: 'Vues',     value: stats?.last30Days?.pageViews || 0 },
  { label: 'Clics WA', value: stats?.last30Days?.whatsappClicks || 0 },
  { label: 'Produits', value: stats?.productCount || 0 },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{ background: '#ccd5ae', borderBottom: '1px solid #e5e5e5', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <Link href="/dashboard" style={{ fontWeight: '700', fontSize: '16px', color: '#111', textDecoration: 'none' }}>
          <span>Tsen@be</span>
        </Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/dashboard" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
            <span>Accueil</span>
          </Link>
          <Link href="/dashboard/produits" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
            <span>Produits</span>
          </Link>
          <Link href="/dashboard/profil" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
            <span>Profil</span>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 24px' }}>
          Statistiques
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
           { label: 'Vues (30j)',           value: stats?.last30Days?.pageViews || 0 },
           { label: 'Clics WhatsApp (30j)', value: stats?.last30Days?.whatsappClicks || 0 },
           { label: 'Produits',             value: stats?.productCount || 0 },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px' }}>
              <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {s.label}
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: 0 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 20px' }}>
            Apercu des 30 derniers jours
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} barSize={40}>
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
      </div>
    </div>
  );
}
