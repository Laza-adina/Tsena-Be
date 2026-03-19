'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAdminSession } from '../../../../../lib/auth';
import api from '../../../../../lib/api';

export default function VendeurDetailPage() {
  const router      = useRouter();
  const { id }      = useParams();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getAdminSession();
    if (!session) { router.push('/admin/login'); return; }
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const { data: res } = await api.get(`/admin/vendors/${id}`, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  const handlePlan = async () => {
    const newPlan = data.vendor.plan === 'premium' ? 'free' : 'premium';
    try {
      await api.put(`/admin/vendors/${id}/plan`, { plan: newPlan, months: 1 }, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      fetchDetail();
    } catch {
      alert('Erreur.');
    }
  };

  const handleToggle = async () => {
    try {
      await api.put(`/admin/vendors/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      fetchDetail();
    } catch {
      alert('Erreur.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer definitivement ce compte ?')) return;
    try {
      await api.delete(`/admin/vendors/${id}`, {
        headers: { Authorization: `Bearer ${getAdminSession()?.token}` }
      });
      router.push('/admin/vendeurs');
    } catch {
      alert('Erreur.');
    }
  };

  const cardStyle = {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    padding: '20px'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Vendeur introuvable.</p>
    </div>
  );

  const { vendor, products, stats } = data;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#111', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <a href="/admin" style={{ fontWeight: '700', fontSize: '15px', color: '#fff', textDecoration: 'none' }}>Keyros Admin</a>
        <a href="/admin/vendeurs" style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none' }}>Retour vendeurs</a>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
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
            <button
              onClick={handlePlan}
              style={{
                padding: '8px 16px', borderRadius: '6px', fontSize: '13px',
                fontWeight: '500', cursor: 'pointer', border: 'none',
                background: vendor.plan === 'premium' ? '#f5f5f5' : '#111',
                color: vendor.plan === 'premium' ? '#555' : '#fff'
              }}
            >
              {vendor.plan === 'premium' ? 'Passer en gratuit' : 'Passer en premium'}
            </button>
            <button
              onClick={handleToggle}
              style={{
                padding: '8px 16px', borderRadius: '6px', fontSize: '13px',
                fontWeight: '500', cursor: 'pointer', border: 'none',
                background: vendor.is_active ? '#fff0f0' : '#f0fff4',
                color: vendor.is_active ? '#c00' : '#060'
              }}
            >
              {vendor.is_active ? 'Desactiver' : 'Activer'}
            </button>
            <button
              onClick={handleDelete}
              style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: '1px solid #fcc', background: '#fff', color: '#c00' }}
            >
              Supprimer
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* Infos boutique */}
          <div style={cardStyle}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 16px' }}>
              Informations
            </p>
            {[
              { label: 'Slug',      value: vendor.shop_slug },
              { label: 'WhatsApp',  value: vendor.whatsapp || '-' },
              { label: 'Facebook',  value: vendor.facebook_url || '-' },
              { label: 'Plan',      value: vendor.plan },
              { label: 'Statut',    value: vendor.is_active ? 'Actif' : 'Inactif' },
              { label: 'Inscription', value: new Date(vendor.created_at).toLocaleDateString('fr-FR') },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: '13px', color: '#999' }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#111', fontWeight: '500' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={cardStyle}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 16px' }}>
              Statistiques (30 derniers jours)
            </p>
            {[
              { label: 'Vues de la page',   value: stats.pageViews },
              { label: 'Clics WhatsApp',    value: stats.whatsappClicks },
              { label: 'Produits en ligne', value: products.length },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: '13px', color: '#999' }}>{item.label}</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>{item.value}</span>
              </div>
            ))}

            
              href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${vendor.shop_slug}`}
              rel="noreferrer"
              target="_blank"
              style={{ display: 'block', marginTop: '16px', padding: '9px', background: '#f5f5f5', borderRadius: '6px', fontSize: '13px', color: '#111', textDecoration: 'none', textAlign: 'center', fontWeight: '500' }}
            <a>
              Voir la boutique
            </a>
          </div>
        </div>

        {/* Liste produits */}
        <div style={cardStyle}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 16px' }}>
            Catalogue ({products.length} produits)
          </p>

          {products.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#999' }}>Aucun produit.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '44px', height: '44px', background: '#f5f5f5', borderRadius: '4px', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#111', margin: '0 0 2px' }}>{p.name}</p>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{p.reference} — {p.price.toLocaleString()} Ar</p>
                  </div>
                  <span style={{
                    fontSize: '11px', padding: '3px 8px', borderRadius: '4px',
                    background: p.is_available ? '#f0fff4' : '#f5f5f5',
                    color: p.is_available ? '#060' : '#999'
                  }}>
                    {p.is_available ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}