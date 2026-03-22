"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, clearSession, saveSession } from '../../../lib/auth';
import api from '../../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Link from 'next/link';

const C = {
  cream: "#FFFFFF",
  beige: "#F5F5F5",
  sage: "#D9D9D9",
  light: "#EBEBEB",
  caramel: "#3C6E71",
  dark: "#353535",
  text: "#353535",
  muted: "#284B63",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session.user);
    fetchStats();
    // Rafraichir le profil pour avoir planExpiresAt à jour
    api.get('/auth/me').then(({ data }) => {
      const u = data.user;
      const updated = {
        ...session.user,
        plan: u.plan,
        planExpiresAt: u.plan_expires_at
      };
      saveSession(session.token, updated);
      setUser(updated);
    }).catch(() => {});
  }, [router]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/stats");
      setStats(data.stats);
    } catch (err) {
      console.log("STATS ERROR:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const fadeItem = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(16px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  const chartData = stats?.chartData || [
    { jour: 'J-6', date: '', vues: 0, clics: 0 },
    { jour: 'J-5', date: '', vues: 0, clics: 0 },
    { jour: 'J-4', date: '', vues: 0, clics: 0 },
    { jour: 'J-3', date: '', vues: 0, clics: 0 },
    { jour: 'J-2', date: '', vues: 0, clics: 0 },
    { jour: 'J-1', date: '', vues: 0, clics: 0 },
    { jour: 'Auj', date: '', vues: 0, clics: 0 },
  ];

  const cardStyle = {
    background: C.cream,
    border: `1px solid ${C.light}`,
    borderRadius: "16px",
    padding: "24px",
    transition: "box-shadow 0.2s ease",
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.cream,
        }}
      >
        <p
          style={{
            color: C.muted,
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "300",
            letterSpacing: "0.5px",
          }}
        >
          Chargement…
        </p>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.beige,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-nav-links { display: flex; align-items: center; gap: 4px; }
        .dash-hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }
        .dash-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .dash-quick-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        .nav-link-dash {
          font-size: 13px; color: ${C.dark}; text-decoration: none;
          font-weight: 500; padding: 6px 12px; border-radius: 6px;
          transition: background 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-link-dash:hover { background: ${C.light}; }

        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(53,53,53,0.08); }

        .quick-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .quick-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(53,53,53,0.08); }

        @media (max-width: 768px) {
          .dash-nav-links { display: none !important; }
          .dash-hamburger { display: flex !important; }
          .dash-stats-grid { grid-template-columns: 1fr !important; }
          .dash-quick-grid { grid-template-columns: 1fr !important; }
          .dash-content { padding: 20px 16px !important; }
        }
      `}</style>

      {/* Navbar */}
      <div
        style={{
          background: C.cream,
          borderBottom: `1px solid ${C.light}`,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "58px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: "700",
            fontSize: "20px",
            color: C.dark,
            letterSpacing: "-0.3px",
          }}
        >
          Tsen
          <Image
            src="/logo.png"
            alt="@"
            width={25}
            height={25}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              margin: "0 0 5px 0",
            }}
          />
          be
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: "300",
              color: C.muted,
              marginLeft: "8px",
              letterSpacing: "0",
            }}
          >
            by Keyros
          </span>
        </span>

        <div className="dash-nav-links">
          {[
            { label: "Produits", href: "/dashboard/produits" },
            { label: "Stats", href: "/dashboard/stats" },
            { label: "Profil", href: "/dashboard/profil" },
            { label: "QR Code", href: "/dashboard/qrcode" },
            { label: "Abonnement", href: "/dashboard/abonnement" },
          ].map((link) => (
            <a key={link.label} href={link.href} className="nav-link-dash">
              {link.label}
            </a>
          ))}
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "8px",
              fontSize: "13px",
              color: C.dark,
              background: C.light,
              border: "none",
              borderRadius: "6px",
              padding: "7px 14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "600",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.background = C.sage)}
            onMouseLeave={(e) => (e.target.style.background = C.light)}
          >
            Déconnexion
          </button>
        </div>

        <button
          className="dash-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            style={{
              width: "22px",
              height: "2px",
              background: C.dark,
              transition: "transform 0.2s",
              transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <div
            style={{
              width: "22px",
              height: "2px",
              background: C.dark,
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.2s",
            }}
          />
          <div
            style={{
              width: "22px",
              height: "2px",
              background: C.dark,
              transition: "transform 0.2s",
              transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: C.cream,
            borderBottom: `1px solid ${C.light}`,
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            position: "sticky",
            top: "58px",
            zIndex: 99,
          }}
        >
          {[
            { label: "Produits", href: "/dashboard/produits" },
            { label: "Stats", href: "/dashboard/stats" },
            { label: "Profil", href: "/dashboard/profil" },
            { label: "QR Code", href: "/dashboard/qrcode" },
            { label: "Abonnement", href: "/dashboard/abonnement" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: "14px",
                color: C.dark,
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "8px",
              padding: "10px 12px",
              background: C.light,
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              color: C.dark,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            Déconnexion
          </button>
        </div>
      )}

      {/* Contenu */}
      <div
        className="dash-content"
        style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 24px" }}
      >
        {/* Titre */}
        <div style={{ ...fadeItem(0), marginBottom: "28px" }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "30px",
              fontWeight: "700",
              color: C.dark,
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}
          >
            Bonjour,{" "}
            <em style={{ fontStyle: "italic", color: C.caramel }}>
              {user?.shopName}
            </em>
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: C.muted,
              margin: 0,
              fontWeight: "300",
            }}
          >
            Votre lien :{" "}
            <a
              href={user?.shopUrl}
              rel="noreferrer"
              target="_blank"
              style={{
                color: C.dark,
                fontWeight: "500",
                textDecoration: "none",
                borderBottom: `1px solid ${C.dark}40`,
                paddingBottom: "1px",
              }}
            >
              {user?.shopUrl}
            </a>
          </p>
        </div>

        {/* Cartes stats */}
        <div className="dash-stats-grid" style={{ marginBottom: "20px" }}>
          {[
            {
              label: "Vues (30 j)",
              value: stats?.last30Days?.pageViews || 0,
              delay: 80,
            },
            {
              label: "Clics WhatsApp",
              value: stats?.last30Days?.whatsappClicks || 0,
              delay: 160,
            },
            { label: "Produits", value: stats?.productCount || 0, delay: 240 },
          ].map(({ label, value, delay }) => (
            <div
              key={label}
              className="stat-card"
              style={{ ...cardStyle, ...fadeItem(delay) }}
            >
              <p
                style={{
                  fontSize: "10px",
                  color: C.muted,
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  fontWeight: "600",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "36px",
                  fontWeight: "700",
                  margin: 0,
                  color: C.dark,
                  lineHeight: 1,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Graphe */}
        <div style={{ ...cardStyle, ...fadeItem(300), marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: C.muted,
              margin: "0 0 20px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Activité de la boutique
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={18}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={C.light}
                vertical={false}
              />
              <XAxis
                dataKey="jour"
                tick={{
                  fontSize: 12,
                  fill: C.muted,
                  fontFamily: "DM Sans, sans-serif",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 12,
                  fill: C.muted,
                  fontFamily: "DM Sans, sans-serif",
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ border: `1px solid ${C.light}`, borderRadius: '10px', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', background: C.cream, color: C.dark }}
                cursor={{ fill: C.light }}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.date ? `${label} — ${item.date}` : label;
                }}
              />
              <Bar
                dataKey="vues"
                name="Vues"
                fill={C.dark}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="clics"
                name="Clics WA"
                fill={C.caramel}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accès rapides */}
        <div className="dash-quick-grid" style={fadeItem(380)}>
          <Link
            href="/dashboard/produits"
            className="quick-card"
            style={{ ...cardStyle, textDecoration: "none", display: "block" }}
          >
            <p
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: C.dark,
                margin: "0 0 6px",
              }}
            >
              Gérer les produits
            </p>
            <p
              style={{
                fontSize: "13px",
                color: C.muted,
                margin: 0,
                fontWeight: "300",
              }}
            >
              Ajouter, modifier ou supprimer vos articles
            </p>
          </Link>
          <Link
            href="/dashboard/profil"
            className="quick-card"
            style={{ ...cardStyle, textDecoration: "none", display: "block" }}
          >
            <p
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: C.dark,
                margin: "0 0 6px",
              }}
            >
              Modifier le profil
            </p>
            <p
              style={{
                fontSize: "13px",
                color: C.muted,
                margin: 0,
                fontWeight: "300",
              }}
            >
              Photo, description, liens de contact
            </p>
          </Link>
        </div>

        {/* Bannière essai */}
        {user?.plan === "trial" && (
          <div
            style={{
              ...fadeItem(440),
              marginTop: "20px",
              padding: "18px 22px",
              background: C.dark,
              borderRadius: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "17px",
                  fontWeight: "700",
                  color: C.cream,
                  margin: "0 0 3px",
                  letterSpacing: "-0.2px",
                }}
              >
                Période d&apos;essai en cours
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: C.sage,
                  margin: 0,
                  fontWeight: "300",
                }}
              >
                Expire le{" "}
                {user?.planExpiresAt
                  ? new Date(user.planExpiresAt).toLocaleDateString("fr-FR")
                  : "—"}
              </p>
            </div>
            <Link
              href="/dashboard/abonnement"
              style={{
                fontSize: "13px",
                color: C.cream,
                background: C.caramel,
                padding: "8px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "opacity 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              Voir les offres
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
