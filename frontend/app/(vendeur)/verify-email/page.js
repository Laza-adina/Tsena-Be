"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../../lib/api";
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

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token de vérification manquant.");
        return;
      }
      try {
        const { data } = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(data.message || "Email vérifié avec succès !");
        setTimeout(() => router.push("/login"), 4000);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "La vérification a échoué.");
      }
    };

    verifyToken();
  }, [token, router]);

  const fadeItem = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(20px)",
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
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
          Vérification d&apos;e-mail
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          ...fadeItem(120),
          background: C.sage,
          borderRadius: "20px",
          padding: "36px 32px",
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <p style={{ color: C.dark, fontSize: "15px" }}>
            Vérification en cours...
          </p>
        )}

        {status === "error" && (
          <div
            style={{
              padding: "16px",
              background: "#fff0f0",
              border: "1px solid #fcc",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#c00",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}

        {status === "success" && (
          <div
            style={{
              padding: "16px",
              background: "#f0fff0",
              border: "1px solid #cfc",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#080",
              fontWeight: "500",
            }}
          >
            {message}
            <p style={{ marginTop: "10px", fontSize: "12px", color: C.muted }}>
              Redirection en cours...
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          ...fadeItem(240),
          textAlign: "center",
          marginTop: "32px",
          fontSize: "14px",
          color: C.muted,
        }}
      >
        <Link href="/login" className="link-back">
          Aller à la connexion
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
        .link-back {
          color: ${C.dark};
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid ${C.dark}40;
          padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .link-back:hover { border-color: ${C.dark}; }
      `}</style>

      <Suspense fallback={<div>Chargement...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
