'use client';

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

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: C.cream, color: C.text, minHeight: '100vh' }}>

      {/* NAVBAR */}
     <nav style={{ background: C.cream, borderBottom:`1px solid ${C.light}`, padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
     <span style={{ fontSize: '18px', fontWeight: '700', color: C.dark, letterSpacing: '-0.5px' }}>
  Tsen<span style={{ color: '#ccd5ae' }}>@</span>be
</span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#comment" style={{ fontSize: '14px', color: C.dark, textDecoration: 'none' }}>
            <span>Comment ca marche</span>
          </a>
          <a href="#tarifs" style={{ fontSize: '14px', color: C.dark, textDecoration: 'none' }}>
            <span>Tarifs</span>
          </a>
          <button
            onClick={() => router.push('/login')}
            style={{ fontSize: '13px', color: C.dark, background: 'none', border: `1px solid ${C.dark}`, borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}
          >
            <span>Se connecter</span>
          </button>
          <button
            onClick={() => router.push('/signup')}
            style={{ fontSize: '13px', color: C.cream, background: C.dark, border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: '600' }}
          >
            <span>Commencer gratuitement</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
   <section style={{ background: C.cream, padding:'120px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: C.light, color: C.dark, fontSize: '11px', fontWeight: '700', padding: '5px 16px', borderRadius: '20px', marginBottom: '28px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Pour les vendeurs malgaches
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '700', color: C.dark, margin: '0 0 20px', lineHeight: '1.15', letterSpacing: '-1.5px' }}>
            Votre boutique en ligne en 5 minutes
          </h1>
          <p style={{ fontSize: '18px', color: C.muted, margin: '0 0 48px', lineHeight: '1.8' }}>
            Creez votre mini-boutique, partagez vos produits sur Facebook et recevez les commandes directement sur WhatsApp. Simple, rapide, adapte a Madagascar.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/signup')}
              style={{ fontSize: '15px', fontWeight: '700', color: C.cream, background: C.dark, border: 'none', borderRadius: '8px', padding: '15px 36px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}
            >
              <span>Essayer gratuitement 7 jours</span>
            </button>
            <button
              onClick={() => router.push('/login')}
              style={{ fontSize: '15px', color: C.dark, background: 'none', border: `1px solid ${C.dark}`, borderRadius: '8px', padding: '15px 36px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}
            >
              <span>Se connecter</span>
            </button>
          </div>
          <p style={{ fontSize: '13px', color: C.muted, marginTop: '20px' }}>
            Aucune carte bancaire requise. Essai gratuit de 7 jours.
          </p>
        </div>
      </section>

      {/* SEPARATEUR */}
      <div style={{ height: '1px', background: C.light, margin: '0 40px' }} />

      {/* COMMENT CA MARCHE */}
      <section id="comment" style={{ padding: '100px 40px', background: C.main }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '700', color: C.dark, textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Comment ca marche
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, textAlign: 'center', margin: '0 0 64px' }}>
            Trois etapes pour avoir votre boutique en ligne.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', background: C.light, borderRadius: '16px', overflow: 'hidden' }}>
            {[
              { num: '01', title: 'Creez votre compte', desc: 'Inscrivez-vous avec votre email, choisissez un nom de boutique et ajoutez votre numero WhatsApp.' },
              { num: '02', title: 'Ajoutez vos produits', desc: 'Uploadez les photos de vos articles, ajoutez les prix et une reference. Votre catalogue est pret.' },
              { num: '03', title: 'Partagez votre lien', desc: 'Copiez votre lien unique et partagez-le sur Facebook, WhatsApp ou imprimez votre QR code.' }
            ].map(step => (
              <div key={step.num} style={{ background: C.main, padding: '40px 32px' }}>
                <p style={{ fontSize: '40px', fontWeight: '700', color: C.light, margin: '0 0 20px', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                  {step.num}
                </p>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: C.dark, margin: '0 0 12px' }}>
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

      {/* SEPARATEUR */}
      <div style={{ height: '1px', background: C.light, margin: '0 40px' }} />

      {/* TARIFS */}
      <section id="tarifs" style={{ padding: '100px 40px',background: C.cream }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '700', color: C.dark, textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Tarifs simples
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, textAlign: 'center', margin: '0 0 64px' }}>
            Commencez gratuitement. Payez uniquement quand vous etes pret.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>

            {/* Essai */}
            <div style={{ background: C.light, borderRadius: '16px', padding: '36px 28px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.muted, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Essai gratuit
              </p>
              <p style={{ fontSize: '40px', fontWeight: '700', color: C.dark, margin: '0 0 4px', lineHeight: 1 }}>
                0 Ar
              </p>
              <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 28px' }}>
                pendant 7 jours
              </p>
              <div style={{ marginBottom: '28px' }}>
                {["Catalogue jusqu'a 5 produits", 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques de clics'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.muted, flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{f}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/signup')} style={{ width: '100%', padding: '12px', background: 'none', border: `1.5px solid ${C.dark}`, borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: C.dark, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                <span>Commencer</span>
              </button>
            </div>

            {/* Mensuel */}
            <div style={{ background: C.beige, borderRadius: '16px', padding: '36px 28px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.muted, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Mensuel
              </p>
              <p style={{ fontSize: '40px', fontWeight: '700', color: C.dark, margin: '0 0 4px', lineHeight: 1 }}>
                10 000 Ar
              </p>
              <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 28px' }}>
                par mois
              </p>
              <div style={{ marginBottom: '28px' }}>
                {['Catalogue illimite', 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques de clics'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.caramel, flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{f}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/signup')} style={{ width: '100%', padding: '12px', background: C.caramel, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: '#fff', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                <span>Commencer</span>
              </button>
            </div>

            {/* Annuel */}
            <div style={{ background: C.dark, borderRadius: '16px', padding: '36px 28px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.main, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Annuel
              </p>
              <p style={{ fontSize: '40px', fontWeight: '700', color: C.cream, margin: '0 0 4px', lineHeight: 1 }}>
                100 000 Ar
              </p>
              <p style={{ fontSize: '13px', color: C.main, margin: '0 0 28px' }}>
                par an — 2 mois offerts
              </p>
              <div style={{ marginBottom: '28px' }}>
                {['Catalogue illimite', 'Bouton WhatsApp', 'Lien unique', 'QR Code', 'Statistiques de clics'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
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
          <p style={{ textAlign: 'center', fontSize: '13px', color: C.muted, marginTop: '28px' }}>
            Paiement via MVola, Orange Money ou Airtel Money. Activation manuelle sous 24h.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.dark, padding: '60px 40px 40px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
            <div>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.cream, margin: '0 0 12px' }}>Keyros</p>
              <p style={{ fontSize: '14px', color: C.main, lineHeight: '1.8', margin: '0 0 20px' }}>
                La plateforme de mini-boutiques pour les vendeurs malgaches. Simple, rapide, adapte a votre quotidien.
              </p>
              <a href="https://wa.me/261340000000" rel="noreferrer" target="_blank" style={{ fontSize: '13px', color: C.caramel, textDecoration: 'none' }}>
                <span>Nous contacter sur WhatsApp</span>
              </a>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.main, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Plateforme
              </p>
              {[
                { label: 'Creer un compte',     href: '/signup' },
                { label: 'Se connecter',        href: '/login' },
                { label: 'Comment ca marche',   href: '#comment' },
                { label: 'Tarifs',              href: '#tarifs' }
              ].map(link => (
                <a key={link.label} href={link.href} style={{ display: 'block', fontSize: '13px', color: C.light, textDecoration: 'none', marginBottom: '12px' }}>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: C.main, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Contact
              </p>
              {[
                { label: 'WhatsApp', href: 'https://wa.me/261340000000' },
                { label: 'Facebook', href: '#' }
              ].map(link => (
                <a key={link.label} href={link.href} rel="noreferrer" target="_blank" style={{ display: 'block', fontSize: '13px', color: C.light, textDecoration: 'none', marginBottom: '12px' }}>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid #4A5A32`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Keyros 2024. Tous droits reserves.</p>
            <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Fait a Madagascar</p>
          </div>
        </div>
      </footer>

    </div>
  );
}