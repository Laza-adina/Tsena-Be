'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { THEMES, DEFAULT_THEME } from '../../../lib/themes';
import api from '../../../lib/api';
import styles from './PublicShopPage.module.css';
import ProfileCard from '../../../components/ProfileCard';
import ProductCard from '../../../components/ProductCard';

const hexToRgb = (hex) => {
  const c = (hex || '#888888').replace('#', '');
  if (c.length < 6) return '128,128,128';
  return `${parseInt(c.slice(0,2),16)}, ${parseInt(c.slice(2,4),16)}, ${parseInt(c.slice(4,6),16)}`;
};

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

  useEffect(() => { if (slug) fetchShop(); }, [slug]);

  useEffect(() => {
    if (!slug || loading) return;
    const t = setTimeout(() => fetchShop(search), 300);
    return () => clearTimeout(t);
  }, [search, slug, loading]);

  const theme = THEMES[vendor?.theme] ?? THEMES[DEFAULT_THEME];
  const c     = theme?.colors ?? THEMES[DEFAULT_THEME].colors;

  const trackWhatsapp = async (productId) => {
    try { await api.post(`/public/${slug}/track`, { productId }); } catch {}
  };

  if (loading) {
    return (
      <div className={styles.centered} style={{ background: THEMES[DEFAULT_THEME].colors.background }}>
        <div className={styles.spinner} style={{ borderTopColor: THEMES[DEFAULT_THEME].colors.primary }} />
        <p className={styles.stateText} style={{ color: THEMES[DEFAULT_THEME].colors.textMuted }}>Chargement...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.centered} style={{ background: '#f5f5f3' }}>
        <p className={styles.stateText}>Boutique introuvable.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── Fond thématique fixe ── */}
      <div className={styles.bgGradient} style={{ background: c.background }} />

      {/* ── Layout sidebar + contenu ── */}
      <div className={styles.layout}>

        {/* ════ PROFILE CARD — gauche PC / hero fullscreen mobile ════ */}
        <aside className={styles.sidebar}>
          <ProfileCard
            name={vendor.shopName}
            description={vendor.description || ''}
            whatsapp={vendor.whatsapp || ''}
            facebook={vendor.facebookUrl || vendor.facebook || ''}
            avatarUrl={vendor.profileImageUrl || ''}
            enableTilt={true}
            enableMobileTilt={false}
            themeColors={c}
          />
        </aside>

        {/* ════ ZONE DROITE : recherche + grille produits ════ */}
        <div className={styles.productsArea}>

          {/* Barre de recherche */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className={styles.searchInput}
              style={{
                background: `rgba(${hexToRgb(c.primary)}, 0.4)`,
                border:     `1px solid rgba(${hexToRgb(c.primary)}, 0.20)`,
                color:       c.text,
              }}
            />
          </div>

          {/* Titre section */}
          {products.length > 0 && (
            <p className={styles.sectionTitle} style={{ color: c.text }}>
              Produits <span style={{ opacity: 0.4 }}>· {products.length}</span>
            </p>
          )}

          {/* Grille produits */}
          {products.length === 0 ? (
            <p className={styles.emptyText} style={{ color: c.textMuted }}>
              {search
                ? `Aucun résultat pour "${search}"`
                : 'Aucun produit disponible pour le moment.'}
            </p>
          ) : (
            <div className={styles.grid}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    whatsappLink: product.whatsappLink,
                  }}
                  theme={theme}
                  onTrack={() => trackWhatsapp(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      {!vendor.isPremium && (
        <p style={{ textAlign: 'center', fontSize: '11px', color: T.textMuted, padding: '24px', marginTop: '16px' }}>
          Powered by Keyros
        </p>
      )}
    </div>
  );
}