'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../../../lib/auth';
import api from '../../../../lib/api';

export default function QRCodePage() {
  const router = useRouter();
  const [qrCode, setQrCode]   = useState(null);
  const [shopUrl, setShopUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [slug, setSlug]       = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    setSlug(session.user.shopSlug);
    fetchQR(session.user.shopSlug);
  }, []);

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
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${slug}.png`;
    link.click();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <a href="/dashboard" style={{ fontWeight: '700', fontSize: '16px', color: '#111', textDecoration: 'none' }}>Keyros</a>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/dashboard" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Accueil</a>
          <a href="/dashboard/produits" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Produits</a>
          <a href="/dashboard/profil" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Profil</a>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>

        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 8px' }}>
          QR Code
        </h1>
        <p style={{ fontSize: '13px', color: '#999', margin: '0 0 32px' }}>
          Imprimez ce QR code et collez-le sur votre stand ou carte de visite.
        </p>

        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '32px', display: 'inline-block', marginBottom: '24px' }}>
          {qrCode && (
            <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
          )}
        </div>

        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 24px' }}>
          {shopUrl}
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={handleDownload}
            style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
          >
            Telecharger en PNG
          </button>
          
            href={`/api/qrcode/${slug}/image`}
            rel="noreferrer"
            target="_blank"
            style={{ padding: '10px 20px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}
            <a>
            Ouvrir l'image
          </a>
        </div>
      </div>
    </div>
  );
}