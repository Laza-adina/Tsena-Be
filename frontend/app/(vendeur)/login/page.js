"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { saveSession } from "../../../lib/auth";
import Link from "next/link";
import Image from "next/image";

const C = {
  cream: "#FFFFFF",
  beige: "#F5F5F5",
  sage: "#D9D9D9",
  light: "#EBEBEB",
  caramel: "#3C6E71",
  dark: "#353535",
  muted: "#284B63",
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ whatsapp: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      saveSession(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  const fadeItem = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(20px)",
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: `1px solid ${C.light}`,
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: C.cream,
    color: C.dark,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "400",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.cream,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus {
          border-color: ${C.caramel} !important;
          box-shadow: 0 0 0 3px ${C.caramel}22 !important;
        }
        input::placeholder { color: ${C.muted}; opacity: 0.5; }
        .btn-login {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(53,53,53,0.18);
        }
        .link-signup {
          color: ${C.dark};
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid ${C.dark}40;
          padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .link-signup:hover { border-color: ${C.dark}; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "400px", padding: "0 24px" }}>
        {/* Logo */}
        <div
          style={{ ...fadeItem(0), textAlign: "center", marginBottom: "44px" }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "28px",
                fontWeight: "700",
                color: C.dark,
                margin: "0 0 6px",
                letterSpacing: "-0.5px",
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
                  fontSize: "12px",
                  fontWeight: "300",
                  color: C.muted,
                  marginLeft: "10px",
                  letterSpacing: "0",
                }}
              >
                by Keyros
              </span>
            </p>
          </Link>
          <p
            style={{
              fontSize: "14px",
              color: C.muted,
              margin: 0,
              fontWeight: "300",
            }}
          >
            Connectez-vous à votre boutique
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            ...fadeItem(120),
            background: C.sage,
            borderRadius: "20px",
            padding: "36px 32px",
          }}
        >
          {error && (
            <div
              style={{
                padding: "12px 14px",
                background: "#fff0f0",
                border: "1px solid #fcc",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "#c00",
                fontWeight: "400",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: C.dark, display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Numéro WhatsApp
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="261341234567"
                style={inputStyle}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "7px",
                }}
              >
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: C.dark,
                    display: "block",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Mot de passe
                </label>
                <Link
                  href="/login/forgot-password"
                  style={{
                    fontSize: "12px",
                    color: C.dark,
                    textDecoration: "none",
                    opacity: 0.8,
                    transition: "opacity 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = 1)}
                  onMouseOut={(e) => (e.target.style.opacity = 0.8)}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <button
              className="btn-login"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading ? C.muted : C.dark,
                color: C.cream,
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                marginTop: "6px",
                letterSpacing: "0.2px",
              }}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </div>
        </div>

        <p
          style={{
            ...fadeItem(240),
            textAlign: "center",
            fontSize: "13px",
            color: C.muted,
            marginTop: "24px",
            fontWeight: "300",
          }}
        >
          Pas encore de compte ?{" "}
          <Link href="/signup" className="link-signup">
            Créer une boutique
          </Link>
        </p>

        <p
          style={{
            ...fadeItem(320),
            textAlign: "center",
            fontSize: "12px",
            color: C.muted,
            marginTop: "44px",
            fontWeight: "300",
            opacity: 0.7,
          }}
        >
          Tsen
          <Image
            src="/logo.png"
            alt="@"
            width={13}
            height={13}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              margin: "0 2px",
            }}
          />
          be — Développé par Keyros · Madagascar
        </p>
      </div>
    </div>
  );
}
