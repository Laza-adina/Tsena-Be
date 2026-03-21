"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { THEMES, DEFAULT_THEME } from "../../../lib/themes";
import api from "../../../lib/api";
import ProductCard from "../../../components/ProductCard";

const hexToRgb = (hex) => {
  const c = (hex || "#888888").replace("#", "");
  if (c.length < 6) return "128,128,128";
  return `${parseInt(c.slice(0, 2), 16)}, ${parseInt(c.slice(2, 4), 16)}, ${parseInt(c.slice(4, 6), 16)}`;
};

export default function PublicShopPage() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState("");

  const fetchShop = useCallback(
    async (searchTerm = "") => {
      try {
        const params = searchTerm
          ? `?search=${encodeURIComponent(searchTerm)}`
          : "";
        const { data } = await api.get(`/public/${slug}${params}`);
        setVendor(data.vendor);
        setProducts(data.products);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    if (slug) fetchShop();
  }, [slug, fetchShop]);

  useEffect(() => {
    if (!slug || loading) return;
    const t = setTimeout(() => fetchShop(search), 300);
    return () => clearTimeout(t);
  }, [search, slug, loading, fetchShop]);

  const theme = THEMES[vendor?.theme] ?? THEMES[DEFAULT_THEME];
  const c = theme?.colors ?? THEMES[DEFAULT_THEME].colors;
  const fonts = theme?.fonts ?? {};

  const trackWhatsapp = useCallback(
    async (productId) => {
      try {
        await api.post(`/public/${slug}/track`, { productId });
      } catch {}
    },
    [slug],
  );

  if (loading) {
    const defC = THEMES[DEFAULT_THEME].colors;
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: defC.background,
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: `3px solid rgba(${hexToRgb(defC.primary)}, 0.2)`,
            borderTopColor: defC.primary,
            animation: "sp .75s linear infinite",
          }}
        />
        <style>{`@keyframes sp { to { transform: rotate(360deg) } }`}</style>
        <p
          style={{
            fontSize: "13px",
            color: defC.textMuted,
            fontFamily: "system-ui",
          }}
        >
          Chargement...
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F5F3",
        }}
      >
        <p style={{ fontSize: "14px", color: "#999", fontFamily: "system-ui" }}>
          Boutique introuvable.
        </p>
      </div>
    );
  }

  const coverUrl = vendor?.coverImageUrl || vendor?.cover_image_url || null;
  const hasCover = Boolean(coverUrl);

  return (
    <>
      {fonts.import && <link rel="stylesheet" href={fonts.import} />}

      <style>{`
        :root {
          --font-display: ${fonts.display ? `'${fonts.display}'` : "system-ui"}, system-ui, sans-serif;
          --font-body:    ${fonts.body ? `'${fonts.body}'` : "system-ui"}, system-ui, sans-serif;
          --c-bg:      ${c.background};
          --c-primary: ${c.primary};
          --c-accent:  ${c.accent};
          --c-text:    ${c.text};
          --c-muted:   ${c.textMuted};
          --c-surface: ${c.surface};
          --c-card:    ${c.card};
          --c-border:  ${c.border};
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--c-bg); }

        .sp-page {
          min-height: 100vh;
          background: var(--c-bg);
          font-family: var(--font-body);
          color: var(--c-text);
        }

        /* ── Cover ── */
        .sp-cover {
          position: relative; width: 100%; height: 280px; overflow: hidden;
        }
        @media (min-width: 900px) { .sp-cover { height: 340px; } }

        .sp-cover-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.55) 100%);
        }

        .sp-no-cover {
          width: 100%; height: 180px;
          background: var(--c-surface);
          border-bottom: 1px solid var(--c-border);
          position: relative; overflow: hidden;
        }
        .sp-no-cover-pattern {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: repeating-linear-gradient(45deg, var(--c-primary) 0, var(--c-primary) 1px, transparent 0, transparent 50%);
          background-size: 24px 24px;
        }

        /* ── Hero ── */
        .sp-hero { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }

        .sp-profile-anchor {
          display: flex; align-items: flex-end; gap: 20px;
          transform: translateY(-40px); margin-bottom: -20px;
        }
        @media (max-width: 640px) {
          .sp-profile-anchor {
            flex-direction: column; align-items: center;
            transform: translateY(-48px); margin-bottom: -28px; gap: 12px;
          }
        }

        .sp-avatar-ring {
          width: 96px; height: 96px; border-radius: 50%;
          border: 3px solid var(--c-bg);
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          overflow: hidden; flex-shrink: 0;
          background: var(--c-surface);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        @media (min-width: 640px) { .sp-avatar-ring { width: 112px; height: 112px; border-width: 4px; } }

        .sp-shop-meta { padding-bottom: 8px; flex: 1; min-width: 0; }
        @media (max-width: 640px) { .sp-shop-meta { text-align: center; } }

        .sp-shop-name {
          font-family: var(--font-display);
          font-size: clamp(22px, 4vw, 34px);
          font-weight: 800; line-height: 1.1;
          letter-spacing: -0.03em; color: var(--c-text);
          margin-bottom: 4px;
        }
        .sp-shop-desc {
          font-size: 14px; color: var(--c-muted); line-height: 1.5;
          max-width: 480px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .sp-contacts { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
        @media (max-width: 640px) { .sp-contacts { justify-content: center; } }

        .sp-contact-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 999px;
          background: var(--c-surface); border: 1px solid var(--c-border);
          font-family: var(--font-body); font-size: 13px; font-weight: 500;
          color: var(--c-text); cursor: pointer; text-decoration: none;
          transition: border-color .15s, transform .12s;
          backdrop-filter: blur(10px);
        }
        .sp-contact-pill:hover { border-color: var(--c-primary); transform: translateY(-1px); }
        .sp-wa-pill { color: #25D366; }
        .sp-fb-pill { color: #1877F2; }

        /* ── Divider ── */
        .sp-divider { max-width: 1280px; margin: 0 auto 32px; padding: 0 24px; }
        .sp-divider-inner { height: 1px; background: var(--c-border); }

        /* ── Main ── */
        .sp-main { max-width: 1280px; margin: 0 auto; padding: 0 24px 80px; }

        /* ── Search ── */
        .sp-search-wrap {
          position: sticky; top: 0; z-index: 20;
          padding: 16px 0 24px; background: var(--c-bg);
        }
        @media (min-width: 900px) { .sp-search-wrap { padding-top: 0; } }

        .sp-search-inner { position: relative; max-width: 560px; }
        .sp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--c-muted); opacity: 0.6; pointer-events: none; display: flex;
        }
        .sp-search-input {
          width: 100%; padding: 12px 16px 12px 42px;
          background: var(--c-surface); border: 1.5px solid var(--c-border);
          border-radius: 12px; font-family: var(--font-body);
          font-size: 14px; color: var(--c-text); outline: none;
          backdrop-filter: blur(12px); transition: border-color .15s, box-shadow .15s;
        }
        .sp-search-input:focus {
          border-color: var(--c-primary);
          box-shadow: 0 0 0 3px rgba(${hexToRgb(c.primary)}, 0.12);
        }
        .sp-search-input::placeholder { color: var(--c-muted); opacity: 0.55; }

        /* ── Section title ── */
        .sp-section-title { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
        .sp-section-label {
          font-family: var(--font-display); font-size: 13px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; color: var(--c-text);
        }
        .sp-section-count {
          font-size: 12px; font-weight: 500; color: var(--c-muted);
          background: var(--c-surface); border: 1px solid var(--c-border);
          border-radius: 999px; padding: 2px 10px;
        }

        /* ── Grid — TOUJOURS 2 colonnes minimum ── */
        .sp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px)  { .sp-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
        @media (min-width: 900px)  { .sp-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
        @media (min-width: 1100px) { .sp-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1280px) { .sp-grid { grid-template-columns: repeat(5, 1fr); } }

        .sp-empty {
          text-align: center; padding: 80px 0;
          font-size: 14px; color: var(--c-muted); opacity: 0.7;
        }

        .sp-footer {
          text-align: center; font-size: 11px; letter-spacing: .05em;
          color: var(--c-muted); opacity: 0.4; padding: 24px; margin-top: 16px;
        }
      `}</style>

      <div className="sp-page">
        {/* Cover */}
        {hasCover ? (
          <div className="sp-cover">
            <Image
              src={coverUrl}
              alt="Couverture"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="100vw"
              priority
              unoptimized
            />
            <div className="sp-cover-overlay" />
          </div>
        ) : (
          <div className="sp-no-cover">
            <div className="sp-no-cover-pattern" />
          </div>
        )}

        {/* Profile anchor */}
        <div className="sp-hero">
          <div className="sp-profile-anchor">
            <div className="sp-avatar-ring">
              {vendor.profileImageUrl ? (
                <Image
                  src={vendor.profileImageUrl}
                  alt={vendor.shopName || "Avatar"}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="112px"
                  unoptimized
                />
              ) : (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={c.textMuted}
                  strokeWidth="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>

            <div className="sp-shop-meta">
              <h1 className="sp-shop-name">{vendor.shopName || "Boutique"}</h1>
              {vendor.description && (
                <p className="sp-shop-desc">{vendor.description}</p>
              )}
              <div className="sp-contacts">
                {vendor.whatsapp && (
                  <button
                    className="sp-contact-pill sp-wa-pill"
                    onClick={() =>
                      window.open(`https://wa.me/${vendor.whatsapp}`, "_blank")
                    }
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.115 1.535 5.843L.057 24l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 0 1-5.001-1.366l-.359-.213-3.722.976.995-3.633-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                    </svg>
                    +{vendor.whatsapp}
                  </button>
                )}
                {(vendor.facebookUrl || vendor.facebook) && (
                  <button
                    className="sp-contact-pill sp-fb-pill"
                    onClick={() =>
                      window.open(
                        vendor.facebookUrl || vendor.facebook,
                        "_blank",
                      )
                    }
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                    </svg>
                    Page Facebook
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="sp-divider">
          <div className="sp-divider-inner" />
        </div>

        {/* Produits */}
        <main className="sp-main">
          <div className="sp-search-wrap">
            <div className="sp-search-inner">
              <span className="sp-search-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="sp-search-input"
              />
            </div>
          </div>

          {products.length > 0 && (
            <div className="sp-section-title">
              <span className="sp-section-label">Produits</span>
              <span className="sp-section-count">{products.length}</span>
            </div>
          )}

          {products.length === 0 ? (
            <p className="sp-empty">
              {search
                ? `Aucun resultat pour "${search}"`
                : "Aucun produit disponible pour le moment."}
            </p>
          ) : (
            <div className="sp-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, whatsappLink: product.whatsappLink }}
                  theme={theme}
                  onTrack={() => trackWhatsapp(product.id)}
                />
              ))}
            </div>
          )}
        </main>

        <p className="sp-footer">Powered by Tsen@be</p>
      </div>
    </>
  );
}
