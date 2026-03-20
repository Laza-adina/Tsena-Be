'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../../../lib/auth';
import api from '../../../../lib/api';

const ADMIN_WHATSAPP = '261340000000'; // remplace par ton numero

export default function AbonnementPage() {
  const router = useRouter();
  const [user, setUser]               = useState(null);
  const [subscriptions, setSubs]      = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      const { data: meData } = await api.get('/auth/me');
      const u = meData.user;
      setUser({
        ...getSession().user,
        plan: u.plan,
        planExpiresAt: u.plan_expires_at
      });
      fetchHistory();
    } catch {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/subscriptions/history');
      setSubs(data.subscriptions);
    } finally {
      setLoading(false);
    }
  };

  const contactWhatsapp = (planLabel) => {
    const msg = encodeURIComponent(
      `Salama, je voudrais souscrire au plan ${planLabel} pour ma boutique Keyros.`
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, '_blank');
  };

  const daysLeft = user?.planExpiresAt
    ? Math.max(0, Math.ceil((new Date(user.planExpiresAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const planLabel = {
    trial:   'Periode d\'essai',
    monthly: 'Mensuel',
    annual:  'Annuel',
    expired: 'Expire'
  };

  const statusLabel = {
    pending:   'En attente',
    confirmed: 'Confirme',
    rejected:  'Rejete'
  };

  const statusColor = {
    pending:   { background: '#fffbe6', color: '#b8860b' },
    confirmed: { background: '#f0fff4', color: '#060' },
    rejected:  { background: '#fff0f0', color: '#c00' }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#ccd5ae', borderBottom: '1px solid #e5e5e5', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <a href="/dashboard" style={{ fontWeight: '700', fontSize: '16px', color: '#111', textDecoration: 'none' }}>
          <span>Tsen@be</span>
        </a>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/dashboard" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
            <span>Accueil</span>
          </a>
          <a href="/dashboard/produits" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
            <span>Produits</span>
          </a>
          <a href="/dashboard/profil" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
            <span>Profil</span>
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px' }}>

        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 24px' }}>
          Abonnement
        </h1>

       {/* Plan actuel */}
<div style={{ background: '#fff', border: '1px solid #E9EDC9', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
  <p style={{ fontSize: '11px', color: '#6A7A52', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
    Plan actuel
  </p>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <p style={{ fontSize: '20px', fontWeight: '700', color: '#3D4A2A', margin: 0, fontFamily: 'Georgia, serif' }}>
          {user?.plan === 'monthly' ? 'Mensuel'
           : user?.plan === 'annual' ? 'Annuel'
           : user?.plan === 'trial' ? "Periode d'essai"
           : 'Expire'}
        </p>
        <span style={{
          fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
          background: user?.plan === 'monthly' ? '#f0fff4'
            : user?.plan === 'annual' ? '#f0f4ff'
            : user?.plan === 'trial' ? '#fffbe6'
            : '#fff0f0',
          color: user?.plan === 'monthly' ? '#060'
            : user?.plan === 'annual' ? '#1D4ED8'
            : user?.plan === 'trial' ? '#b8860b'
            : '#c00'
        }}>
          {user?.plan === 'monthly' ? 'ACTIF'
           : user?.plan === 'annual' ? 'ACTIF'
           : user?.plan === 'trial' ? 'ESSAI'
           : 'EXPIRE'}
        </span>
      </div>

      {/* Prix selon le plan */}
      {user?.plan === 'monthly' && (
        <p style={{ fontSize: '13px', color: '#6A7A52', margin: '0 0 4px' }}>
          10 000 Ar / mois
        </p>
      )}
      {user?.plan === 'annual' && (
        <p style={{ fontSize: '13px', color: '#6A7A52', margin: '0 0 4px' }}>
          100 000 Ar / an
        </p>
      )}

      {user?.planExpiresAt && (
        <p style={{ fontSize: '13px', color: '#6A7A52', margin: 0 }}>
          {user?.plan === 'trial' ? 'Essai expire le' : 'Renouvellement le'}{' '}
          {new Date(user.planExpiresAt).toLocaleDateString('fr-FR')}
        </p>
      )}
    </div>

    {user?.planExpiresAt && user?.plan !== 'expired' && (
      <div style={{ textAlign: 'right', background: '#ffffff', borderRadius: '10px', padding: '12px 20px' }}>
        <p style={{ fontSize: '36px', fontWeight: '700', color: '#fffff', margin: 0, lineHeight: 1, fontFamily: 'Georgia, serif' }}>
          {daysLeft}
        </p>
        <p style={{ fontSize: '12px', color: '#6A7A52', margin: '4px 0 0' }}>
          jours restants
        </p>
      </div>
    )}
  </div>

  {/* Message selon le plan */}
  {user?.plan === 'expired' && (
    <div style={{ marginTop: '16px', padding: '12px', background: '#fff0f0', borderRadius: '8px', fontSize: '13px', color: '#c00' }}>
      Votre abonnement est expire. Contactez-nous pour renouveler.
    </div>
  )}
  {user?.plan === 'trial' && daysLeft <= 3 && (
    <div style={{ marginTop: '16px', padding: '12px', background: '#fffbe6', borderRadius: '8px', fontSize: '13px', color: '#b8860b' }}>
      Votre essai expire dans {daysLeft} jour(s). Contactez-nous pour continuer.
    </div>
  )}
</div>
        {/* Offres */}
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 12px' }}>
          Nos offres
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>

          {/* Mensuel */}
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 4px' }}>
              Mensuel
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>
              10 000 Ar
            </p>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 16px' }}>
              par mois
            </p>
            <ul style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', paddingLeft: '16px', lineHeight: '1.8' }}>
              <li>Catalogue illimite</li>
              <li>Bouton WhatsApp</li>
              <li>QR Code</li>
              <li>Statistiques</li>
            </ul>
            <button
              onClick={() => contactWhatsapp('Mensuel — 10 000 Ar')}
              style={{ width: '100%', padding: '9px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
            >
              <span>Nous contacter</span>
            </button>
          </div>

          {/* Annuel */}
          <div style={{ background: '#111', border: '1px solid #111', borderRadius: '8px', padding: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>
              Annuel
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>
              100 000 Ar
            </p>
            <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 16px' }}>
              par an — 2 mois offerts
            </p>
            <ul style={{ fontSize: '13px', color: '#ccc', margin: '0 0 16px', paddingLeft: '16px', lineHeight: '1.8' }}>
              <li>Catalogue illimite</li>
              <li>Bouton WhatsApp</li>
              <li>QR Code</li>
              <li>Statistiques</li>
            </ul>
            <button
              onClick={() => contactWhatsapp('Annuel — 100 000 Ar')}
              style={{ width: '100%', padding: '9px', background: '#fff', color: '#111', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
            >
              <span>Nous contacter</span>
            </button>
          </div>
        </div>

        {/* Historique */}
        {subscriptions.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 16px' }}>
              Historique
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subscriptions.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#111', margin: '0 0 2px' }}>
                      {planLabel[s.plan_type] || s.plan_type}
                    </p>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                      {new Date(s.created_at).toLocaleDateString('fr-FR')} — {s.amount.toLocaleString()} Ar
                    </p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '4px', ...statusColor[s.status] }}>
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