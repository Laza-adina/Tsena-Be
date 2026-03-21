"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../../../../lib/auth";
import api from "../../../../lib/api";
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

export default function QRCodePage() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState(null);
  const [shopUrl, setShopUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setSlug(session.user.shopSlug);
    fetchQR(session.user.shopSlug);
  }, [router]);

  const fetchQR = async (shopSlug) => {
    try {
      const { data } = await api.get(`/qrcode/${shopSlug}`);
      setQrCode(data.qrCode);
      setShopUrl(data.shopUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qrcode-${slug}.png`;
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        .btn-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(53,53,53,0.15); }

        .btn-secondary {
          transition: background 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-secondary:hover { background: ${C.sage} !important; }
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

      {/* Contenu */}
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "30px",
            fontWeight: "700",
            color: C.dark,
            margin: "0 0 8px",
            letterSpacing: "-0.5px",
          }}
        >
          QR Code
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: C.muted,
            margin: "0 0 36px",
            fontWeight: "300",
            lineHeight: "1.7",
          }}
        >
          Imprimez ce QR code et collez-le sur votre stand ou carte de visite.
        </p>

        {/* QR Card */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.light}`,
            borderRadius: "20px",
            padding: "36px",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          {qrCode && (
            <Image
              src={qrCode}
              alt="QR Code"
              style={{ width: "200px", height: "200px", display: "block" }}
            />
          )}
        </div>

        {/* URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: C.cream,
            border: `1px solid ${C.light}`,
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "24px",
            cursor: "pointer",
          }}
          onClick={handleCopy}
        >
          <p
            style={{
              fontSize: "13px",
              color: C.muted,
              margin: 0,
              fontWeight: "300",
              flex: 1,
              textAlign: "left",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {shopUrl}
          </p>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: copied ? C.caramel : C.muted,
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
          >
            {copied ? "Copié ✓" : "Copier"}
          </span>
        </div>

        {/* Boutons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            className="btn-primary"
            onClick={handleDownload}
            style={{
              padding: "12px 24px",
              background: C.dark,
              color: C.cream,
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Télécharger en PNG
          </button>
          <button
            className="btn-secondary"
            onClick={handleCopy}
            style={{
              padding: "12px 24px",
              background: C.light,
              color: C.dark,
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            {copied ? "Copié ✓" : "Copier le lien"}
          </button>
        </div>
      </div>
    </div>
  );
}
