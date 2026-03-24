'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeaturedCarousel({
  items = [],
  theme,
  formatPrice,
  onItemClick,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayTimer = useRef(null);

  const c = theme?.colors ?? {};
  const fontDisp = theme?.fonts?.display ? `'${theme.fonts.display}', ` : '';
  const fontBody = theme?.fonts?.body ? `'${theme.fonts.body}', ` : '';

  if (!items || items.length === 0) return null;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setIsAutoplay(false);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setIsAutoplay(false);
  }, [items.length]);

  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
  }, []);

  // Autoplay logic
  useEffect(() => {
    if (!isAutoplay) {
      const timer = setTimeout(() => setIsAutoplay(true), 5000);
      return () => clearTimeout(timer);
    }

    autoplayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(autoplayTimer.current);
  }, [isAutoplay, items.length]);

  const current = items[currentIndex];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        background: c.surface,
        border: `1px solid ${c.border}`,
      }}
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* Main content */}
      <div
        style={{
          display: 'flex',
          height: '400px',
          position: 'relative',
        }}
      >
        {/* Image */}
        <div
          style={{
            width: '60%',
            position: 'relative',
            overflow: 'hidden',
            background: c.surface,
          }}
        >
          {current.image_url ? (
            <Image
              src={current.image_url}
              alt={current.name}
              fill
              style={{
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
              sizes="60vw"
              unoptimized
              priority
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: c.textMuted,
                fontSize: '14px',
              }}
            >
              <svg
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.2'
              >
                <rect x='3' y='3' width='18' height='18' rx='2' />
                <circle cx='8.5' cy='8.5' r='1.5' />
                <polyline points='21 15 16 10 5 21' />
              </svg>
              <span>Pas d&apos;image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            width: '40%',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: `${fontBody}system-ui, sans-serif`,
          }}
        >
          {/* Title & Info */}
          <div>
            {current.reference && (
              <p
                style={{
                  fontSize: '10px',
                  color: c.accent,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  margin: '0 0 8px',
                  fontWeight: 600,
                }}
              >
                {current.reference}
              </p>
            )}

            <h3
              style={{
                fontFamily: `${fontDisp}system-ui, sans-serif`,
                fontSize: '22px',
                fontWeight: '700',
                color: c.text,
                margin: '0 0 12px',
                lineHeight: '1.3',
                letterSpacing: '-0.01em',
              }}
            >
              {current.name}
            </h3>

            {/* Price */}
            <p
              style={{
                fontFamily: `${fontDisp}system-ui, sans-serif`,
                fontSize: '20px',
                fontWeight: '700',
                color: c.text,
                margin: '0 0 16px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {current.isPromoActive && current.promo_price ? (
                <>
                  <span
                    style={{
                      textDecoration: 'line-through',
                      color: c.textMuted,
                      fontSize: '14px',
                      opacity: 0.5,
                      fontWeight: '400',
                    }}
                  >
                    {formatPrice ? formatPrice(current.price) : `${current.price.toLocaleString()} Ar`}
                  </span>
                  <span style={{ color: '#FCD34D', fontSize: '24px' }}>
                    {formatPrice ? formatPrice(current.promo_price) : `${current.promo_price.toLocaleString()} Ar`}
                  </span>
                </>
              ) : (
                <span>
                  {formatPrice ? formatPrice(current.price) : `${current.price.toLocaleString()} Ar`}
                </span>
              )}
            </p>

            {/* Description */}
            {current.description && (
              <p
                style={{
                  fontSize: '13px',
                  color: c.textMuted,
                  lineHeight: '1.5',
                  margin: '0 0 16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {current.description}
              </p>
            )}
          </div>

          {/* Promo badge */}
          {current.isPromoActive && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#EF4444',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                width: 'fit-content',
              }}
            >
              🔥 Promo
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={20} color='#000' />
      </button>

      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronRight size={20} color='#000' />
      </button>

      {/* Dots indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
        }}
      >
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            style={{
              width: i === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: i === currentIndex ? '4px' : '50%',
              background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>

      {/* Click handler for modal */}
      <div
        onClick={() => onItemClick && onItemClick(current)}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer',
          zIndex: 1,
        }}
      />
    </div>
  );
}
