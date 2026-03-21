'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  main:    '#CCD5AE',
  light:   '#E9EDC9',
  cream:   '#FEFAE0',
  beige:   '#FAEDCD',
  caramel: '#D4A373',
  dark:    '#3D4A2A',
  text:    '#2D2D2D',
  muted:   '#6A7A52'
};

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0px)' : 'translateY(28px)',
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style
    }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const heroItem = (delay) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0px)' : 'translateY(32px)',
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.cream, color: C.text, minHeight: '100vh' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-title {
          font-size: 58px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1.08;
        }
        .section-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .step-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
        }
        .price-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 700;
        }
        .brand-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .hero-section { padding: 130px 40px 120px; }
        .section-pad  { padding: 100px 40px; }
        .steps-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .plans-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .footer-grid  { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
        .nav-links    { display: flex; gap: 32px; align-items: center; }
        .mobile-menu  { display: none; }
        .hamburger    { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }

        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          letter-spacing: 0.1px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(61,74,42,0.18); }
        .btn-secondary {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .btn-secondary:hover { background: rgba(61,74,42,0.06) !important; }

        .plan-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .plan-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(61,74,42,0.12); }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #3D4A2A;
          text-decoration: none;
          font-weight: 500;
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #3D4A2A;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }

        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
          .hero-section { padding: 80px 20px 70px !important; }
          .section-pad { padding: 60px 20px !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .plans-grid { grid-template-columns: 1fr !important; gap: 12px; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px; }
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          .mobile-menu { display: block; }
          .nav-inner { padding: 0 20px !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: C.cream, borderBottom: `1px solid ${C.light}`, height: '60px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 40px' }} className="nav-inner">
          <span className="brand-name" style={{ fontSize: '22px', color: C.dark }}>
            Tsen<span style={{ color: C.caramel }}>@</span>be
          </span>

          <div className="nav-links">
            <a href="#comment" className="nav-link">Comment ça marche</a>
            <a href="#tarifs" className="nav-link">Tarifs</a>
            <button className="btn-secondary" onClick={() => router.push('/login')} style={{ fontSize: '13px', color: C.dark, background: 'none', border: `1px solid ${C.dark}`, borderRadius: '6px', padding: '7px 18px', cursor: 'pointer' }}>
              Se connecter
            </button>
            <button className="btn-primary" onClick={() => router.push('/signup')} style={{ fontSize: '13px', color: C.cream, background: C.dark, border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' }}>
              Commencer gratuitement
            </button>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div style={{ width: '22px', height: '2px', background: C.dark, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <div style={{ width: '22px', height: '2px', background: C.dark, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
            <div style={{ width: '22px', height: '2px', background: C.dark, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{ background: C.cream, borderBottom: `1px solid ${C.light}`, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '60px', zIndex: 99 }}>
          <a href="#comment" onClick={() => setMenuOpen(false)} className="nav-link">Comment ça marche</a>
          <a href="#tarifs" onClick={() => setMenuOpen(false)} className="nav-link">Tarifs</a>
          <button className="btn-secondary" onClick={() => router.push('/login')} style={{ padding: '10px', background: 'none', border: `1px solid ${C.dark}`, borderRadius: '6px', fontSize: '14px', color: C.dark, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Se connecter
          </button>
          <button className="btn-primary" onClick={() => router.push('/signup')} style={{ padding: '10px', background: C.dark, border: 'none', borderRadius: '8px', fontSize: '14px', color: C.cream, cursor: 'pointer' }}>
            Commencer gratuitement
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="hero-section" style={{ background: C.cream, textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ ...heroItem(0), display: 'inline-block', background: C.light, color: C.muted, fontSize: '10px', fontWeight: '600', padding: '5px 18px', borderRadius: '20px', marginBottom: '32px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
            Pour les vendeurs malgaches
          </div>
          <h1 className="hero-title" style={{ ...heroItem(120), color: C.dark, margin: '0 0 24px' }}>
            Votre boutique en ligne{' '}
            <em style={{ color: C.caramel, fontStyle: 'italic' }}>en 5 minutes</em>
          </h1>
          <p style={{ ...heroItem(240), fontSize: '17px', color: C.muted, margin: '0 0 44px', lineHeight: '1.85', fontWeight: '300', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            Créez votre mini-boutique, partagez vos produits sur Facebook et recevez les commandes directement sur WhatsApp.
          </p>
          <div style={{ ...heroItem(360), display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => router.push('/signup')} style={{ fontSize: '15px', color: C.cream, background: C.dark, border: 'none', borderRadius: '8px', padding: '15px 34px', cursor: 'pointer' }}>
              Essayer gratuitement — 7 jours
            </button>
            <button className="btn-secondary" onClick={() => router.push('/login')} style={{ fontSize: '15px', color: C.dark, background: 'none', border: `1px solid ${C.dark}`, borderRadius: '8px', padding: '15px 34px', cursor: 'pointer' }}>
              Se connecter
            </button>
          </div>
          <p style={{ ...heroItem(480), fontSize: '12px', color: C.muted, marginTop: '20px', letterSpacing: '0.3px', fontWeight: '300' }}>
            Aucune carte bancaire requise. Essai gratuit de 7 jours.
          </p>
        </div>
      </section>

      <div style={{ height: '1px', background: C.light, margin: '0 40px' }} />

      {/* COMMENT ÇA MARCHE */}
      <section id="comment" className="section-pad" style={{ background: C.main }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <FadeIn>
            <h2 className="section-title" style={{ fontSize: '38px', color: C.dark, textAlign: 'center', margin: '0 0 10px' }}>
              Comment ça marche
            </h2>
            <p style={{ fontSize: '15px', color: C.muted, textAlign: 'center', margin: '0 0 52px', fontWeight: '300' }}>
              Trois étapes pour avoir votre boutique en ligne.
            </p>
          </FadeIn>
          <div className="steps-grid" style={{ background: C.light, borderRadius: '20px', overflow: 'hidden' }}>
            {[
              { num: '01', title: 'Créez votre compte', desc: 'Inscrivez-vous avec votre e-mail, choisissez un nom de boutique et ajoutez votre numéro WhatsApp.' },
              { num: '02', title: 'Ajoutez vos produits', desc: 'Importez les photos de vos articles, renseignez les prix et une référence. Votre catalogue est prêt.' },
              { num: '03', title: 'Partagez votre lien', desc: 'Copiez votre lien unique et partagez-le sur Facebook, WhatsApp ou imprimez votre QR Code.' }
            ].map((step, i) => (
              <FadeIn key={step.num} delay={i * 100}>
                <div className="plan-card" style={{ background: C.main, padding: '40px 30px', height: '100%' }}>
                  <p className="step-num" style={{ fontSize: '56px', fontWeight: '600', color: C.light, margin: '0 0 20px', lineHeight: 1 }}>
                    {step.num}
                  </p>
                  <h3 style={{ fontSize: '17px', fontWeight: '600', color: C.dark, margin: '0 0 12px', fontFamily: 'DM Sans, sans-serif' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: C.muted, margin: 0, lineHeight: '1.85', fontWeight: '300' }}>
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: '1px', background: C.light, margin: '0 40px' }} />

      {/* TARIFS */}
      <section id="tarifs" className="section-pad" style={{ background: C.cream }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <FadeIn>
            <h2 className="section-title" style={{ fontSize: '38px', color: C.dark, textAlign: 'center', margin: '0 0 10px' }}>
              Tarifs simples
            </h2>
            <p style={{ fontSize: '15px', color: C.muted, textAlign: 'center', margin: '0 0 52px', fontWeight: '300' }}>
              Commencez gratuitement. Payez uniquement quand vous êtes prêt.
            </p>
          </FadeIn>
          <div className="plans-grid">

            <FadeIn delay={0}>
              <div className="plan-card" style={{ background: C.light, borderRadius: '20px', padding: '36px 26px', height: '100%' }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: C.muted, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '2px' }}>Essai gratuit</p>
                <p className="price-num" style={{ fontSize: '42px', color: C.dark, margin: '0 0 4px', lineHeight: 1 }}>0 Ar</p>
                <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 28px', fontWeight: '300' }}>pendant 7 jours</p>
                <div style={{ marginBottom: '28px' }}>
                  {["Catalogue jusqu'à 5 produits", 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.muted, flexShrink: 0 }} />
                      <p style={{ fontSize: '13px', color: C.muted, margin: 0, fontWeight: '300' }}>{f}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary" onClick={() => router.push('/signup')} style={{ width: '100%', padding: '13px', background: 'none', border: `1.5px solid ${C.dark}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: C.dark, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Commencer
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="plan-card" style={{ background: C.beige, borderRadius: '20px', padding: '36px 26px', height: '100%' }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: C.muted, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '2px' }}>Mensuel</p>
                <p className="price-num" style={{ fontSize: '42px', color: C.dark, margin: '0 0 4px', lineHeight: 1 }}>10 000 Ar</p>
                <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 28px', fontWeight: '300' }}>par mois</p>
                <div style={{ marginBottom: '28px' }}>
                  {['Catalogue illimité', 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.caramel, flexShrink: 0 }} />
                      <p style={{ fontSize: '13px', color: C.muted, margin: 0, fontWeight: '300' }}>{f}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => router.push('/signup')} style={{ width: '100%', padding: '13px', background: C.caramel, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#fff', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Commencer
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="plan-card" style={{ background: C.dark, borderRadius: '20px', padding: '36px 26px', height: '100%' }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: C.main, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '2px' }}>Annuel</p>
                <p className="price-num" style={{ fontSize: '42px', color: C.cream, margin: '0 0 4px', lineHeight: 1 }}>100 000 Ar</p>
                <p style={{ fontSize: '13px', color: C.main, margin: '0 0 28px', fontWeight: '300' }}>par an — 2 mois offerts</p>
                <div style={{ marginBottom: '28px' }}>
                  {['Catalogue illimité', 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.main, flexShrink: 0 }} />
                      <p style={{ fontSize: '13px', color: C.main, margin: 0, fontWeight: '300' }}>{f}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => router.push('/signup')} style={{ width: '100%', padding: '13px', background: C.main, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: C.dark, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Commencer
                </button>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={100}>
            <p style={{ textAlign: 'center', fontSize: '13px', color: C.muted, marginTop: '28px', fontWeight: '300' }}>
              Paiement via MVola, Orange Money ou Airtel Money. Activation manuelle sous 24h.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.dark, padding: '64px 40px 40px' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ marginBottom: '48px' }}>
            <div>
              <p className="brand-name" style={{ fontSize: '24px', color: C.cream, margin: '0 0 14px' }}>
                Tsen<span style={{ color: C.caramel }}>@</span>be
              </p>
              <p style={{ fontSize: '14px', color: C.main, lineHeight: '1.85', margin: '0 0 24px', fontWeight: '300' }}>
                La plateforme de mini-boutiques pour les vendeurs malgaches. Simple, rapide, adaptée à votre quotidien.
              </p>
              <a href="https://wa.me/261345159568" rel="noreferrer" target="_blank" style={{ fontSize: '13px', color: C.caramel, textDecoration: 'none', fontWeight: '500', borderBottom: `1px solid ${C.caramel}40`, paddingBottom: '1px' }}>
                Nous contacter sur WhatsApp
              </a>
            </div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: '600', color: C.main, margin: '0 0 22px', textTransform: 'uppercase', letterSpacing: '2px' }}>Plateforme</p>
              {[
                { label: 'Créer un compte',       href: '/signup' },
                { label: 'Se connecter',           href: '/login' },
                { label: 'Comment ça marche',      href: '#comment' },
                { label: 'Tarifs',                 href: '#tarifs' }
              ].map(link => (
                <a key={link.label} href={link.href} style={{ display: 'block', fontSize: '13px', color: C.light, textDecoration: 'none', marginBottom: '14px', fontWeight: '300', opacity: 0.85, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.target.style.opacity = '1'} onMouseLeave={e => e.target.style.opacity = '0.85'}>
                  {link.label}
                </a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: '600', color: C.main, margin: '0 0 22px', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact</p>
              {[
                { label: 'WhatsApp', href: 'https://wa.me/261345159568' },
                { label: 'Facebook', href: '#' }
              ].map(link => (
                <a key={link.label} href={link.href} rel="noreferrer" target="_blank" style={{ display: 'block', fontSize: '13px', color: C.light, textDecoration: 'none', marginBottom: '14px', fontWeight: '300', opacity: 0.85, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.target.style.opacity = '1'} onMouseLeave={e => e.target.style.opacity = '0.85'}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #4A5A32', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '12px', color: C.muted, margin: 0, fontWeight: '300' }}>powered by keyros.</p>
            <p style={{ fontSize: '12px', color: C.muted, margin: 0, fontWeight: '300' }}>Madagascar</p>
          </div>
        </div>
      </footer>

    </div>
  );
}