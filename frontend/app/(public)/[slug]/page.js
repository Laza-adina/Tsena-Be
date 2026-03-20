'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../lib/api';
import { THEMES } from '../../../lib/themes';

export default function PublicShopPage() {
  const { slug }                = useParams();
  const [vendor, setVendor]     = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch]     = useState('');

  const fetchShop = async (searchTerm = '') => {
    try {
      const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const { data } = await api.get(`/public/${slug}${params}`);
      setVendor(data.vendor);
      setProducts(data.products);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchShop();
  }, [slug]);

  useEffect(() => {
    if (!slug || loading) return;
    const timer = setTimeout(() => {
      fetchShop(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
      <p style={{ color: '#999', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>Chargement...</p>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
      <p style={{ color: '#999', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>Boutique introuvable.</p>
    </div>
  );

  const themeKey = vendor.theme || 'dark_premium';
  const T = THEMES[themeKey]?.colors || THEMES['dark_premium'].colors;

  const trackWhatsapp = async (productId) => {
    try {
      await api.post(`/public/${slug}/track`, { productId });
    } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', background: T.background, fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.primary}22`, padding: '32px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>

          {vendor.profileImageUrl && (
            <img
              src={vendor.profileImageUrl}
              alt={vendor.shopName}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '12px',
                border: `2px solid ${T.primary}`
              }}
            />
          )}

          <h1 style={{ fontSize: '22px', fontWeight: '700', color: T.text, margin: '0 0 8px' }}>
            {vendor.shopName}
          </h1>

          {vendor.description && (
            <p style={{ fontSize: '14px', color: T.textMuted, margin: '0 0 16px', lineHeight: '1.6' }}>
              {vendor.description}
            </p>
          )}

          {/* Contact */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>

            {vendor.whatsapp && (
              <a
                href={`https://wa.me/${vendor.whatsapp}`}
                rel="noreferrer"
                target="_blank"
                style={{
                  padding: '8px 18px',
                  background: T.btn,
                  color: T.btnText,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                WhatsApp
              </a>
            )}

            {vendor.facebookUrl && (
              <a
                href={vendor.facebookUrl}
                rel="noreferrer"
                target="_blank"
                style={{
                  padding: '8px 18px',
                  background: 'transparent',
                  color: T.primary,
                  border: `1px solid ${T.primary}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Recherche */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              style={{
                width: '100%',
                padding: '10px 14px',
                border: `1px solid ${T.primary}44`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                background: T.surface,
                color: T.text,
                fontFamily: 'system-ui, sans-serif'
              }}
            />
          </div>

      {/* Produits */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: T.textMuted, fontSize: '14px', marginTop: '48px' }}>
            Aucun produit disponible pour le moment.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {products.map(product => (
              <div
                key={product.id}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.primary}22`,
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      background: `${T.primary}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: T.textMuted }}>Pas d'image</span>
                  </div>
                )}

                <div style={{ padding: '10px' }}>
                  <p style={{ fontSize: '11px', color: T.textMuted, margin: '0 0 3px' }}>
                    {product.reference}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: T.text, margin: '0 0 4px' }}>
                    {product.name}
                  </p>

                  {product.description && (
                    <p style={{ fontSize: '12px', color: T.textMuted, margin: '0 0 6px', lineHeight: '1.4' }}>
                      {product.description}
                    </p>
                  )}

                  <p style={{ fontSize: '15px', fontWeight: '700', color: T.accent, margin: '0 0 10px' }}>
                    {product.price.toLocaleString()} Ar
                  </p>

                  {vendor.whatsapp && product.whatsappLink && (
                    <a
                      href={product.whatsappLink}
                      rel="noreferrer"
                      target="_blank"
                      onClick={() => trackWhatsapp(product.id)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '9px 0',
                        background: T.btn,
                        color: T.btnText,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        textAlign: 'center',
                        textDecoration: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      Commander via WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!vendor.isPremium && (
        <p style={{ textAlign: 'center', fontSize: '11px', color: T.textMuted, padding: '24px', marginTop: '16px' }}>
          Powered by Tsen@be
        </p>
      )}
    </div>
  );
}