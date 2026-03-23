'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
};

const clamp  = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round  = (v, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCardComponent = ({
  avatarUrl        = '',
  glowColor        = '',
  themeColors      = null,
  className        = '',
  enableTilt       = false, // <- Désactivé par défaut
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  name             = '',
  description      = '',
  whatsapp         = '',
  facebook         = '',
  onWhatsappClick,
  onFacebookClick,
}) => {
  const wrapRef       = useRef(null);
  const shellRef      = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef   = useRef(null);

  /* ── Tilt engine ── */
  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;
    let rafId = null, running = false, lastTs = 0;
    let cx = 0, cy = 0, tx = 0, ty = 0;
    const DEFAULT_TAU = 0.14, INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVars = (x, y) => {
      const shell = shellRef.current, wrap = wrapRef.current;
      if (!shell || !wrap) return;
      const w  = shell.clientWidth  || 1;
      const h  = shell.clientHeight || 1;
      const px = clamp((100 / w) * x);
      const py = clamp((100 / h) * y);
      const dx = px - 50, dy = py - 50;
      const props = {
        '--pointer-x':           `${px}%`,
        '--pointer-y':           `${py}%`,
        '--background-x':        `${adjust(px, 0, 100, 35, 65)}%`,
        '--background-y':        `${adjust(py, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(dy, dx) / 50, 0, 1)}`,
        '--pointer-from-top':    `${py / 100}`,
        '--pointer-from-left':   `${px / 100}`,
        '--rotate-x':            `${round(-(dx / 5))}deg`,
        '--rotate-y':            `${round(dy / 4)}deg`,
      };
      for (const [k, v] of Object.entries(props)) wrap.style.setProperty(k, v);
    };

    const step = ts => {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      const dt  = (ts - lastTs) / 1000; lastTs = ts;
      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k   = 1 - Math.exp(-dt / tau);
      cx += (tx - cx) * k; cy += (ty - cy) * k;
      setVars(cx, cy);
      const far = Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05;
      if (far || document.hasFocus()) rafId = requestAnimationFrame(step);
      else { running = false; lastTs = 0; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
    };

    const start = () => { if (running) return; running = true; lastTs = 0; rafId = requestAnimationFrame(step); };

    return {
      setImmediate(x, y) { cx = x; cy = y; setVars(x, y); },
      setTarget(x, y)    { tx = x; ty = y; start(); },
      toCenter() { const s = shellRef.current; if (s) this.setTarget(s.clientWidth / 2, s.clientHeight / 2); },
      beginInitial(ms) { initialUntil = performance.now() + ms; start(); },
      getCurrent() { return { x: cx, y: cy, tx, ty }; },
      cancel() { if (rafId) cancelAnimationFrame(rafId); rafId = null; running = false; lastTs = 0; },
    };
  }, [enableTilt]);

  const offs = (e, el) => { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  const onMove  = useCallback(e => { const s = shellRef.current; if (!s || !tiltEngine) return; const {x,y} = offs(e,s); tiltEngine.setTarget(x,y); }, [tiltEngine]);
  const onEnter = useCallback(e => {
    const s = shellRef.current; if (!s || !tiltEngine) return;
    s.classList.add('active','entering');
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    enterTimerRef.current = setTimeout(() => s.classList.remove('entering'), ANIMATION_CONFIG.ENTER_TRANSITION_MS);
    const {x,y} = offs(e,s); tiltEngine.setTarget(x,y);
  }, [tiltEngine]);
  const onLeave = useCallback(() => {
    const s = shellRef.current; if (!s || !tiltEngine) return;
    tiltEngine.toCenter();
    const check = () => {
      const {x,y,tx,ty} = tiltEngine.getCurrent();
      if (Math.hypot(tx-x,ty-y) < 0.6) { s.classList.remove('active'); leaveRafRef.current = null; }
      else leaveRafRef.current = requestAnimationFrame(check);
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(check);
  }, [tiltEngine]);

  const onOrientation = useCallback(e => {
    const s = shellRef.current; if (!s || !tiltEngine) return;
    const {beta,gamma} = e; if (beta == null || gamma == null) return;
    const x = clamp(s.clientWidth/2  + gamma * mobileTiltSensitivity, 0, s.clientWidth);
    const y = clamp(s.clientHeight/2 + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity, 0, s.clientHeight);
    tiltEngine.setTarget(x,y);
  }, [tiltEngine, mobileTiltSensitivity]);

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;
    const s = shellRef.current; if (!s) return;
    s.addEventListener('pointerenter', onEnter);
    s.addEventListener('pointermove',  onMove);
    s.addEventListener('pointerleave', onLeave);
    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      const M = window.DeviceMotionEvent;
      if (M && typeof M.requestPermission === 'function')
        M.requestPermission().then(st => { if (st === 'granted') window.addEventListener('deviceorientation', onOrientation); }).catch(console.error);
      else window.addEventListener('deviceorientation', onOrientation);
    };
    s.addEventListener('click', handleClick);
    tiltEngine.setImmediate(s.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET, ANIMATION_CONFIG.INITIAL_Y_OFFSET);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
    return () => {
      s.removeEventListener('pointerenter', onEnter);
      s.removeEventListener('pointermove',  onMove);
      s.removeEventListener('pointerleave', onLeave);
      s.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', onOrientation);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current)   cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      s.classList.remove('entering');
    };
  }, [enableTilt, enableMobileTilt, tiltEngine, onMove, onEnter, onLeave, onOrientation]);

  /* Compute theme-aware CSS variables from glowColor + themeColors */
  const cardStyle = useMemo(() => {
    const tc = themeColors || {};

    // Detect if theme is dark (background luminance < 0.2)
    const isDark = tc.background
      ? (() => {
          const h = tc.background.replace('#','');
          if (h.length !== 6) return false;
          const r = parseInt(h.slice(0,2),16)/255;
          const g = parseInt(h.slice(2,4),16)/255;
          const b = parseInt(h.slice(4,6),16)/255;
          return 0.299*r + 0.587*g + 0.114*b < 0.35;
        })()
      : false;

    const alpha = (hex, a) => {
      if (!hex || !hex.startsWith('#')) return `rgba(128,128,128,${a})`;
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    };

    const p = tc.primary   || '#6B7280';
    const a = tc.accent    || '#aaaaaa';
    const t = tc.text      || (isDark ? '#f0f0f0' : '#111111');
    const m = tc.textMuted || (isDark ? '#aaaaaa' : '#555555');

    return {
      '--behind-glow-color':   glowColor || alpha(p, 0.55),
      '--behind-glow-size':    '55%',
      '--pc-glass-bg':         isDark ? alpha(p, 0.10) : alpha(p, 0.07),
      '--pc-glass-border':     isDark ? alpha(p, 0.35) : alpha(p, 0.22),
      '--pc-shadow':           isDark ? `rgba(0,0,0,0.45)` : alpha(p, 0.18),
      '--pc-inset-top':        isDark ? alpha(a, 0.30) : `rgba(255,255,255,0.60)`,
      '--pc-text':             isDark ? `rgba(240,240,255,0.95)` : t,
      '--pc-text-muted':       isDark ? `rgba(200,200,220,0.70)` : m,
      '--pc-sep':              isDark ? alpha(a, 0.35) : alpha(p, 0.30),
      '--pc-row-bg':           isDark ? alpha(p, 0.15) : alpha(p, 0.08),
      '--pc-row-border':       isDark ? alpha(a, 0.25) : alpha(p, 0.18),
      '--pc-row-hover':        isDark ? alpha(p, 0.28) : alpha(p, 0.16),
      '--pc-row-border-hover': isDark ? alpha(a, 0.50) : alpha(p, 0.35),
      '--pc-contact-val':      isDark ? `rgba(240,240,255,0.90)` : t,
      '--pc-contact-lbl':      isDark ? `rgba(180,180,210,0.55)` : m,
    };
  }, [glowColor, themeColors]);

  const handleWa = useCallback(() => {
    if (onWhatsappClick) onWhatsappClick();
    else if (whatsapp) window.open(`https://wa.me/${whatsapp}`, '_blank');
  }, [onWhatsappClick, whatsapp]);

  const handleFb = useCallback(() => {
    if (onFacebookClick) onFacebookClick();
    else if (facebook) window.open(facebook, '_blank');
  }, [onFacebookClick, facebook]);

  return (
    <div ref={wrapRef} className={`pc-wrapper ${className}`.trim()} style={cardStyle}>
      {/* Glow derrière */}
      <div className="pc-behind" />

      <div ref={shellRef} className="pc-shell">
        <div className="pc-card">

          {/* ── Contenu principal ── */}
          <div className="pc-body">

            {/* Logo / avatar centré en haut */}
            <div className="pc-logo-wrap">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="pc-logo" onError={e => e.target.style.display='none'} />
              ) : (
                <div className="pc-logo-placeholder">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Nom */}
            <h3 className="pc-name">{name}</h3>

            {/* Description / slogan */}
            {description && (
              <p className="pc-desc">{description}</p>
            )}

            {/* Séparateur */}
            <div className="pc-sep" />

            {/* Coordonnées */}
            <div className="pc-contacts">

              {whatsapp && (
                <button className="pc-contact-row" onClick={handleWa} type="button">
                  <span className="pc-contact-icon pc-wa-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.115 1.535 5.843L.057 24l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 0 1-5.001-1.366l-.359-.213-3.722.976.995-3.633-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                  </span>
                  <div className="pc-contact-info">
                    <span className="pc-contact-label">WhatsApp</span>
                    <span className="pc-contact-value">+{whatsapp}</span>
                  </div>
                  <svg className="pc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </button>
              )}

              {facebook && (
                <button className="pc-contact-row" onClick={handleFb} type="button">
                  <span className="pc-contact-icon pc-fb-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                    </svg>
                  </span>
                  <div className="pc-contact-info">
                    <span className="pc-contact-label">Facebook</span>
                    <span className="pc-contact-value">Voir la page →</span>
                  </div>
                  <svg className="pc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </button>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;