"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

const PRODUCTS_PER_PAGE = 10;

/* ══════════════════════════════════════════════════════════
   CAROUSEL MISE EN AVANT
══════════════════════════════════════════════════════════ */
function FeaturedCarousel({ featured, formatPrice, onProductClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const carouselItems = (featured || []).slice(0, 8);
  const currentSlideIndex =
    currentSlide < carouselItems.length ? currentSlide : 0;
  const prevSlideIndex =
    prevSlide !== null && prevSlide < carouselItems.length ? prevSlide : null;

  useEffect(() => {
    if (!carouselItems || carouselItems.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const normalizedPrev = prev < carouselItems.length ? prev : 0;
        const next =
          normalizedPrev === carouselItems.length - 1 ? 0 : normalizedPrev + 1;
        setDirection(1);
        setPrevSlide(normalizedPrev);
        setAnimating(true);
        setTimeout(() => {
          setPrevSlide(null);
          setAnimating(false);
        }, 650);
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselItems, paused]);

  if (!carouselItems || carouselItems.length === 0) return null;

  const handlePrev = () => {
    const next =
      currentSlideIndex === 0
        ? carouselItems.length - 1
        : currentSlideIndex - 1;
    if (animating) return;
    setDirection(-1);
    setPrevSlide(currentSlideIndex);
    setCurrentSlide(next);
    setAnimating(true);
    setTimeout(() => {
      setPrevSlide(null);
      setAnimating(false);
    }, 650);
    setPaused(true);
  };

  const handleNext = () => {
    const next =
      currentSlideIndex === carouselItems.length - 1
        ? 0
        : currentSlideIndex + 1;
    if (animating) return;
    setDirection(1);
    setPrevSlide(currentSlideIndex);
    setCurrentSlide(next);
    setAnimating(true);
    setTimeout(() => {
      setPrevSlide(null);
      setAnimating(false);
    }, 650);
    setPaused(true);
  };

  const current = carouselItems[currentSlideIndex];
  return (
    <div className="sp-featured-carousel">
      <style>{`
        .sp-featured-carousel {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          background: transparent;
          position: relative;
          overflow: hidden;
        }

        .sp-carousel-slide {
          width: 100%;
          height: clamp(300px, 60vh, 500px);
          position: relative;
          cursor: pointer;
          border-radius: 20px;
          overflow: hidden;
        }

        .sp-carousel-img {
          transition: filter .3s ease, transform .3s ease;
        }
        .sp-carousel-slide:hover .sp-carousel-img {
          filter: brightness(0.95);
          transform: scale(1.02);
        }


        @keyframes swipeInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes swipeInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes swipeOutLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes swipeOutRight {
          from { transform: translateX(0); }
          to   { transform: translateX(100%); }
        }

        .sp-carousel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
          display: flex;
          align-items: flex-end;
          padding: 32px 24px;
        }

        .sp-carousel-content {
          flex: 1;
          min-width: 0;
        }

        .sp-carousel-name {
          font-family: var(--font-display);
          font-size: clamp(18px, 3vw, 28px);
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .sp-carousel-price {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 4px;
        }

        .sp-carousel-price-promo {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 8px;
        }

        .sp-carousel-price-original {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: line-through;
        }

        .sp-carousel-price-reduced {
          font-size: 18px;
          font-weight: 700;
          color: #FCD34D;
        }

        .sp-carousel-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.5;
          max-width: 500px;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sp-carousel-promo-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EF4444;
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sp-carousel-new-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0EA5E9;
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sp-carousel-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .sp-carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 8px;
          padding: 16px;
          z-index: 10;
        }

        .sp-carousel-nav-prev {
          left: 0;
        }
        .sp-carousel-nav-next {
          right: 0;
        }

        .sp-carousel-btn {
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--c-text);
          transition: all .2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .sp-carousel-btn:hover {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .sp-carousel-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .sp-carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          cursor: pointer;
          transition: all .2s;
        }

        .sp-carousel-dot.active {
          background: white;
          width: 24px;
          border-radius: 4px;
        }

        .sp-carousel-dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 640px) {
          .sp-featured-carousel {
            padding: 0 16px;
          }
          .sp-carousel-slide {
            height: clamp(250px, 50vh, 400px);
            border-radius: 16px;
          }
          .sp-carousel-overlay {
            padding: 20px 16px;
          }
          .sp-carousel-name {
            font-size: clamp(16px, 2.5vw, 22px);
          }
          .sp-carousel-price {
            font-size: 14px;
          }
          .sp-carousel-btn {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>

      <div
        className="sp-carousel-slide"
        onClick={() => onProductClick(current)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides: swipe */}
        {[
          prevSlideIndex !== null
            ? {
                item: carouselItems[prevSlideIndex],
                key: `prev-${prevSlideIndex}`,
                isLeaving: true,
              }
            : null,
          {
            item: carouselItems[currentSlideIndex],
            key: `cur-${currentSlideIndex}`,
            isLeaving: false,
          },
        ]
          .filter(Boolean)
          .map(({ item, key, isLeaving }) => {
            const inAnim = direction === 1 ? "swipeInRight" : "swipeInLeft";
            const outAnim = direction === 1 ? "swipeOutLeft" : "swipeOutRight";
            return (
              <div
                key={key}
                style={{
                  position: "absolute",
                  inset: 0,
                  animation: `${isLeaving ? outAnim : inAnim} 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
                  pointerEvents: "none",
                  willChange: "transform",
                }}
              >
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="sp-carousel-img"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    sizes="100vw"
                    unoptimized
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "var(--c-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--c-muted)"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M3 12l5-5 5 5 6-6 3 3v9" />
                    </svg>
                  </div>
                )}
                <div className="sp-carousel-overlay">
                  <div
                    className="sp-carousel-content"
                    style={{
                      opacity: isLeaving ? 0 : 1,
                      transform: isLeaving ? "translateY(0)" : "translateY(0)",
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <div className="sp-carousel-name">{item.name}</div>
                    {item.isPromoActive && item.promo_price ? (
                      <div className="sp-carousel-price-promo">
                        <span className="sp-carousel-price-original">
                          {formatPrice(item.price)}
                        </span>
                        <span className="sp-carousel-price-reduced">
                          {formatPrice(item.promo_price)}
                        </span>
                      </div>
                    ) : (
                      <div className="sp-carousel-price">
                        {formatPrice(item.price)}
                      </div>
                    )}
                    {item.description && (
                      <div className="sp-carousel-description">
                        {item.description}
                      </div>
                    )}
                    {(item.isNewActive || item.isPromoActive) && (
                      <div className="sp-carousel-badges">
                        {item.isNewActive && (
                          <div className="sp-carousel-new-badge">Nouveaute</div>
                        )}
                        {item.isPromoActive && (
                          <div className="sp-carousel-promo-badge">Promo</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Navigation */}
        <div
          className="sp-carousel-nav sp-carousel-nav-prev"
          style={{ zIndex: 10 }}
        >
          <button
            className="sp-carousel-btn"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div
          className="sp-carousel-nav sp-carousel-nav-next"
          style={{ zIndex: 10 }}
        >
          <button
            className="sp-carousel-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="sp-carousel-dots" style={{ zIndex: 10 }}>
          {carouselItems.map((_, i) => (
            <button
              key={i}
              className={`sp-carousel-dot ${i === currentSlideIndex ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(i);
                setPaused(true);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="sk-card">
      <div className="sk-img sk-pulse" />
      <div className="sk-body">
        <div
          className="sk-line sk-pulse"
          style={{ width: "60%", height: "10px", marginBottom: "8px" }}
        />
        <div
          className="sk-line sk-pulse"
          style={{ width: "40%", height: "10px", marginBottom: "14px" }}
        />
        <div
          className="sk-line sk-pulse"
          style={{ width: "100%", height: "32px", borderRadius: "8px" }}
        />
      </div>
    </div>
  );
}

export default function PublicShopPage() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState("");
  const [pageReady, setPageReady] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const loadMoreRef = useRef(null);

  const fetchShop = useCallback(
    async ({ searchTerm = "", pageNumber = 1, append = false } = {}) => {
      const params = new URLSearchParams();
      params.set("page", String(pageNumber));
      params.set("limit", String(PRODUCTS_PER_PAGE));
      if (searchTerm) params.set("search", searchTerm);

      const { data } = await api.get(`/public/${slug}?${params.toString()}`);

      if (!append) {
        setVendor(data.vendor);
        setFeatured(data.featured || []);
      }

      const nextProducts = data.products || [];
      setProducts((prev) =>
        append ? [...prev, ...nextProducts] : nextProducts,
      );

      const pagination = data.pagination || {};
      setCurrentPage(pagination.page || pageNumber);
      setHasNextPage(Boolean(pagination.hasNextPage));
      setTotalProducts(pagination.total ?? nextProducts.length);
      setNotFound(false);
    },
    [slug],
  );

  useEffect(() => {
    if (!slug) return;

    let active = true;

    const run = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        await fetchShop({ searchTerm: search, pageNumber: 1, append: false });
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) {
          setLoading(false);
          setLoadingMore(false);
          setTimeout(() => setPageReady(true), 60);
        }
      }
    };

    const t = setTimeout(run, search ? 300 : 0);

    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [slug, search, fetchShop]);

  const loadMoreProducts = useCallback(async () => {
    if (loading || loadingMore || !hasNextPage) return;

    setLoadingMore(true);
    try {
      await fetchShop({
        searchTerm: search,
        pageNumber: currentPage + 1,
        append: true,
      });
    } catch {
      // Keep current products visible if loading next page fails.
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasNextPage, fetchShop, search, currentPage]);

  useEffect(() => {
    if (!loadMoreRef.current || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreProducts();
        }
      },
      { root: null, rootMargin: "300px 0px", threshold: 0 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loading, loadMoreProducts]);

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

  const formatPrice = (priceInMga) => {
    if (!vendor?.displayCurrency || vendor.displayCurrency === "MGA")
      return `${priceInMga.toLocaleString()} Ar`;
    if (vendor.displayCurrency === "USD")
      return `$${priceInMga.toLocaleString()}`;
    if (vendor.displayCurrency === "EUR")
      return `€${priceInMga.toLocaleString()}`;
    return `${priceInMga.toLocaleString()} Ar`;
  };

  /* ── Loading skeleton ── */
  if (loading) {
    const defC = THEMES[DEFAULT_THEME].colors;
    return (
      <>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          @keyframes sp  { to { transform: rotate(360deg) } }
          @keyframes shimmer {
            0%   { background-position: -600px 0; }
            100% { background-position:  600px 0; }
          }
          @keyframes sk-fade-in {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          body { background: ${defC.background}; margin: 0; }

          .sk-page {
            min-height: 100vh;
            background: ${defC.background};
            font-family: system-ui, sans-serif;
            animation: sk-fade-in .8s ease forwards;
          }

          /* Carousel skeleton */
          .sk-carousel {
            width: 100%; aspect-ratio: 16/6; background: ${defC.surface};
            position: relative; overflow: hidden;
          }
          @media (max-width: 640px) { .sk-carousel { aspect-ratio: 1/1; } }

          /* Cover skeleton */
          .sk-cover {
            width: 100%; height: 220px;
            background: ${defC.surface};
            position: relative; overflow: hidden;
          }
          @media (min-width: 900px) { .sk-cover { height: 300px; } }

          /* Hero skeleton */
          .sk-hero {
            max-width: 1280px; margin: 0 auto; padding: 0 24px;
            display: flex; align-items: flex-end; gap: 20px;
            transform: translateY(-44px); margin-bottom: -24px;
          }
          @media (max-width: 640px) {
            .sk-hero { flex-direction: column; align-items: center; transform: translateY(-48px); }
          }

          .sk-avatar {
            width: 96px; height: 96px; border-radius: 50%;
            border: 3px solid ${defC.background};
            flex-shrink: 0;
          }
          @media (min-width: 640px) { .sk-avatar { width: 112px; height: 112px; } }

          .sk-meta { padding-bottom: 8px; flex: 1; }
          .sk-line { border-radius: 6px; }

          .sk-body-section {
            max-width: 1280px; margin: 40px auto 0; padding: 0 24px;
          }

          /* Search bar skeleton */
          .sk-search {
            height: 44px; border-radius: 12px; margin-bottom: 28px;
            max-width: 560px;
          }

          /* Grid */
          .sk-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          @media (min-width: 640px)  { .sk-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
          @media (min-width: 1100px) { .sk-grid { grid-template-columns: repeat(4, 1fr); } }

          .sk-card {
            border-radius: 16px; overflow: hidden;
            border: 1px solid rgba(128,128,128,.12);
          }
          .sk-img { width: 100%; aspect-ratio: 1/1; }
          .sk-body-inner { padding: 13px 14px 16px; }

          /* Shimmer pulse */
          .sk-pulse {
            background: linear-gradient(
              90deg,
              ${defC.surface} 0%,
              rgba(${hexToRgb(defC.primary)}, 0.08) 40%,
              ${defC.surface} 80%
            );
            background-size: 600px 100%;
            animation: shimmer 2.2s ease-in-out infinite;
          }

          /* Spinner centré */
          .sk-spinner-wrap {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 60px 0 80px; gap: 14px;
          }
          .sk-spinner {
            width: 32px; height: 32px; border-radius: 50%;
            border: 3px solid rgba(${hexToRgb(defC.primary)}, 0.18);
            border-top-color: ${defC.primary};
            animation: sp .75s linear infinite;
          }
          .sk-spinner-label {
            font-size: 13px; color: ${defC.textMuted};
            opacity: .7; letter-spacing: .03em;
          }
        `}</style>

        <div className="sk-page">
          {/* Carousel skeleton */}
          <div className="sk-carousel sk-pulse" />

          {/* Cover */}
          <div className="sk-cover sk-pulse" />

          {/* Hero */}
          <div className="sk-hero">
            <div className="sk-avatar sk-pulse" />
            <div className="sk-meta">
              <div
                className="sk-line sk-pulse"
                style={{ width: "200px", height: "28px", marginBottom: "10px" }}
              />
              <div
                className="sk-line sk-pulse"
                style={{ width: "280px", height: "14px", marginBottom: "6px" }}
              />
              <div
                className="sk-line sk-pulse"
                style={{ width: "160px", height: "14px" }}
              />
            </div>
          </div>

          {/* Body */}
          <div className="sk-body-section">
            <div className="sk-search sk-pulse" />
            <div className="sk-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>

            <div className="sk-spinner-wrap">
              <div className="sk-spinner" />
              <span className="sk-spinner-label">
                Chargement de la boutique...
              </span>
            </div>
          </div>
        </div>
      </>
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

        /* ── Skeleton dans le body normal (shimmer réutilisé) ── */
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .sk-pulse {
          background: linear-gradient(
            90deg,
            var(--c-surface) 0%,
            rgba(${hexToRgb(c.primary)}, 0.08) 40%,
            var(--c-surface) 80%
          );
          background-size: 600px 100%;
          animation: shimmer 2.2s ease-in-out infinite;
          border-radius: 6px;
        }
        .sk-card {
          border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(128,128,128,.12);
        }
        .sk-img { width: 100%; aspect-ratio: 1/1; }
        .sk-body { padding: 13px 14px 16px; }

        /* ── Fade-in page ── */
        @keyframes page-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sp-page {
          min-height: 100vh;
          background: var(--c-bg);
          font-family: var(--font-body);
          color: var(--c-text);
          opacity: 0;
          animation: page-in .9s ease forwards;
        }
        .sp-page.ready { opacity: 1; }

        /* ── Stagger children ── */
        @keyframes child-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sp-anim { animation: child-in .8s ease both; }
        .sp-anim-1 { animation-delay: .05s; }
        .sp-anim-2 { animation-delay: .15s; }
        .sp-anim-3 { animation-delay: .27s; }
        .sp-anim-4 { animation-delay: .39s; }

        /* ── Product cards stagger ── */
        .sp-grid > * { animation: child-in .7s ease both; }
        .sp-grid > *:nth-child(1)  { animation-delay: .30s; }
        .sp-grid > *:nth-child(2)  { animation-delay: .36s; }
        .sp-grid > *:nth-child(3)  { animation-delay: .42s; }
        .sp-grid > *:nth-child(4)  { animation-delay: .48s; }
        .sp-grid > *:nth-child(5)  { animation-delay: .54s; }
        .sp-grid > *:nth-child(6)  { animation-delay: .60s; }
        .sp-grid > *:nth-child(7)  { animation-delay: .66s; }
        .sp-grid > *:nth-child(8)  { animation-delay: .72s; }
        .sp-grid > *:nth-child(n+9){ animation-delay: .78s; }

        /* ── Carousel ── */
        .sp-featured-carousel {
          animation: child-in .8s ease both;
          animation-delay: 0s;
        }

        /* ── Cover ── */
        .sp-cover {
          position: relative; width: 100%; height: 280px; overflow: hidden;
        }
        @media (min-width: 900px) { .sp-cover { height: 340px; } }

        .sp-cover-img {
          transition: filter .6s ease, opacity .6s ease;
        }
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
          transition: transform .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s ease;
        }
        .sp-avatar-ring:hover { transform: scale(1.04); box-shadow: 0 8px 28px rgba(0,0,0,0.30); }
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
          transition: border-color .18s, transform .18s, box-shadow .18s;
          backdrop-filter: blur(10px);
        }
        .sp-contact-pill:hover {
          border-color: var(--c-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
        }
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
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        @media (min-width: 900px) { .sp-search-wrap { padding-top: 0; } }

        .sp-search-inner { position: relative; max-width: 560px; }
        .sp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--c-muted); opacity: 0.6; pointer-events: none; display: flex;
          transition: opacity .2s;
        }
        .sp-search-input:focus ~ .sp-search-icon,
        .sp-search-wrap:focus-within .sp-search-icon { opacity: 1; }

        .sp-search-input {
          width: 100%; padding: 12px 16px 12px 42px;
          background: var(--c-surface); border: 1.5px solid var(--c-border);
          border-radius: 12px; font-family: var(--font-body);
          font-size: 14px; color: var(--c-text); outline: none;
          backdrop-filter: blur(12px);
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .sp-search-input:focus {
          border-color: var(--c-primary);
          box-shadow: 0 0 0 3px rgba(${hexToRgb(c.primary)}, 0.12);
        }
        .sp-search-input::placeholder { color: var(--c-muted); opacity: 0.55; }

        /* ── Section title ── */
        .sp-section-title { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; margin-top: 40px; }
        .sp-section-label {
          font-family: var(--font-display); font-size: 13px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; color: var(--c-text);
        }
        .sp-section-count {
          font-size: 12px; font-weight: 500; color: var(--c-muted);
          background: var(--c-surface); border: 1px solid var(--c-border);
          border-radius: 999px; padding: 2px 10px;
          transition: background .2s;
        }

        /* ── Grid ── */
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
          animation: child-in .8s ease both;
        }

        .sp-footer {
          text-align: center; font-size: 11px; letter-spacing: .05em;
          color: var(--c-muted); opacity: 0.4; padding: 24px; margin-top: 16px;
        }

        .sp-load-more {
          text-align: center;
          font-size: 13px;
          color: var(--c-muted);
          padding: 18px 0 12px;
        }

        .sp-scroll-sentinel {
          width: 100%;
          height: 1px;
        }
      `}</style>

      <div className={`sp-page${pageReady ? " ready" : ""}`}>
        {/* Cover */}
        <div className="sp-anim sp-anim-2">
          {hasCover ? (
            <div className="sp-cover">
              <Image
                src={coverUrl}
                alt="Couverture"
                fill
                className="sp-cover-img"
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
        </div>

        {/* Profile anchor */}
        <div className="sp-hero sp-anim sp-anim-3">
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
        <div className="sp-divider sp-anim sp-anim-4">
          <div className="sp-divider-inner" />
        </div>

        {/* Featured Carousel - Full Width */}
        {featured.length > 0 && (
          <div className="sp-anim sp-anim-1">
            <FeaturedCarousel
              featured={featured}
              formatPrice={formatPrice}
              onProductClick={setSelectedProduct}
            />
          </div>
        )}

        {/* Produits */}
        <br></br>
        <main className="sp-main sp-anim sp-anim-4">
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
              <span className="sp-section-label">Tous les produits</span>
              <span className="sp-section-count">
                {totalProducts > 0 ? totalProducts : products.length}
              </span>
            </div>
          )}

          {products.length === 0 ? (
            <p className="sp-empty">
              {search
                ? `Aucun resultat pour "${search}"`
                : "Aucun produit disponible pour le moment."}
            </p>
          ) : (
            <>
              <div className="sp-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      whatsappLink: product.whatsappLink,
                      isPromoActive: product.isPromoActive,
                    }}
                    theme={theme}
                    onTrack={() => trackWhatsapp(product.id)}
                    onOpen={() => setSelectedProduct(product)}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>

              {loadingMore && (
                <div className="sp-load-more">Chargement des produits...</div>
              )}

              {!loadingMore && hasNextPage && (
                <div ref={loadMoreRef} className="sp-scroll-sentinel" />
              )}
            </>
          )}
        </main>

        <p className="sp-footer">Powered by Keyros</p>

        {/* Modal Produit */}
        {selectedProduct && (
          <ProductCard
            product={{
              ...selectedProduct,
              whatsappLink: selectedProduct.whatsappLink,
              isPromoActive: selectedProduct.isPromoActive,
            }}
            theme={theme}
            onTrack={() => trackWhatsapp(selectedProduct.id)}
            onClose={() => setSelectedProduct(null)}
            isModal={true}
            formatPrice={formatPrice}
          />
        )}
      </div>
    </>
  );
}
