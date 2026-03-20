'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import { THEMES, DEFAULT_THEME } from '../../../lib/themes';
import api from '../../../lib/api';
import styles from './PublicShopPage.module.css';

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export default function PublicShopPage() {
  const { slug }            = useParams();
  const [vendor, setVendor] = useState(null);
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

  const theme = THEMES[vendor?.theme] ?? THEMES[DEFAULT_THEME];
  const c     = theme?.colors ?? THEMES[DEFAULT_THEME].colors;

  if (loading) return (
    <div className={styles.centered}>
      <div className={styles.spinner} />
      <p className={styles.stateText}>Chargement...</p>
    </div>
  );

  if (notFound) return (
    <div className={styles.centered}>
      <p className={styles.stateText}>Boutique introuvable.</p>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* ── Fond thématique ── */}
      <div
        className={styles.bgGradient}
        style={{ background: c.background }}
      />

      {/* ── Header vendeur ── */}
      <div className={styles.header}>

        {vendor.profileImageUrl && (
          <div
            className={styles.avatarWrap}
            style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.primary})` }}
          >
            <img
              src={vendor.profileImageUrl}
              alt={vendor.shopName}
              className={styles.avatar}
              style={{ border: `3px solid ${c.background}` }}
            />
          </div>
        )}

        <h1
          className={styles.shopName}
          style={{ color: c.text }}
        >
          {vendor.shopName}
        </h1>

        {vendor.description && (
          <p
            className={styles.shopDesc}
            style={{ color: c.textMuted }}
          >
            {vendor.description}
          </p>
        )}

        <div className={styles.socialRow}>
          {vendor.whatsapp && (
            <a
              href={`https://wa.me/${vendor.whatsapp}`}
              rel="noreferrer"
              target="_blank"
              className={`${styles.socialBtn} ${styles.socialBtnWa}`}
              style={{ color: c.text }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.115 1.535 5.843L.057 24l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 0 1-5.001-1.366l-.359-.213-3.722.976.995-3.633-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              WhatsApp
            </a>
          )}
          {vendor.facebook && (
            <a
              href={vendor.facebook}
              rel="noreferrer"
              target="_blank"
              className={`${styles.socialBtn} ${styles.socialBtnFb}`}
              style={{
                background: `rgba(${hexToRgb(c.primary)}, 0.15)`,
                borderColor: `rgba(${hexToRgb(c.primary)}, 0.35)`,
                color: c.primary,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              Facebook
            </a>
          )}
        </div>
      </div>

      {/* ── Séparateur ── */}
      <div
        className={styles.divider}
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${hexToRgb(c.primary)}, 0.25), transparent)`,
        }}
      />

      {/* ── Grille produits ── */}
      {products.length === 0 ? (
        <p className={styles.emptyText} style={{ color: c.textMuted }}>
          Aucun produit disponible pour le moment.
        </p>
      ) : (
        <div className={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} theme={theme} />
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      {!vendor.isPremium && (
        <p
          className={styles.powered}
          style={{ color: `rgba(${hexToRgb(c.text)}, 0.35)` }}
        >
          Powered by Keyros
        </p>
      )}
    </div>
  );
}