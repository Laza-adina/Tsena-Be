'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import { THEMES, DEFAULT_THEME } from '../../../lib/themes';
import api from '../../../lib/api';
import styles from './PublicShopPage.module.css';
import ProfileCard from '../../../components/ProfileCard';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [localTheme, setLocalTheme] = useState(null);

  useEffect(() => {
    // Récupérer le thème stocké localement dès le montage côté cleint
    const savedTheme = localStorage.getItem('shop_theme');
    if (savedTheme && THEMES[savedTheme]) {
      setLocalTheme(savedTheme);
    }
    
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

  const activeThemeId = localTheme || vendor?.theme || DEFAULT_THEME;
  const theme = THEMES[activeThemeId] ?? THEMES[DEFAULT_THEME];
  const c     = theme?.colors ?? THEMES[DEFAULT_THEME].colors;

  // Calcul du focus color pour la barre de recherche via l'opacité (fallback : texte)
  const isDarkSearch = c.surface && c.surface.includes('rgba(255') ? false : true;
  
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      <div className={styles.bgGradient} style={{ background: c.background }} />

      {/* ── Layout principal ── */}
      <div className={styles.layout}>

        {/* ════ HAUT — ProfileCard ════ */}
        <header className={styles.topProfile}>
          <ProfileCard
            name={vendor.shopName}
            description={vendor.description || ''}
            whatsapp={vendor.whatsapp || ''}
            facebook={vendor.facebook || ''}
            avatarUrl={vendor.profileImageUrl || ''}
            enableTilt={true}
            enableMobileTilt={false}
            themeColors={c}
            glowColor={`rgba(${hexToRgb(c.primary)}, 0.55)`}
          />
        </header>

        {/* ════ PRODUITS AVEC SEARCH ════ */}
        <div className={styles.productsArea}>
          
          {/* SEARCH BAR FIXED */}
          {products.length > 0 && (
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="Rechercher un produit..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                style={{
                  background: c.surface,
                  color: c.text,
                  border: `1px solid ${c.primary}40`, /* 40 pour ~25% opacité hex */
                  boxShadow: `0 4px 16px rgba(0,0,0,0.1)`,
                }}
                onFocus={(e) => {
                  e.target.style.border = `1px solid ${c.primary}`;
                  e.target.style.boxShadow = `0 6px 20px rgba(0,0,0,0.15)`;
                }}
                onBlur={(e) => {
                  e.target.style.border = `1px solid ${c.primary}40`;
                  e.target.style.boxShadow = `0 4px 16px rgba(0,0,0,0.1)`;
                }}
              />
            </div>
          )}

          {products.length > 0 && (
            <p className={styles.sectionTitle} style={{ color: c.text }}>
              Produits · {filteredProducts.length}
            </p>
          )}

          {products.length === 0 ? (
            <p className={styles.emptyText} style={{ color: c.textMuted }}>
              Aucun produit disponible pour le moment.
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className={styles.emptyText} style={{ color: c.textMuted }}>
              Aucun produit ne correspond à votre recherche.
            </p>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} theme={theme} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Footer ── */}
      {!vendor.isPremium && (
        <p className={styles.powered} style={{ color: `rgba(${hexToRgb(c.text)}, 0.35)` }}>
          Powered by Keyros
        </p>
      )}
    </div>
  );
}