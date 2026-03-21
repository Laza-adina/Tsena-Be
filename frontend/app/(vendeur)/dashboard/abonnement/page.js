"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../../../../lib/auth";
import api from "../../../../lib/api";
import Image from "next/image";
import Link from "next/link";

const C = {
  cream: "#FFFFFF",
  beige: "#F5F5F5",
  sage: "#D9D9D9",
  light: "#EBEBEB",
  caramel: "#3C6E71",
  dark: "#353535",
  muted: "#284B63",
};

const ADMIN_WHATSAPP = "261345159568";

export default function AbonnementPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: meData } = await api.get("/auth/me");
      const u = meData.user;
      setUser({
        ...getSession().user,
        plan: u.plan,
        planExpiresAt: u.plan_expires_at,
      });
      fetchHistory();
    } catch {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/subscriptions/history");
      setSubs(data.subscriptions);
    } finally {
      setLoading(false);
    }
  };

  const contactWhatsapp = (planLabel) => {
    const msg = encodeURIComponent(
      `Salama, je voudrais souscrire au plan ${planLabel} pour ma boutique Tsen@be.`,
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, "_blank");
  };

  const daysLeft = user?.planExpiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(user.planExpiresAt) - new Date()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const planLabel = {
    trial: "Période d'essai",
    monthly: "Mensuel",
    annual: "Annuel",
    expired: "Expiré",
  };

  const statusLabel = {
    pending: "En attente",
    confirmed: "Confirmé",
    rejected: "Rejeté",
  };

  const statusColor = {
    pending: { background: "#fffbe6", color: "#b8860b" },
    confirmed: { background: "#f0fff4", color: "#066" },
    rejected: { background: "#fff0f0", color: "#c00" },
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

        .nav-link-dash {
          font-size: 13px; color: ${C.dark}; text-decoration: none;
          font-weight: 500; padding: 6px 12px; border-radius: 6px;
          transition: background 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-link-dash:hover { background: ${C.light}; }

        .plan-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .plan-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(53,53,53,0.08); }

        .btn-contact {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-contact:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(53,53,53,0.15); }
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
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
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
              }}
            >
              by Keyros
            </span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: "4px" }}>
          <Link href="/dashboard" className="nav-link-dash">
            Accueil
          </Link>
          <Link href="/dashboard/produits" className="nav-link-dash">
            Produits
          </Link>
          <Link href="/dashboard/profil" className="nav-link-dash">
            Profil
          </Link>
        </div>
      </div>

      <div
        style={{ maxWidth: "640px", margin: "0 auto", padding: "36px 24px" }}
      >
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "30px",
            fontWeight: "700",
            color: C.dark,
            margin: "0 0 28px",
            letterSpacing: "-0.5px",
          }}
        >
          Abonnement
        </h1>

        {/* Plan actuel */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.light}`,
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              color: C.muted,
              margin: "0 0 16px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              fontWeight: "600",
            }}
          >
            Plan actuel
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "22px",
                    fontWeight: "700",
                    color: C.dark,
                    margin: 0,
                  }}
                >
                  {user?.plan === "monthly"
                    ? "Mensuel"
                    : user?.plan === "annual"
                      ? "Annuel"
                      : user?.plan === "trial"
                        ? "Période d'essai"
                        : "Expiré"}
                </p>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    letterSpacing: "1px",
                    background:
                      user?.plan === "monthly"
                        ? "#e8f5f0"
                        : user?.plan === "annual"
                          ? "#e8f0f5"
                          : user?.plan === "trial"
                            ? "#fffbe6"
                            : "#fff0f0",
                    color:
                      user?.plan === "monthly"
                        ? C.caramel
                        : user?.plan === "annual"
                          ? C.muted
                          : user?.plan === "trial"
                            ? "#b8860b"
                            : "#c00",
                  }}
                >
                  {user?.plan === "monthly"
                    ? "ACTIF"
                    : user?.plan === "annual"
                      ? "ACTIF"
                      : user?.plan === "trial"
                        ? "ESSAI"
                        : "EXPIRÉ"}
                </span>
              </div>

              {user?.plan === "monthly" && (
                <p
                  style={{
                    fontSize: "13px",
                    color: C.muted,
                    margin: "0 0 4px",
                    fontWeight: "300",
                  }}
                >
                  10 000 Ar / mois
                </p>
              )}
              {user?.plan === "annual" && (
                <p
                  style={{
                    fontSize: "13px",
                    color: C.muted,
                    margin: "0 0 4px",
                    fontWeight: "300",
                  }}
                >
                  100 000 Ar / an
                </p>
              )}

              {user?.planExpiresAt && (
                <p
                  style={{
                    fontSize: "13px",
                    color: C.muted,
                    margin: 0,
                    fontWeight: "300",
                  }}
                >
                  {user?.plan === "trial"
                    ? "Essai expire le"
                    : "Renouvellement le"}{" "}
                  {new Date(user.planExpiresAt).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>

            {user?.planExpiresAt && user?.plan !== "expired" && (
              <div
                style={{
                  textAlign: "center",
                  background: C.beige,
                  borderRadius: "12px",
                  padding: "14px 22px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "38px",
                    fontWeight: "700",
                    color: C.dark,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {daysLeft}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.muted,
                    margin: "4px 0 0",
                    fontWeight: "300",
                  }}
                >
                  jours restants
                </p>
              </div>
            )}
          </div>

          {user?.plan === "expired" && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                background: "#fff0f0",
                border: "1px solid #fcc",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#c00",
                fontWeight: "300",
              }}
            >
              Votre abonnement est expiré. Contactez-nous pour renouveler.
            </div>
          )}
          {user?.plan === "trial" && daysLeft <= 3 && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                background: "#fffbe6",
                border: "1px solid #f5d76e",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#b8860b",
                fontWeight: "300",
              }}
            >
              Votre essai expire dans {daysLeft} jour(s). Contactez-nous pour
              continuer.
            </div>
          )}
        </div>

        {/* Offres */}
        <p
          style={{
            fontSize: "10px",
            fontWeight: "600",
            color: C.muted,
            margin: "0 0 14px",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
          }}
        >
          Nos offres
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {/* Mensuel */}
          <div
            className="plan-card"
            style={{
              background: C.cream,
              border: `1px solid ${C.light}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: "600",
                color: C.muted,
                margin: "0 0 16px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Mensuel
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "34px",
                fontWeight: "700",
                color: C.dark,
                margin: "0 0 2px",
                lineHeight: 1,
              }}
            >
              10 000 Ar
            </p>
            <p
              style={{
                fontSize: "12px",
                color: C.muted,
                margin: "0 0 20px",
                fontWeight: "300",
              }}
            >
              par mois
            </p>
            <ul
              style={{
                fontSize: "13px",
                color: C.muted,
                margin: "0 0 20px",
                paddingLeft: "0",
                listStyle: "none",
                lineHeight: "1.9",
                fontWeight: "300",
              }}
            >
              {[
                "Catalogue illimité",
                "Bouton WhatsApp",
                "QR Code",
                "Statistiques",
              ].map((f) => (
                <li
                  key={f}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: C.muted,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="btn-contact"
              onClick={() => contactWhatsapp("Mensuel — 10 000 Ar")}
              style={{
                width: "100%",
                padding: "11px",
                background: C.dark,
                color: C.cream,
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Nous contacter
            </button>
          </div>

          {/* Annuel */}
          <div
            className="plan-card"
            style={{
              background: C.dark,
              border: `1px solid ${C.dark}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: "600",
                color: C.sage,
                margin: "0 0 16px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Annuel
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "34px",
                fontWeight: "700",
                color: C.cream,
                margin: "0 0 2px",
                lineHeight: 1,
              }}
            >
              100 000 Ar
            </p>
            <p
              style={{
                fontSize: "12px",
                color: C.sage,
                margin: "0 0 20px",
                fontWeight: "300",
              }}
            >
              par an — 2 mois offerts
            </p>
            <ul
              style={{
                fontSize: "13px",
                color: C.sage,
                margin: "0 0 20px",
                paddingLeft: "0",
                listStyle: "none",
                lineHeight: "1.9",
                fontWeight: "300",
              }}
            >
              {[
                "Catalogue illimité",
                "Bouton WhatsApp",
                "QR Code",
                "Statistiques",
              ].map((f) => (
                <li
                  key={f}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: C.sage,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="btn-contact"
              onClick={() => contactWhatsapp("Annuel — 100 000 Ar")}
              style={{
                width: "100%",
                padding: "11px",
                background: C.caramel,
                color: C.cream,
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Nous contacter
            </button>
          </div>
        </div>

        {/* Paiement */}
        <p
          style={{
            fontSize: "12px",
            color: C.muted,
            textAlign: "center",
            margin: "0 0 24px",
            fontWeight: "300",
          }}
        >
          Paiement via MVola, Orange Money ou Airtel Money. Activation manuelle
          sous 24h.
        </p>

        {/* Historique */}
        {subscriptions.length > 0 && (
          <div
            style={{
              background: C.cream,
              border: `1px solid ${C.light}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: "600",
                color: C.muted,
                margin: "0 0 20px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Historique
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {subscriptions.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom:
                      i < subscriptions.length - 1
                        ? `1px solid ${C.light}`
                        : "none",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: C.dark,
                        margin: "0 0 2px",
                      }}
                    >
                      {planLabel[s.plan_type] || s.plan_type}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: C.muted,
                        margin: 0,
                        fontWeight: "300",
                      }}
                    >
                      {new Date(s.created_at).toLocaleDateString("fr-FR")} —{" "}
                      {s.amount.toLocaleString()} Ar
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      letterSpacing: "0.5px",
                      ...statusColor[s.status],
                    }}
                  >
                    {statusLabel[s.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
