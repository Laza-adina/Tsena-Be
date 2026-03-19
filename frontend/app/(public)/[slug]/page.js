// app/(public)/[slug]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import api from '../../../lib/api';

export default function PublicShopPage() {
  const { slug }                = useParams();
  const [vendor, setVendor]     = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const { data } = await api.get(`/public/${slug}`);
        setVendor(data.vendor);
        setProducts(data.products);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Boutique introuvable.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        {vendor.profileImageUrl && (
          <img
            src={vendor.profileImageUrl}
            alt={vendor.shopName}
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
          />
        )}
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 8px' }}>
          {vendor.shopName}
        </h1>
        {vendor.description && (
          <p style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
            {vendor.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {vendor.whatsapp && (
            <a
              href={`https://wa.me/${vendor.whatsapp}`}
              rel="noreferrer"
              target="_blank"
              style={{
                padding: '8px 16px',
                border: '1px solid #111',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#111',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              WhatsApp
            </a>
          )}

          {vendor.facebook && (
            <a
              href={vendor.facebook}
              rel="noreferrer"
              target="_blank"
              style={{
                padding: '8px 16px',
                border: '1px solid #1877F2',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#1877F2',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Facebook
            </a>
          )}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', marginBottom: '24px' }} />

      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>
          Aucun produit disponible pour le moment.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!vendor.isPremium && (
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#ccc', marginTop: '40px' }}>
          Powered by Keyros
        </p>
      )}
    </div>
  );
}