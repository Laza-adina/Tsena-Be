"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Info } from "lucide-react";
import styles from "./ProductCard.module.css";

/* ══════════════════════════════════════════════════════════
   MODAL (Premium Cinematic View)
══════════════════════════════════════════════════════════ */
const Modal = ({ product, theme, onClose, handleWhatsapp, formatPrice }) => {
  const c = theme?.colors ?? {};
  const fontDisplay = theme?.fonts?.display ? `'${theme.fonts.display}', ` : "";
  const fontBody = theme?.fonts?.body ? `'${theme.fonts.body}', ` : "";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <div
        className={styles.modalBackdrop}
        onClick={onClose}
        style={{ zIndex: 9999 }}
      >
        <motion.div
          className={styles.modalBackdropBg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />

        <div className={styles.modalWrapper}>
          <motion.div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              "--font-display": `${fontDisplay}system-ui, sans-serif`,
              "--font-body": `${fontBody}system-ui, sans-serif`,
              background: c.surface || "#ffffff",
              color: c.text || "#111827",
            }}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={onClose}
              aria-label="Fermer"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className={styles.modalGrid}>
              {/* Colonne Image */}
              <div className={styles.modalImageCol}>
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className={styles.modalImage}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                ) : (
                  <div className={styles.modalNoImage}>
                    <Info
                      size={48}
                      strokeWidth={1}
                      color={c.textMuted || "#9CA3AF"}
                    />
                    <span>Aucune image</span>
                  </div>
                )}
                {/* Badges sur l'image */}
                {(product.isNewActive || product.isPromoActive) && (
                  <div className={styles.modalBadges}>
                    {product.isNewActive && (
                      <span className={`${styles.badge} ${styles.badgeNew}`}>
                        Nouveau
                      </span>
                    )}
                    {product.isPromoActive && (
                      <span className={`${styles.badge} ${styles.badgePromo}`}>
                        Promo
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Colonne Infos */}
              <div className={styles.modalInfoCol}>
                <div className={styles.modalHeader}>
                  {product.reference && (
                    <span className={styles.modalRef}>
                      RÉF: {product.reference}
                    </span>
                  )}
                  <h2 className={styles.modalTitle}>{product.name}</h2>

                  <div className={styles.modalPriceWrap}>
                    {product.isPromoActive && product.promo_price ? (
                      <>
                        <span className={styles.modalPriceOld}>
                          {formatPrice(product.price)}
                        </span>
                        <span
                          className={styles.modalPriceNew}
                          style={{ color: c.primary || "#3B82F6" }}
                        >
                          {formatPrice(product.promo_price)}
                        </span>
                      </>
                    ) : (
                      <span className={styles.modalPrice}>
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.modalDescWrap}>
                  <h3 className={styles.modalDescTitle}>Description</h3>
                  <p className={styles.modalDesc}>
                    {product.description ||
                      "Aucune description disponible pour ce produit."}
                  </p>
                </div>

                <div className={styles.modalAction}>
                  <button
                    className={styles.modalBtnWa}
                    onClick={handleWhatsapp}
                    style={{
                      background: c.primary || "#10B981",
                      color: "#ffffff",
                    }}
                  >
                    <span>Commander via WhatsApp</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};

/* ══════════════════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════════════════ */
export default function ProductCard({
  product,
  theme,
  onTrack,
  onClose,
  isModal = false,
  formatPrice,
}) {
  const [showModal, setShowModal] = useState(isModal);
  const c = theme?.colors ?? {};

  const handleWhatsapp = (e) => {
    if (e) e.stopPropagation();
    if (onTrack) onTrack();
    if (product.whatsappLink) {
      window.open(product.whatsappLink, "_blank", "noopener,noreferrer");
    }
  };

  const currentPrice =
    product.isPromoActive && product.promo_price
      ? product.promo_price
      : product.price;
  const oldPrice =
    product.isPromoActive && product.promo_price ? product.price : null;

  if (isModal) {
    return (
      <Modal
        product={product}
        theme={theme}
        onClose={onClose}
        handleWhatsapp={handleWhatsapp}
        formatPrice={formatPrice}
      />
    );
  }

  return (
    <>
      <div
        className={styles.card}
        onClick={() => setShowModal(true)}
        style={{
          "--c-surface": c.surface || "#ffffff",
          "--c-border": c.border || "rgba(128,128,128,0.1)",
          "--c-text": c.text || "#111827",
          "--c-muted": c.textMuted || "#6B7280",
          "--c-primary": c.primary || "#3B82F6",
        }}
      >
        <div className={styles.cardShine} />

        <div className={styles.imgWrap}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className={styles.img}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
          ) : (
            <div className={styles.noImg}>
              <Info size={32} strokeWidth={1.5} opacity={0.5} />
            </div>
          )}

          <div className={styles.imgOverlay} />

          <div className={styles.badges}>
            {product.isNewActive && (
              <span className={`${styles.badge} ${styles.badgeNew}`}>
                Nouveau
              </span>
            )}
            {product.isPromoActive && (
              <span className={`${styles.badge} ${styles.badgePromo}`}>
                Promo
              </span>
            )}
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            {product.reference && (
              <div className={styles.ref}>{product.reference}</div>
            )}
            <h3 className={styles.productName} title={product.name}>
              {product.name}
            </h3>
          </div>

          <div className={styles.priceWrap}>
            {oldPrice && (
              <span className={styles.oldPrice}>{formatPrice(oldPrice)}</span>
            )}
            <span
              className={styles.price}
              style={{ color: oldPrice ? "var(--c-primary)" : "var(--c-text)" }}
            >
              {formatPrice(currentPrice)}
            </span>
          </div>

          <button
            className={styles.btnWa}
            onClick={handleWhatsapp}
            style={{ background: "var(--c-primary)", color: "#ffffff" }}
          >
            Commander
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className={styles.btnIcon}
            />
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          product={product}
          theme={theme}
          onClose={() => setShowModal(false)}
          handleWhatsapp={handleWhatsapp}
          formatPrice={formatPrice}
        />
      )}
    </>
  );
}
