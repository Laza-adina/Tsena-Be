'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '../../../../lib/auth';
import api from '../../../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const C = {
  main:    '#D9D9D9',
  light:   '#EBEBEB',
  cream:   '#FFFFFF',
  beige:   '#F5F5F5',
  caramel: '#3C6E71',
  dark:    '#353535',
  muted:   '#284B63',
};

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0px)' : 'translateY(28px)',
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/stats');
      setStats(data.stats);
    } finally {
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    }
  };

  const chartData7j = stats?.chartData || [];

  const cardStyle = {
    background: C.cream,
    border: `1px solid ${C.light}`,
    borderRadius: '16px',
    padding: '24px',
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.cream }}>
      <p style={{ color: C.muted, fontSize: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: '300' }}>Chargement…</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.beige, fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .stats-nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link-stats {
          font-size: 13px; color: ${C.dark}; text-decoration: none;
          font-weight: 500; padding: 6px 12px; border-radius: 6px;
          transition: background 0.15s ease; font-family: 'DM Sans', sans-serif;
        }
        .nav-link-stats:hover { background: ${C.light}; }
        .stat-card-s { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card-s:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(53,53,53,0.08); }
        @media (max-width: 768px) {
          .stats-nav-links { display: none !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .stats-content { padding: 20px 16px !important; }
        }
      `}</style>

      {/* Navbar */}
      <div style={{ background: C.cream, borderBottom: `1px solid ${C.light}`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/dashboard" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: '700', fontSize: '20px', color: C.dark, textDecoration: 'none', letterSpacing: '-0.3px' }}>
          Tsen<span style={{ color: C.caramel }}>@</span>be
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '300', color: C.muted, marginLeft: '8px' }}>by Keyros</span>
        </Link>
        <div className="stats-nav-links">
          {[
            { label: 'Accueil',    href: '/dashboard' },
            { label: 'Produits',   href: '/dashboard/produits' },
            { label: 'Profil',     href: '/dashboard/profil' },
            { label: 'QR Code',    href: '/dashboard/qrcode' },
            { label: 'Abonnement', href: '/dashboard/abonnement' },
          ].map(link => (
            <a key={link.label} href={link.href} className="nav-link-stats">{link.label}</a>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="stats-content" style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Titre */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          marginBottom: '28px'
        }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '30px', fontWeight: '700', color: C.dark, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Statistiques
          </h1>
          <p style={{ fontSize: '13px', color: C.muted, fontWeight: '300' }}>
            Activité de votre boutique sur les 7 derniers jours
          </p>
        </div>

        {/* Cartes */}
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Vues (7j)',           value: stats?.last30Days?.pageViews || 0,      delay: 80  },
            { label: 'Clics WhatsApp (7j)',  value: stats?.last30Days?.whatsappClicks || 0, delay: 160 },
            { label: 'Produits',             value: stats?.productCount || 0,               delay: 240 },
          ].map(({ label, value, delay }) => (
            <div key={label} className="stat-card-s" style={{
              ...cardStyle,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }}>
              <p style={{ fontSize: '10px', color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>{label}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', fontWeight: '700', margin: 0, color: C.dark, lineHeight: 1 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Graphe 7 jours */}
        <FadeIn delay={300}>
          <div style={{ ...cardStyle, marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Evolution sur 7 jours
            </p>
            <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 24px', fontWeight: '300' }}>
              Vues de la boutique et clics WhatsApp par jour
            </p>
            {chartData7j.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ fontSize: '14px', color: C.muted, fontWeight: '300' }}>
                  Pas encore de données. Partagez votre lien pour recevoir des visites.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData7j} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.light} vertical={false} />
                  <XAxis dataKey="jour" tick={{ fontSize: 11, fill: C.muted, fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: C.muted, fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ border: `1px solid ${C.light}`, borderRadius: '10px', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', background: C.cream, color: C.dark, boxShadow: '0 4px 16px rgba(53,53,53,0.08)' }}
                    cursor={{ fill: C.light }}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.date ? `${label} — ${item.date}` : label;
                    }}
                  />
                  <Bar dataKey="vues"  name="Vues"     fill={C.dark}    radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clics" name="Clics WA" fill={C.caramel} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </FadeIn>

        {/* Résumé global */}
        <FadeIn delay={400}>
          <div style={cardStyle}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: C.muted, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Résumé global
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { label: 'Vues',     value: stats?.last30Days?.pageViews || 0 },
                { label: 'Clics WA', value: stats?.last30Days?.whatsappClicks || 0 },
                { label: 'Produits', value: stats?.productCount || 0 },
              ]} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.light} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: C.muted, fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: C.muted, fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ border: `1px solid ${C.light}`, borderRadius: '10px', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', background: C.cream, color: C.dark, boxShadow: '0 4px 16px rgba(53,53,53,0.08)' }}
                  cursor={{ fill: C.light }}
                />
                <Bar dataKey="value" name="Total" fill={C.caramel} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}