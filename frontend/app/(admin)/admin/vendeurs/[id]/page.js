'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function VendeurDetailPage() {
  const params = useParams();
  const id = params.id;

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/vendors/${id}`);
      setVendor(res.data);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (planType) => {
    setActivating(true);
    try {
      await api.put(`/admin/vendors/${id}/activate`, { planType });
      fetchDetail();
      alert('Plan activé avec succès');
    } catch (err) {
      alert('Erreur activation.');
    } finally {
      setActivating(false);
    }
  };

  const handlePlan = async () => {
    const newPlan = vendor.plan === 'premium' ? 'free' : 'premium';
    try {
      await api.put(`/admin/vendors/${id}`, { plan: newPlan });
      fetchDetail();
    } catch (err) {
      alert('Erreur lors du changement de plan');
    }
  };

  const handleToggle = async () => {
    try {
      await api.put(`/admin/vendors/${id}`, { is_active: !vendor.is_active });
      fetchDetail();
    } catch (err) {
      alert('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      await api.delete(`/admin/vendors/${id}`);
      window.location.href = '/admin/vendeurs';
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Chargement...</div>;
  }

  if (error || !vendor) {
    return <div style={{ padding: '32px', textAlign: 'center', color: '#c00' }}>{error}</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '16px 24px' }}>
        <Link
          href="/admin/vendeurs"
          style={{ color: '#007AFF', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}
        >
          ← Retour
        </Link>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Header section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>
              {vendor.shop_name}
            </h1>
            <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
              {vendor.email}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Bouton Plan */}
            <button
              onClick={handlePlan}
              disabled={activating}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: activating ? 'not-allowed' : 'pointer',
                border: 'none',
                background: vendor.plan === 'premium' ? '#f5f5f5' : '#111',
                color: vendor.plan === 'premium' ? '#555' : '#fff',
                transition: 'all 0.2s ease',
                opacity: activating ? 0.6 : 1
              }}
            >
              <span>
                {vendor.plan === 'premium' ? 'Passer en gratuit' : 'Passer en premium'}
              </span>
            </button>

            {/* Bouton Statut */}
            <button
              onClick={handleToggle}
              disabled={activating}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: activating ? 'not-allowed' : 'pointer',
                border: 'none',
                background: vendor.is_active ? '#fff0f0' : '#f0fff4',
                color: vendor.is_active ? '#c00' : '#060',
                transition: 'all 0.2s ease',
                opacity: activating ? 0.6 : 1
              }}
            >
              <span>
                {vendor.is_active ? 'Désactiver' : 'Activer'}
              </span>
            </button>

            {/* Bouton Supprimer */}
            <button
              onClick={handleDelete}
              disabled={activating}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: activating ? 'not-allowed' : 'pointer',
                border: '1px solid #fcc',
                background: '#fff',
                color: '#c00',
                transition: 'all 0.2s ease',
                opacity: activating ? 0.6 : 1
              }}
            >
              <span>Supprimer</span>
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px', textTransform: 'uppercase' }}>
              Plan
            </p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111', margin: 0 }}>
              {vendor.plan === 'premium' ? '⭐ Premium' : '📱 Gratuit'}
            </p>
          </div>

          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px', textTransform: 'uppercase' }}>
              Statut
            </p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: vendor.is_active ? '#060' : '#c00', margin: 0 }}>
              {vendor.is_active ? '✅ Actif' : '❌ Inactif'}
            </p>
          </div>
        </div>
        {/* Activation abonnement */}
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
  <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 16px' }}>
    Activer un abonnement
  </p>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button
      onClick={() => handleActivate('monthly')}
      disabled={activating}
      style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
    >
      <span>Mensuel — 10 000 Ar</span>
    </button>
    <button
      onClick={() => handleActivate('annual')}
      disabled={activating}
      style={{ flex: 1, padding: '10px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
    >
      <span>Annuel — 100 000 Ar</span>
    </button>
  </div>
  {activating && (
    <p style={{ fontSize: '13px', color: '#999', margin: '12px 0 0', textAlign: 'center' }}>
      Activation en cours...
    </p>
  )}
</div>

        {/* Produits */}
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 12px' }}>
            Produits ({vendor.products?.length || 0})
          </h2>

          {vendor.products && vendor.products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {vendor.products.map(product => (
                <div key={product.id} style={{ textAlign: 'center' }}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#333', margin: '8px 0 0', fontWeight: '500' }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0' }}>
                    {product.price.toLocaleString()} Ar
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#999' }}>Aucun produit</p>
          )}
        </div>
      </div>
    </div>
  );
}