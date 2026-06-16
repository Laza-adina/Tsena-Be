"use client";

import { useEffect, useState, useCallback, useRef, memo } from "react";
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

const normalizeSearchTerm = (value) =>
  (value || "").toString().trim().toLowerCase();

const productMatchesSearch = (product, normalizedTerm) => {
  if (!normalizedTerm) return true;
  const haystacks = [product?.name, product?.reference, product?.description];
  return haystacks.some((value) =>
    (value || "").toString().toLowerCase().includes(normalizedTerm),
  );
};

const mergeUniqueProductsById = (existing, incoming) => {
  if (!incoming || incoming.length === 0) return existing || [];
  const byId = new Map();
  [...(existing || []), ...(incoming || [])].forEach((product) => {
    if (product?.id === undefined || product?.id === null) return;
    byId.set(product.id, product);
  });
  return Array.from(byId.values());
};

/* ══════════════════════════════════════════════════════════
   CAROUSEL MISE EN AVANT (PREMIUM)
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
        }, 750);
        return next;
      });
    }, 4000);
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
    }, 750);
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
    }, 750);
    setPaused(true);
  };

  const current = carouselItems[currentSlideIndex];

  return (
    <div className="sp-featured-carousel">
      <style>{`
        .sp-featured-carousel {
          width: 100%; max-width: 1280px; margin: 0 auto;
          padding: 0 24px; position: relative; overflow: hidden;
        }

        .sp-carousel-slide {
          width: 100%; height: clamp(320px, 55vh, 480px);
          position: relative; cursor: pointer;
          border-radius: 28px; overflow: hidden;
          box-shadow: 0 24px 48px rgba(0,0,0,0.08);
          transform: translateZ(0); /* Hardware acceleration */
        }

        .sp-carousel-img {
          transition: filter 0.5s ease, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .sp-carousel-slide:hover .sp-carousel-img {
          filter: brightness(0.9); transform: scale(1.04);
        }

        @keyframes swipeInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes swipeInLeft  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes swipeOutLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        @keyframes swipeOutRight{ from { transform: translateX(0); } to { transform: translateX(100%); } }

        .sp-carousel-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
          display: flex; align-items: flex-end; padding: 40px 32px;
        }

        .sp-carousel-content { flex: 1; min-width: 0; }

        .sp-carousel-name {
          font-family: var(--font-display);
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 800; color: white;
          margin-bottom: 12px; line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .sp-carousel-price {
          font-size: 18px; font-weight: 600;
          color: rgba(255, 255, 255, 0.95); margin-bottom: 8px;
        }

        .sp-carousel-price-promo {
          display: flex; gap: 12px; align-items: center; margin-bottom: 12px;
        }
        .sp-carousel-price-original {
          font-size: 15px; color: rgba(255, 255, 255, 0.6); text-decoration: line-through;
        }
        .sp-carousel-price-reduced {
          font-size: 20px; font-weight: 700; color: #FCD34D;
        }

        .sp-carousel-description {
          font-size: 15px; color: rgba(255, 255, 255, 0.8);
          line-height: 1.6; max-width: 540px; margin-bottom: 16px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .sp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 99px;
          font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
          backdrop-filter: blur(8px);
        }
        .sp-carousel-promo-badge { background: rgba(239, 68, 68, 0.9); color: white; }
        .sp-carousel-new-badge { background: rgba(14, 165, 233, 0.9); color: white; }
        .sp-carousel-badges { display: flex; align-items: center; gap: 8px; margin-top: 12px; flex-wrap: wrap; }

        .sp-carousel-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          display: flex; gap: 8px; padding: 24px; z-index: 10;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .sp-carousel-slide:hover .sp-carousel-nav { opacity: 1; }

        .sp-carousel-nav-prev { left: 0; }
        .sp-carousel-nav-next { right: 0; }

        .sp-carousel-btn {
          background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          width: 48px; height: 48px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: white; transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .sp-carousel-btn:hover { background: white; color: black; transform: scale(1.1); }

        .sp-carousel-dots {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 10;
        }
        .sp-carousel-dot {
          width: 8px; height: 8px; border-radius: 4px;
          background: rgba(255, 255, 255, 0.3); border: none;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .sp-carousel-dot.active { background: white; width: 32px; }
        .sp-carousel-dot:hover:not(.active) { background: rgba(255, 255, 255, 0.6); }

        @media (max-width: 640px) {
          .sp-featured-carousel { padding: 0 16px; }
          .sp-carousel-slide { height: clamp(280px, 50vh, 400px); border-radius: 24px; }
          .sp-carousel-overlay { padding: 32px 24px; }
          .sp-carousel-name { font-size: clamp(20px, 3.5vw, 26px); }
          .sp-carousel-description { font-size: 14px; }
          .sp-carousel-nav { opacity: 1; padding: 12px; } /* Always show on mobile */
          .sp-carousel-btn { width: 40px; height: 40px; background: rgba(255,255,255,0.25); }
        }
      `}</style>

      <div
        className="sp-carousel-slide"
        onClick={() => onProductClick(current)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
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
                  pointerEvents: "none",
                  willChange: "transform",
                  animation: `${isLeaving ? outAnim : inAnim} 0.75s cubic-bezier(0.25, 1, 0.5, 1) both`,
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
                      transform: isLeaving ? "scale(0.98)" : "scale(1)",
                      transition: "opacity 0.3s ease, transform 0.5s ease",
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
                          <div className="sp-badge sp-carousel-new-badge">
                            Nouveauté
                          </div>
                        )}
                        {item.isPromoActive && (
                          <div className="sp-badge sp-carousel-promo-badge">
                            Promo
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        <div className="sp-carousel-nav sp-carousel-nav-prev">
          <button
            className="sp-carousel-btn"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        <div className="sp-carousel-nav sp-carousel-nav-next">
          <button
            className="sp-carousel-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className="sp-carousel-dots">
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
          style={{ width: "40%", height: "12px", marginBottom: "12px" }}
        />
        <div
          className="sk-line sk-pulse"
          style={{ width: "80%", height: "18px", marginBottom: "16px" }}
        />
        <div
          className="sk-line sk-pulse"
          style={{ width: "100%", height: "40px", borderRadius: "12px" }}
        />
      </div>
    </div>
  );
}

const ProductsSection = memo(function ProductsSection({
  slug,
  initialProducts,
  initialPage,
  initialHasNextPage,
  initialTotalProducts,
  theme,
  formatPrice,
  onTrackWhatsapp,
  onOpenProduct,
}) {
  const [products, setProducts] = useState(initialProducts || []);
  const [browseProducts, setBrowseProducts] = useState(initialProducts || []);
  const [searchPool, setSearchPool] = useState(initialProducts || []);
  const [productsLoading, setProductsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchSource, setSearchSource] = useState("browse");
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [hasNextPage, setHasNextPage] = useState(Boolean(initialHasNextPage));
  const [totalProducts, setTotalProducts] = useState(
    initialTotalProducts ?? (initialProducts || []).length,
  );
  const [browsePage, setBrowsePage] = useState(initialPage || 1);
  const [browseHasNextPage, setBrowseHasNextPage] = useState(
    Boolean(initialHasNextPage),
  );
  const [browseTotalProducts, setBrowseTotalProducts] = useState(
    initialTotalProducts ?? (initialProducts || []).length,
  );

  const loadMoreRef = useRef(null);
  const searchRequestIdRef = useRef(0);
  const browseSnapshotRef = useRef({
    products: initialProducts || [],
    page: initialPage || 1,
    hasNextPage: Boolean(initialHasNextPage),
    totalProducts: initialTotalProducts ?? (initialProducts || []).length,
  });
  const searchPoolRef = useRef(initialProducts || []);

  useEffect(() => {
    const safeInitialProducts = initialProducts || [];
    const page = initialPage || 1;
    const hasMore = Boolean(initialHasNextPage);
    const total = initialTotalProducts ?? safeInitialProducts.length;

    searchRequestIdRef.current += 1;
    setSearch("");
    setSearchSource("browse");
    setProductsLoading(false);
    setLoadingMore(false);
    setProducts(safeInitialProducts);
    setBrowseProducts(safeInitialProducts);
    setSearchPool(safeInitialProducts);
    setCurrentPage(page);
    setHasNextPage(hasMore);
    setTotalProducts(total);
    setBrowsePage(page);
    setBrowseHasNextPage(hasMore);
    setBrowseTotalProducts(total);
  }, [
    slug,
    initialProducts,
    initialPage,
    initialHasNextPage,
    initialTotalProducts,
  ]);

  useEffect(() => {
    browseSnapshotRef.current = {
      products: browseProducts,
      page: browsePage,
      hasNextPage: browseHasNextPage,
      totalProducts: browseTotalProducts,
    };
  }, [browseProducts, browsePage, browseHasNextPage, browseTotalProducts]);

  useEffect(() => {
    searchPoolRef.current = searchPool;
  }, [searchPool]);

  const requestProductsPage = useCallback(
    async ({ searchTerm = "", pageNumber = 1 } = {}) => {
      const params = new URLSearchParams();
      params.set("page", String(pageNumber));
      params.set("limit", String(PRODUCTS_PER_PAGE));
      if (searchTerm) params.set("search", searchTerm);
      const { data } = await api.get(`/public/${slug}?${params.toString()}`);
      return {
        products: data.products || [],
        pagination: data.pagination || {},
      };
    },
    [slug],
  );

  useEffect(() => {
    if (!slug) return;
    const requestId = ++searchRequestIdRef.current;
    const timer = setTimeout(async () => {
      const normalizedTerm = normalizeSearchTerm(search);
      const browseSnapshot = browseSnapshotRef.current;

      if (!normalizedTerm) {
        if (requestId !== searchRequestIdRef.current) return;
        setSearchSource("browse");
        setProductsLoading(false);
        setProducts(browseSnapshot.products);
        setCurrentPage(browseSnapshot.page);
        setHasNextPage(browseSnapshot.hasNextPage);
        setTotalProducts(
          browseSnapshot.totalProducts || browseSnapshot.products.length,
        );
        return;
      }
      setProductsLoading(true);
      const localMatches = searchPoolRef.current.filter((product) =>
        productMatchesSearch(product, normalizedTerm),
      );

      if (localMatches.length > 0) {
        if (requestId !== searchRequestIdRef.current) return;
        setSearchSource("local");
        setProducts(localMatches);
        setCurrentPage(1);
        setHasNextPage(false);
        setTotalProducts(localMatches.length);
        setProductsLoading(false);
        return;
      }

      try {
        const { products: remoteProducts, pagination } =
          await requestProductsPage({ searchTerm: search, pageNumber: 1 });
        if (requestId !== searchRequestIdRef.current) return;
        setSearchSource("backend");
        setProducts(remoteProducts);
        setCurrentPage(pagination.page || 1);
        setHasNextPage(Boolean(pagination.hasNextPage));
        setTotalProducts(pagination.total ?? remoteProducts.length);
        if (remoteProducts.length > 0)
          setSearchPool((prev) =>
            mergeUniqueProductsById(prev, remoteProducts),
          );
      } catch {
        if (requestId !== searchRequestIdRef.current) return;
        setSearchSource("backend");
        setProducts([]);
        setCurrentPage(1);
        setHasNextPage(false);
        setTotalProducts(0);
      } finally {
        if (requestId === searchRequestIdRef.current) setProductsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [slug, search, requestProductsPage]);

  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasNextPage) return;
    const trimmedSearch = search.trim();
    const backendSearchMode =
      Boolean(trimmedSearch) && searchSource === "backend";
    if (trimmedSearch && !backendSearchMode) return;
    setLoadingMore(true);
    try {
      const { products: nextProducts, pagination } = await requestProductsPage({
        searchTerm: backendSearchMode ? trimmedSearch : "",
        pageNumber: currentPage + 1,
      });
      const nextPage = pagination.page || currentPage + 1;
      const nextHasMore = Boolean(pagination.hasNextPage);
      const nextTotal = pagination.total ?? totalProducts + nextProducts.length;

      setProducts((prev) => [...prev, ...nextProducts]);
      setCurrentPage(nextPage);
      setHasNextPage(nextHasMore);
      setTotalProducts(nextTotal);
      setSearchPool((prev) => mergeUniqueProductsById(prev, nextProducts));
      if (!backendSearchMode) {
        setBrowseProducts((prev) => [...prev, ...nextProducts]);
        setBrowsePage(nextPage);
        setBrowseHasNextPage(nextHasMore);
        setBrowseTotalProducts(nextTotal);
      }
    } catch {
    } finally {
      setLoadingMore(false);
    }
  }, [
    loadingMore,
    hasNextPage,
    search,
    searchSource,
    requestProductsPage,
    currentPage,
    totalProducts,
  ]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreProducts();
      },
      { root: null, rootMargin: "300px 0px", threshold: 0 },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, loadingMore, loadMoreProducts]);

  return (
    <main className="sp-main sp-anim sp-anim-4">
      <div className="sp-search-wrap">
        <div className="sp-search-island">
          <span className="sp-search-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit, une référence..."
            className="sp-search-input"
          />
          {search && (
            <button
              className="sp-search-clear"
              onClick={() => setSearch("")}
              aria-label="Effacer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="sp-section-title">
        <span className="sp-section-label">
          {search ? "Résultats de recherche" : "Tous les produits"}
        </span>
        <span className="sp-section-count">
          {totalProducts > 0 ? totalProducts : products.length}
        </span>
      </div>

      {productsLoading && (
        <div className="sp-load-more">
          <div className="sk-spinner small" />
        </div>
      )}

      {!productsLoading && products.length === 0 ? (
        <div className="sp-empty">
          <div className="sp-empty-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p>
            {search
              ? `Aucun résultat pour "${search}"`
              : "Aucun produit disponible pour le moment."}
          </p>
        </div>
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
                onTrack={() => onTrackWhatsapp(product.id)}
                onOpen={() => onOpenProduct(product)}
                formatPrice={formatPrice}
              />
            ))}
          </div>
          {loadingMore && (
            <div className="sp-load-more">
              <div className="sk-spinner small" />
            </div>
          )}
          {!loadingMore && hasNextPage && (
            <div ref={loadMoreRef} className="sp-scroll-sentinel" />
          )}
        </>
      )}
    </main>
  );
});

export default function PublicShopPage() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]);
  const [initialPage, setInitialPage] = useState(1);
  const [initialHasNextPage, setInitialHasNextPage] = useState(false);
  const [initialTotalProducts, setInitialTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const requestShopPage = useCallback(
    async ({ searchTerm = "", pageNumber = 1 } = {}) => {
      const params = new URLSearchParams();
      params.set("page", String(pageNumber));
      params.set("limit", String(PRODUCTS_PER_PAGE));
      if (searchTerm) params.set("search", searchTerm);
      const { data } = await api.get(`/public/${slug}?${params.toString()}`);
      return {
        vendor: data.vendor,
        featured: data.featured || [],
        products: data.products || [],
        pagination: data.pagination || {},
      };
    },
    [slug],
  );

  useEffect(() => {
    if (!slug) return;
    let active = true;
    const run = async () => {
      setPageReady(false);
      setLoading(true);
      setNotFound(false);
      try {
        const {
          vendor,
          featured,
          products: firstProducts,
          pagination,
        } = await requestShopPage({ pageNumber: 1 });
        if (!active) return;
        setVendor(vendor);
        setFeatured(featured);
        setInitialProducts(firstProducts);
        setInitialPage(pagination.page || 1);
        setInitialHasNextPage(Boolean(pagination.hasNextPage));
        setInitialTotalProducts(pagination.total ?? firstProducts.length);
        setNotFound(false);
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) {
          setLoading(false);
          setTimeout(() => setPageReady(true), 60);
        }
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [slug, requestShopPage]);

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

  const formatPrice = useCallback(
    (priceInMga) => {
      if (!vendor?.displayCurrency || vendor.displayCurrency === "MGA")
        return `${priceInMga.toLocaleString()} Ar`;
      if (vendor.displayCurrency === "USD")
        return `$${priceInMga.toLocaleString()}`;
      if (vendor.displayCurrency === "EUR")
        return `€${priceInMga.toLocaleString()}`;
      return `${priceInMga.toLocaleString()} Ar`;
    },
    [vendor?.displayCurrency],
  );

  if (loading) {
    const defC = THEMES[DEFAULT_THEME].colors;
    return (
      <>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes sp { to { transform: rotate(360deg) } }
          @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
          @keyframes sk-fade-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

          body { background: ${defC.background}; margin: 0; }

          .sk-page { min-height: 100vh; background: ${defC.background}; font-family: system-ui, sans-serif; animation: sk-fade-in .8s ease forwards; }
          .sk-cover { width: 100%; height: 320px; background: ${defC.surface}; border-radius: 0 0 32px 32px; position: relative; overflow: hidden; }
          .sk-hero { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: flex; align-items: flex-end; gap: 24px; transform: translateY(-56px); margin-bottom: -32px; }
          @media (max-width: 640px) { .sk-hero { flex-direction: column; align-items: center; transform: translateY(-64px); gap: 16px; } }

          .sk-avatar { width: 112px; height: 112px; border-radius: 50%; border: 6px solid ${defC.background}; flex-shrink: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.06); }
          .sk-meta { padding-bottom: 8px; flex: 1; }
          @media (max-width: 640px) { .sk-meta { display: flex; flex-direction: column; align-items: center; } }
          .sk-line { border-radius: 8px; }

          .sk-body-section { max-width: 1280px; margin: 48px auto 0; padding: 0 24px; }
          .sk-search { height: 52px; border-radius: 99px; margin: 0 auto 32px; max-width: 640px; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }

          .sk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
          @media (min-width: 640px) { .sk-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
          @media (min-width: 1100px) { .sk-grid { grid-template-columns: repeat(4, 1fr); } }

          .sk-card { border-radius: 20px; overflow: hidden; border: 1px solid rgba(128,128,128,.1); background: ${defC.surface}; }
          .sk-img { width: 100%; aspect-ratio: 1/1; }
          .sk-body { padding: 16px; }

          .sk-pulse { background: linear-gradient(90deg, ${defC.surface} 0%, rgba(${hexToRgb(defC.primary)}, 0.08) 40%, ${defC.surface} 80%); background-size: 600px 100%; animation: shimmer 2s infinite linear; }
          
          .sk-spinner-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0 80px; gap: 16px; }
          .sk-spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid rgba(${hexToRgb(defC.primary)}, 0.15); border-top-color: ${defC.primary}; animation: sp .8s linear infinite; }
          .sk-spinner.small { width: 24px; height: 24px; border-width: 2px; }
          .sk-spinner-label { font-size: 14px; color: ${defC.textMuted}; font-weight: 500; letter-spacing: .02em; }
        `}</style>
        <div className="sk-page">
          <div className="sk-cover sk-pulse" />
          <div className="sk-hero">
            <div className="sk-avatar sk-pulse" />
            <div className="sk-meta">
              <div
                className="sk-line sk-pulse"
                style={{ width: "240px", height: "32px", marginBottom: "12px" }}
              />
              <div
                className="sk-line sk-pulse"
                style={{ width: "320px", height: "16px", marginBottom: "8px" }}
              />
              <div
                className="sk-line sk-pulse"
                style={{ width: "200px", height: "16px" }}
              />
            </div>
          </div>
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
          background: "#F9FAFB",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            color: "#6B7280",
            fontFamily: "system-ui",
            fontWeight: 500,
          }}
        >
          Cette boutique est introuvable.
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
          --c-bg:      ${c.background}; --c-bg-rgb: ${hexToRgb(c.background)};
          --c-primary: ${c.primary}; --c-primary-rgb: ${hexToRgb(c.primary)};
          --c-accent:  ${c.accent};
          --c-text:    ${c.text};
          --c-muted:   ${c.textMuted};
          --c-surface: ${c.surface}; --c-surface-rgb: ${hexToRgb(c.surface)};
          --c-card:    ${c.card};
          --c-border:  ${c.border};
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--c-bg); color: var(--c-text); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }

        @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
        .sk-pulse {
          background: linear-gradient(90deg, var(--c-surface) 0%, rgba(var(--c-primary-rgb), 0.06) 40%, var(--c-surface) 80%);
          background-size: 600px 100%; animation: shimmer 2s infinite linear; border-radius: 8px;
        }
        .sk-card { border-radius: 20px; overflow: hidden; border: 1px solid rgba(128,128,128,.1); background: var(--c-surface); }
        .sk-img { width: 100%; aspect-ratio: 1/1; }
        .sk-body { padding: 16px; }

        @keyframes page-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .sp-page { min-height: 100vh; opacity: 0; animation: page-in .8s cubic-bezier(0.16,1,0.3,1) forwards; }
        .sp-page.ready { opacity: 1; }

        @keyframes child-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .sp-anim { animation: child-in .8s cubic-bezier(0.16,1,0.3,1) both; }
        .sp-anim-1 { animation-delay: .05s; } .sp-anim-2 { animation-delay: .12s; }
        .sp-anim-3 { animation-delay: .20s; } .sp-anim-4 { animation-delay: .28s; }

        .sp-grid > * { animation: child-in .7s cubic-bezier(0.16,1,0.3,1) both; }
        .sp-grid > *:nth-child(1) { animation-delay: .2s; } .sp-grid > *:nth-child(2) { animation-delay: .26s; }
        .sp-grid > *:nth-child(3) { animation-delay: .32s; } .sp-grid > *:nth-child(4) { animation-delay: .38s; }
        .sp-grid > *:nth-child(5) { animation-delay: .44s; } .sp-grid > *:nth-child(n+6) { animation-delay: .5s; }

        /* ── Cover ── */
        .sp-cover {
          position: relative; width: 100%; height: 260px; overflow: hidden;
          border-radius: 0 0 32px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        @media (min-width: 900px) { .sp-cover { height: 340px; border-radius: 0 0 48px 48px; } }
        .sp-cover-img { transition: filter .8s ease, transform .8s ease; }
        .sp-cover:hover .sp-cover-img { transform: scale(1.02); }
        .sp-cover-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%); }
        .sp-no-cover {
          width: 100%; height: 200px; background: var(--c-surface);
          border-bottom: 1px solid var(--c-border); border-radius: 0 0 32px 32px; position: relative; overflow: hidden;
        }
        .sp-no-cover-pattern {
          position: absolute; inset: 0; opacity: 0.05;
          background-image: repeating-linear-gradient(45deg, var(--c-primary) 0, var(--c-primary) 1px, transparent 0, transparent 50%); background-size: 24px 24px;
        }

        /* ── Hero ── */
        .sp-hero { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .sp-profile-anchor {
          display: flex; align-items: flex-end; gap: 24px;
          transform: translateY(-56px); margin-bottom: -16px;
        }
        @media (max-width: 640px) {
          .sp-profile-anchor {
            flex-direction: column; align-items: center;
            transform: translateY(-64px); margin-bottom: -24px; gap: 16px;
          }
        }

        .sp-avatar-ring {
          width: 112px; height: 112px; border-radius: 50%;
          border: 6px solid var(--c-bg);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
          overflow: hidden; flex-shrink: 0; background: var(--c-surface);
          display: flex; align-items: center; justify-content: center; position: relative;
          transition: transform .4s cubic-bezier(0.16,1,0.3,1), box-shadow .4s ease;
        }
        .sp-avatar-ring:hover { transform: scale(1.05) translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.18); }
        @media (min-width: 640px) { .sp-avatar-ring { width: 128px; height: 128px; border-width: 6px; } }

        .sp-shop-meta { padding-bottom: 8px; flex: 1; min-width: 0; }
        @media (max-width: 640px) { .sp-shop-meta { text-align: center; display: flex; flex-direction: column; align-items: center; } }

        .sp-shop-name {
          font-family: var(--font-display); font-size: clamp(26px, 4vw, 40px);
          font-weight: 800; line-height: 1.1; letter-spacing: -0.03em;
          color: var(--c-text); margin-bottom: 8px;
        }
        .sp-shop-desc {
          font-size: 15px; color: var(--c-muted); line-height: 1.6; max-width: 540px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .sp-contacts { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
        .sp-contact-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 99px;
          background: rgba(var(--c-surface-rgb), 0.7); border: 1px solid rgba(var(--c-primary-rgb), 0.15);
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          color: var(--c-text); cursor: pointer; text-decoration: none;
          transition: all .2s cubic-bezier(0.16,1,0.3,1); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .sp-contact-pill:hover {
          background: var(--c-surface); border-color: var(--c-primary);
          transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .sp-wa-pill { color: #16a34a; } .sp-fb-pill { color: #2563eb; }

        /* ── Divider ── */
        .sp-divider { max-width: 1280px; margin: 0 auto 40px; padding: 0 24px; }
        .sp-divider-inner { height: 1px; background: linear-gradient(90deg, transparent, var(--c-border), transparent); opacity: 0.6; }

        /* ── Main ── */
        .sp-main { max-width: 1280px; margin: 0 auto; padding: 0 24px 80px; }

        /* ── Search Island (Premium) ── */
        .sp-search-wrap {
          position: sticky; top: 24px; z-index: 20;
          display: flex; justify-content: center; margin-bottom: 40px;
          pointer-events: none; /* Let clicks pass through margins */
        }
        @media (max-width: 640px) { .sp-search-wrap { top: 16px; margin-bottom: 24px; } }

        .sp-search-island {
          position: relative; width: 100%; max-width: 600px;
          background: rgba(var(--c-bg-rgb), 0.75);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(128,128,128,0.15);
          border-radius: 99px; padding: 6px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.03);
          display: flex; align-items: center; pointer-events: auto;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .sp-search-island:focus-within {
          border-color: rgba(var(--c-primary-rgb), 0.4);
          box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 0 0 4px rgba(var(--c-primary-rgb), 0.1);
        }

        .sp-search-icon {
          padding-left: 16px; color: var(--c-muted); opacity: 0.7; display: flex;
          transition: color 0.3s ease;
        }
        .sp-search-island:focus-within .sp-search-icon { color: var(--c-primary); opacity: 1; }

        .sp-search-input {
          flex: 1; padding: 12px 16px; background: transparent; border: none;
          font-family: var(--font-body); font-size: 15px; color: var(--c-text); outline: none;
        }
        .sp-search-input::placeholder { color: var(--c-muted); opacity: 0.6; }

        .sp-search-clear {
          background: rgba(128,128,128,0.1); border: none; width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; margin-right: 6px;
          color: var(--c-text); cursor: pointer; transition: all 0.2s;
        }
        .sp-search-clear:hover { background: rgba(128,128,128,0.2); transform: scale(1.05); }

        /* ── Section title ── */
        .sp-section-title { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .sp-section-label { font-family: var(--font-display); font-size: 14px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--c-text); }
        .sp-section-count { font-size: 13px; font-weight: 600; color: var(--c-text); background: var(--c-surface); border: 1px solid var(--c-border); border-radius: 99px; padding: 4px 12px; box-shadow: inset 0 1px 2px rgba(255,255,255,0.5); }

        /* ── Grid ── */
        .sp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 640px)  { .sp-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
        @media (min-width: 900px)  { .sp-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }
        @media (min-width: 1100px) { .sp-grid { grid-template-columns: repeat(4, 1fr); } }

        .sp-empty { text-align: center; padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--c-muted); animation: child-in .8s ease both; }
        .sp-empty-icon { width: 80px; height: 80px; border-radius: 50%; background: var(--c-surface); display: flex; align-items: center; justify-content: center; opacity: 0.5; }
        
        .sp-footer { text-align: center; font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--c-muted); opacity: 0.5; padding: 32px; margin-top: 32px; }
        .sp-load-more { display: flex; justify-content: center; padding: 32px 0; }
        .sp-scroll-sentinel { width: 100%; height: 1px; }

        @keyframes sp { to { transform: rotate(360deg) } }
        .sk-spinner.small { width: 28px; height: 28px; border-radius: 50%; border: 3px solid rgba(var(--c-primary-rgb), 0.15); border-top-color: var(--c-primary); animation: sp .8s linear infinite; }
      `}</style>

      <div className={`sp-page${pageReady ? " ready" : ""}`}>
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

        <div className="sp-hero sp-anim sp-anim-3">
          <div className="sp-profile-anchor">
            <div className="sp-avatar-ring">
              {vendor.profileImageUrl ? (
                <Image
                  src={vendor.profileImageUrl}
                  alt={vendor.shopName || "Avatar"}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="128px"
                  unoptimized
                />
              ) : (
                <svg
                  width="40"
                  height="40"
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
                      width="18"
                      height="18"
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
                      width="18"
                      height="18"
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

        <div className="sp-divider sp-anim sp-anim-4">
          <div className="sp-divider-inner" />
        </div>

        {featured.length > 0 && (
          <div className="sp-anim sp-anim-1" style={{ marginBottom: "40px" }}>
            <FeaturedCarousel
              featured={featured}
              formatPrice={formatPrice}
              onProductClick={setSelectedProduct}
            />
          </div>
        )}

        <ProductsSection
          slug={slug}
          initialProducts={initialProducts}
          initialPage={initialPage}
          initialHasNextPage={initialHasNextPage}
          initialTotalProducts={initialTotalProducts}
          theme={theme}
          formatPrice={formatPrice}
          onTrackWhatsapp={trackWhatsapp}
          onOpenProduct={setSelectedProduct}
        />

        <p className="sp-footer">Powered by Keyros</p>

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
