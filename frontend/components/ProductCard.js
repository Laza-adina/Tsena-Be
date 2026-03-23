"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════════ */
const Modal = ({ product, theme, onClose, handleWhatsapp, formatPrice }) => {
  const c = theme?.colors ?? {};
  const fontDisplay = theme?.fonts?.display ? `'${theme.fonts.display}', ` : "";
  const fontBody = theme?.fonts?.body ? `'${theme.fonts.body}', ` : "";

  // Overflow body + Escape — pas de setState ici
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
    <AnimatePresence mode="wait">
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 99999,
          pointerEvents: "none",
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(8px)",
          }}
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96, y: 28 }}
          transition={{ type: "spring", damping: 28, stiffness: 340 }}
          style={{
            position: "relative",
            background: c.card || c.background,
            width: "100%",
            maxWidth: "900px",
            maxHeight: "88vh",
            borderRadius: "24px",
            overflow: "hidden",
            display: "flex",
            boxShadow: "0 32px 80px rgba(0,0,0,0.40)",
            border: `1px solid ${c.border}`,
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-inner"
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* Image */}
            <div
              style={{
                width: "44%",
                position: "relative",
                minHeight: "300px",
                background: c.surface,
                flexShrink: 0,
              }}
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 700px) 100vw, 44vw"
                  unoptimized
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    color: c.textMuted,
                    fontSize: "13px",
                    fontFamily: `${fontBody}system-ui, sans-serif`,
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Pas d&apos;image</span>
                </div>
              )}
            </div>

            {/* Contenu */}
            <div
              style={{
                flex: 1,
                padding: "40px 36px",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                fontFamily: `${fontBody}system-ui, sans-serif`,
              }}
            >
              {/* Fermer */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: c.surface,
                  border: `1px solid ${c.border}`,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: c.textMuted,
                  transition: "background .15s, color .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = c.card;
                  e.currentTarget.style.color = c.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = c.surface;
                  e.currentTarget.style.color = c.textMuted;
                }}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>

              {product.reference && (
                <p
                  style={{
                    fontSize: "11px",
                    color: c.accent,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                    fontWeight: 600,
                  }}
                >
                  {product.reference}
                </p>
              )}

              <h2
                style={{
                  fontFamily: `${fontDisplay}system-ui, sans-serif`,
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: "800",
                  color: c.text,
                  margin: "0 0 14px",
                  lineHeight: "1.15",
                  letterSpacing: "-0.02em",
                }}
              >
                {product.name}
              </h2>

              <p
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  color: c.primary,
                  margin: "0 0 22px",
                  lineHeight: 1,
                  fontFamily: `${fontDisplay}system-ui, sans-serif`,
                }}
              >
               {formatPrice ? formatPrice(product.price) : `${product.price.toLocaleString()} Ar`}
              </p>

              {product.description && (
                <div style={{ flex: 1, marginBottom: "24px" }}>
                  <h4
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: c.textMuted,
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Description
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      color: c.textMuted,
                      lineHeight: "1.65",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {product.description}
                  </p>
                </div>
              )}

              <button
                onClick={handleWhatsapp}
                style={{
                  width: "100%",
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "15px 22px",
                  background: c.btn,
                  color: c.btnText,
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: `${fontBody}system-ui, sans-serif`,
                  transition: "opacity .15s, transform .1s",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
                  letterSpacing: ".01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = ".88";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "none";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.115 1.535 5.843L.057 24l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 0 1-5.001-1.366l-.359-.213-3.722.976.995-3.633-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                </svg>
                Commander via WhatsApp
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
            @media (max-width: 700px) {
              .modal-inner { flex-direction: column !important; }
              .modal-inner > div:nth-child(1) { width: 100% !important; min-height: 220px !important; max-height: 280px; }
              .modal-inner > div:nth-child(2) { width: 100% !important; padding: 22px 20px 24px !important; }
            }
          `,
            }}
          />
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};

/* ══════════════════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════════════════ */
const ProductCard = ({ product, theme, onTrack, formatPrice }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const c = theme?.colors ?? {};
  const fontDisp = theme?.fonts?.display ? `'${theme.fonts.display}', ` : "";
  const fontBody = theme?.fonts?.body ? `'${theme.fonts.body}', ` : "";

  const handleWhatsapp = useCallback(
    (e) => {
      e.stopPropagation();
      if (onTrack) onTrack();
      if (product.whatsappLink) window.open(product.whatsappLink, "_blank");
    },
    [onTrack, product.whatsappLink],
  );

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        style={{
          width: "100%",
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "pointer",
          isolation: "isolate",
          fontFamily: `${fontBody}system-ui, sans-serif`,
          background: c.card,
          border: `1px solid ${c.border}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          transition:
            "transform .22s cubic-bezier(0.22,0.68,0,1.2), box-shadow .22s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.13)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
        }}
      >
        {/* Image */}
        {product.image_url ? (
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{
                objectFit: "cover",
                transition: "transform .4s cubic-bezier(0.22,0.68,0,1.2)",
              }}
              sizes="(max-width: 480px) 50vw, (max-width: 1100px) 25vw, 20vw"
              unoptimized
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              background: c.surface,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: c.textMuted,
              fontSize: "12px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Pas d&apos;image</span>
          </div>
        )}

        {/* Body */}
        <div
          style={{ padding: "13px 14px 16px", position: "relative", zIndex: 3 }}
        >
          {product.reference && (
            <p
              style={{
                fontSize: "10px",
                color: c.accent,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                margin: "0 0 4px",
                fontWeight: 600,
              }}
            >
              {product.reference}
            </p>
          )}

          <h3
            style={{
              fontFamily: `${fontDisp}system-ui, sans-serif`,
              fontSize: "14px",
              fontWeight: "700",
              color: c.text,
              margin: "0 0 5px",
              lineHeight: "1.3",
              letterSpacing: "-0.01em",
            }}
          >
            {product.name}
          </h3>

          <p
            style={{
              fontSize: "11px",
              color: c.textMuted,
              margin: "0 0 8px",
              opacity: 0.55,
            }}
          >
            Voir les details
          </p>

          <p
            style={{
              fontFamily: `${fontDisp}system-ui, sans-serif`,
              fontSize: "17px",
              fontWeight: "700",
              color: c.text,
              margin: "0 0 12px",
              lineHeight: 1,
            }}
          >
          {formatPrice ? formatPrice(product.price) : `${product.price.toLocaleString()} Ar`}
          </p>

          <button
            onClick={handleWhatsapp}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "10px 12px",
              background: c.btn,
              color: c.btnText,
              border: "none",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: `${fontBody}system-ui, sans-serif`,
              transition: "opacity .15s, transform .1s",
              letterSpacing: ".01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = ".82";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.115 1.535 5.843L.057 24l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 0 1-5.001-1.366l-.359-.213-3.722.976.995-3.633-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            Commander
          </button>
        </div>
      </div>

      {modalOpen && (
  <Modal
    product={product}
    theme={theme}
    onClose={() => setModalOpen(false)}
    handleWhatsapp={handleWhatsapp}
    formatPrice={formatPrice}
  />
)}
    </>
  );
};

export default ProductCard;
