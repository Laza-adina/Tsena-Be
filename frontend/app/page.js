'use client';

import { useState } from 'react';
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

export default function LandingPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: C.cream, color: C.text, minHeight: '100vh' }}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-title { font-size: 52px; }
        .hero-section { padding: 120px 40px; }
        .section-pad { padding: 100px 40px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .mobile-menu { display: none; }
        .hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }
        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; letter-spacing: -0.5px !important; }
          .hero-section { padding: 80px 20px !important; }
          .section-pad { padding: 60px 20px !important; }
          .steps-grid { grid-template-columns: 1fr !important; gap: 2px; }
          .plans-grid { grid-template-columns: 1fr !important; gap: 12px; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px; }
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          .mobile-menu { display: block; }
          .nav-inner { padding: 0 20px !important; }
          .section-inner { max-width: 100% !important; padding: 0 20px !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: C.cream, borderBottom: `1px solid ${C.light}`, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }} className="nav-inner" >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 40px' }} className="nav-inner">
          <span style={{ fontSize: '18px', fontWeight: '700', color: C.dark, letterSpacing: '-0.5px' }}>
            Tsen<span style={{ color: C.main }}>@</span>be
          </span>

          {/* Desktop links */}
          <div className="nav-links">
            <a href="#comment" style={{ fontSize: '14px', color: C.dark, textDecoration: 'none' }}>
              <span>Comment ca marche</span>
            </a>
            <a href="#tarifs" style={{ fontSize: '14px', color: C.dark, textDecoration: 'none' }}>
              <span>Tarifs</span>
            </a>
            <button onClick={() => router.push('/login')} style={{ fontSize: '13px', color: C.dark, background: 'none', border: `1px solid ${C.dark}`, borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              <span>Se connecter</span>
            </button>
            <button onClick={() => router.push('/signup')} style={{ fontSize: '13px', color: C.cream, background: C.dark, border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: '600' }}>
              <span>Commencer gratuitement</span>
            </button>
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div style={{ width: '22px', height: '2px', background: C.dark }} />
            <div style={{ width: '22px', height: '2px', background: C.dark }} />
            <div style={{ width: '22px', height: '2px', background: C.dark }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{ background: C.cream, borderBottom: `1px solid ${C.light}`, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '60px', zIndex: 99 }}>
          <a href="#comment" onClick={() => setMenuOpen(false)} style={{ fontSize: '14px', color: C.dark, textDecoration: 'none' }}>
            <span>Comment ca marche</span>
          </a>
          <a href="#tarifs" onClick={() => setMenuOpen(false)} style={{ fontSize: '14px', color: C.dark, textDecoration: 'none' }}>
            <span>Tarifs</span>
          </a>
          <button onClick={() => router.push('/login')} style={{ padding: '10px', background: 'none', border: `1px solid ${C.dark}`, borderRadius: '6px', fontSize: '14px', color: C.dark, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
            <span>Se connecter</span>
          </button>
          <button onClick={() => router.push('/signup')} style={{ padding: '10px', background: C.dark, border: 'none', borderRadius: '6px', fontSize: '14px', color: C.cream, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: '600' }}>
            <span>Commencer gratuitement</span>
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="hero-section" style={{ background: C.cream, textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: C.light, color: C.dark, fontSize: '11px', fontWeight: '700', padding: '5px 16px', borderRadius: '20px', marginBottom: '28px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Pour les vendeurs malgaches
          </div>
          <h1 className="hero-title" style={{ fontWeight: '700', color: C.dark, margin: '0 0 20px', lineHeight: '1.15', letterSpacing: '-1.5px' }}>
            Votre boutique en ligne en 5 minutes
          </h1>
          <p style={{ fontSize: '17px', color: C.muted, margin: '0 0 40px', lineHeight: '1.8' }}>
            Creez votre mini-boutique, partagez vos produits sur Facebook et recevez les commandes directement sur WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/signup')} style={{ fontSize: '15px', fontWeight: '700', color: C.cream, background: C.dark, border: 'none', borderRadius: '8px', padding: '15px 32px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              <span>Essayer gratuitement 7 jours</span>
            </button>
            <button onClick={() => router.push('/login')} style={{ fontSize: '15px', color: C.dark, background: 'none', border: `1px solid ${C.dark}`, borderRadius: '8px', padding: '15px 32px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              <span>Se connecter</span>
            </button>
          </div>
          <p style={{ fontSize: '13px', color: C.muted, marginTop: '20px' }}>
            Aucune carte bancaire requise. Essai gratuit de 7 jours.
          </p>
        </div>
      </section>

      <div style={{ height: '1px', background: C.light, margin: '0 40px' }} />

      {/* COMMENT CA MARCHE */}
      <section id="comment" className="section-pad" style={{ background: C.main }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: C.dark, textAlign: 'center', margin: '0 0 8px' }}>
            Comment ca marche
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, textAlign: 'center', margin: '0 0 48px' }}>
            Trois etapes pour avoir votre boutique en ligne.
          </p>
          <div className="steps-grid" style={{ background: C.light, borderRadius: '16px', overflow: 'hidden' }}>
            {[
              { num: '01', title: 'Creez votre compte', desc: 'Inscrivez-vous avec votre email, choisissez un nom de boutique et ajoutez votre numero WhatsApp.' },
              { num: '02', title: 'Ajoutez vos produits', desc: 'Uploadez les photos de vos articles, ajoutez les prix et une reference. Votre catalogue est pret.' },
              { num: '03', title: 'Partagez votre lien', desc: 'Copiez votre lien unique et partagez-le sur Facebook, WhatsApp ou imprimez votre QR code.' }
            ].map(step => (
              <div key={step.num} style={{ background: C.main, padding: '36px 28px' }}>
                <p style={{ fontSize: '40px', fontWeight: '700', color: C.light, margin: '0 0 16px', lineHeight: 1 }}>
                  {step.num}
                </p>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: C.dark, margin: '0 0 10px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0, lineHeight: '1.8' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: '1px', background: C.light, margin: '0 40px' }} />

      {/* TARIFS */}
      <section id="tarifs" className="section-pad" style={{ background: C.cream }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: C.dark, textAlign: 'center', margin: '0 0 8px' }}>
            Tarifs simples
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, textAlign: 'center', margin: '0 0 48px' }}>
            Commencez gratuitement. Payez uniquement quand vous etes pret.
          </p>
          <div className="plans-grid">

            <div style={{ background: C.light, borderRadius: '16px', padding: '32px 24px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.muted, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Essai gratuit</p>
              <p style={{ fontSize: '36px', fontWeight: '700', color: C.dark, margin: '0 0 4px', lineHeight: 1 }}>0 Ar</p>
              <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 24px' }}>pendant 7 jours</p>
              <div style={{ marginBottom: '24px' }}>
                {["Catalogue jusqu'a 5 produits", 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.muted, flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{f}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/signup')} style={{ width: '100%', padding: '12px', background: 'none', border: `1.5px solid ${C.dark}`, borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: C.dark, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                <span>Commencer</span>
              </button>
            </div>

            <div style={{ background: C.beige, borderRadius: '16px', padding: '32px 24px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.muted, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Mensuel</p>
              <p style={{ fontSize: '36px', fontWeight: '700', color: C.dark, margin: '0 0 4px', lineHeight: 1 }}>10 000 Ar</p>
              <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 24px' }}>par mois</p>
              <div style={{ marginBottom: '24px' }}>
                {['Catalogue illimite', 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.caramel, flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{f}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/signup')} style={{ width: '100%', padding: '12px', background: C.caramel, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: '#fff', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                <span>Commencer</span>
              </button>
            </div>

            <div style={{ background: C.dark, borderRadius: '16px', padding: '32px 24px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.main, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Annuel</p>
              <p style={{ fontSize: '36px', fontWeight: '700', color: C.cream, margin: '0 0 4px', lineHeight: 1 }}>100 000 Ar</p>
              <p style={{ fontSize: '13px', color: C.main, margin: '0 0 24px' }}>par an — 2 mois offerts</p>
              <div style={{ marginBottom: '24px' }}>
                {['Catalogue illimite', 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.main, flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: C.main, margin: 0 }}>{f}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/signup')} style={{ width: '100%', padding: '12px', background: C.main, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: C.dark, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                <span>Commencer</span>
              </button>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '13px', color: C.muted, marginTop: '24px' }}>
            Paiement via MVola, Orange Money ou Airtel Money. Activation manuelle sous 24h.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.dark, padding: '60px 40px 40px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ marginBottom: '48px' }}>
            <div>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.cream, margin: '0 0 12px' }}>
                Tsen<span style={{ color: C.main }}>@</span>be
              </p>
              <p style={{ fontSize: '14px', color: C.main, lineHeight: '1.8', margin: '0 0 20px' }}>
                La plateforme de mini-boutiques pour les vendeurs malgaches. Simple, rapide, adapte a votre quotidien.
              </p>
              <a href="https://wa.me/261345159568" rel="noreferrer" target="_blank" style={{ fontSize: '13px', color: C.caramel, textDecoration: 'none' }}>
                <span>Nous contacter sur WhatsApp</span>
              </a>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.main, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Plateforme</p>
              {[
                { label: 'Creer un compte',   href: '/signup' },
                { label: 'Se connecter',      href: '/login' },
                { label: 'Comment ca marche', href: '#comment' },
                { label: 'Tarifs',            href: '#tarifs' }
              ].map(link => (
                <a key={link.label} href={link.href} style={{ display: 'block', fontSize: '13px', color: C.light, textDecoration: 'none', marginBottom: '12px' }}>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.main, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</p>
              {[
                { label: 'WhatsApp', href: 'https://wa.me/261345159568' },
                { label: 'Facebook', href: '#' }
              ].map(link => (
                <a key={link.label} href={link.href} rel="noreferrer" target="_blank" style={{ display: 'block', fontSize: '13px', color: C.light, textDecoration: 'none', marginBottom: '12px' }}>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #4A5A32', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>powered by keyros.</p>
            <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Madagascar</p>
          </div>
        </div>
      </footer>

    </div>
  );
}