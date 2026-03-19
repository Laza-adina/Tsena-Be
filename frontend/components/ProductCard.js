'use client';

import { useState } from 'react';

const ProductCard = ({ product, theme }) => {
  const [expanded, setExpanded] = useState(false);

  const c = theme?.colors ?? {
    primary:    '#1D4ED8',
    accent:     '#F97316',
    text:       '#1e293b',
    textMuted:  '#64748b',
    surface:    'rgba(255, 253, 247, 0.58)',
    btn:        '#1D4ED8',
    btnText:    '#ffffff',
    btnHover:   '#1638a8',
  };

  const handleWhatsapp = (e) => {
    e.stopPropagation();
    if (product.whatsappLink) {
      window.open(product.whatsappLink, '_blank');
    }
  };

  return (
    <div
      onClick={() => setExpanded(v => !v)}
      style={{
        width: '100%',
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        isolation: 'isolate',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: c.surface,
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: `1px solid rgba(255,255,255,0.55)`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.80)`,
        transition: 'transform 0.25s cubic-bezier(0.22,0.68,0,1.2), box-shadow 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.9)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.80)`;
      }}
    >
      {/* Reflet glass */}
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '50%',
        background: 'linear-gradient(175deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.06) 55%, transparent 100%)',
        borderRadius: '20px 20px 60% 60% / 20px 20px 40% 40%',
        zIndex: 2,
      }} />
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.30)',
        zIndex: 3,
      }} />

      {/* Image */}
      {product.image_url ? (
        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: 'rgba(0,0,0,0.04)' }}>
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      ) : (
        <div style={{
          width: '100%', aspectRatio: '1/1',
          background: 'rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '8px', color: c.textMuted, fontSize: '13px',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Pas d&apos;image</span>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '13px 14px 38px', position: 'relative', zIndex: 4 }}>

        {product.reference && (
          <p style={{ fontSize: '10px', color: c.accent, letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 3px' }}>
            {product.reference}
          </p>
        )}

        <h3 style={{ fontSize: '14px', fontWeight: '700', color: c.text, margin: '0 0 5px', lineHeight: '1.35' }}>
          {product.name}
        </h3>

        {product.description && (
          <div style={{ marginBottom: '10px' }}>
            <p style={{
              fontSize: '12px',
              color: c.textMuted,
              lineHeight: '1.6',
              margin: 0,
              overflow: 'hidden',
              transition: 'max-height 0.38s ease',
              ...(expanded
                ? { maxHeight: '600px', display: 'block' }
                : {
                    maxHeight: '38px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }
              ),
            }}>
              {product.description}
            </p>
            {!expanded && product.description.length > 60 && (
              <span style={{ fontSize: '11px', color: c.accent, display: 'block', marginTop: '2px' }}>
                Voir plus ↓
              </span>
            )}
          </div>
        )}

        <p style={{ fontSize: '17px', fontWeight: '700', color: c.text, margin: '0 0 12px', lineHeight: 1 }}>
          {product.price.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '400', color: c.textMuted }}>Ar</span>
        </p>

        <button
          onClick={handleWhatsapp}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px',
            padding: '10px 12px',
            background: c.btn,
            color: c.btnText,
            border: 'none',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.18s ease, transform 0.1s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = c.btnHover}
          onMouseLeave={e => e.currentTarget.style.background = c.btn}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.115 1.535 5.843L.057 24l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 0 1-5.001-1.366l-.359-.213-3.722.976.995-3.633-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
          Commander via WhatsApp
        </button>
      </div>

      {/* Chevron */}
      <div style={{
        position: 'absolute', bottom: '11px', right: '13px',
        color: c.textMuted,
        transition: 'transform 0.3s ease',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        lineHeight: 0, zIndex: 4,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
};

export default ProductCard;