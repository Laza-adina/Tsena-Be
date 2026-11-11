'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./home.module.css";
import { ArrowUpRight, ArrowRight, Check, ShoppingBag, MessageCircle, Link2, QrCode, Smartphone, Package, LayoutGrid, Palette, Share2, ChevronDown } from "lucide-react";

const C = {
  main:    '#EAF3F2',   // gris clair — sections alternées
  light:   '#D4E5E4',   // gris très clair — bordures
  cream:   '#F8FCFB',   // blanc pur — fond dominant
  beige:   '#EAF3F2',   // blanc cassé — carte mensuelle
  caramel: '#336F72',   // bleu-pétrole — accents
  dark:    '#142A2B',   // charbon — texte principal
  text:    '#142A2B',
  muted:   '#536B6C',   // bleu marine — textes secondaires

  // alias footer (texte lisible sur fond sombre)
  footerText:   '#DFECEA',
  footerBorder: '#484848',
  footerMuted:  '#9BB7B5',
};

export default function LandingPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [ranking, setRanking] = useState({ status: 'loading', shops: [] });

  useEffect(() => {
    const controller = new AbortController();
    let apiBase = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3002/api' : 'https://tsena-be-production.up.railway.app/api');
    // The frontend preview uses port 3001, which was also the old backend default.
    try {
      const url = new URL(apiBase, window.location.origin);
      if (process.env.NODE_ENV === 'development' && url.origin === window.location.origin) apiBase = 'http://localhost:3002/api';
    } catch { /* fetch reports an invalid URL below */ }
    fetch(`${apiBase.replace(/\/$/, '')}/ranking/shops`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Classement indisponible'); return response.json(); })
      .then(data => { if (!Array.isArray(data.shops)) throw new Error('Classement invalide'); setRanking({ status: 'ready', shops: data.shops }); })
      .catch(error => { if (error.name !== 'AbortError') setRanking({ status: 'error', shops: [] }); });
    return () => controller.abort();
  }, []);
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
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          letter-spacing: -1px;
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
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(53,53,53,0.18); }
        .btn-secondary {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .btn-secondary:hover { background: rgba(53,53,53,0.06) !important; }

        .plan-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .plan-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(53,53,53,0.10); }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #142A2B;
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
          background: #28676B;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .footer-link {
          display: block;
          font-size: 13px;
          color: #DFECEA;
          text-decoration: none;
          margin-bottom: 14px;
          font-weight: 300;
          opacity: 0.85;
          transition: opacity 0.2s;
        }
        .footer-link:hover { opacity: 1; }

        @media (max-width: 768px) {
          .hero-title   { font-size: 36px !important; letter-spacing: -1px !important; }
          .hero-section { padding: 80px 20px 70px !important; }
          .section-pad  { padding: 60px 20px !important; }
          .steps-grid   { grid-template-columns: 1fr !important; }
          .plans-grid   { grid-template-columns: 1fr !important; gap: 12px; }
          .footer-grid  { grid-template-columns: 1fr !important; gap: 32px; }
          .nav-links    { display: none !important; }
          .hamburger    { display: flex !important; }
          .mobile-menu  { display: block; }
          .nav-inner    { padding: 0 20px !important; }
          .footer-outer { padding: 48px 20px 32px !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        style={{
          background: C.cream,
          borderBottom: `1px solid ${C.light}`,
          height: "60px",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "0 40px",
          }}
          className="nav-inner"
        >
          <span
            className="brand-name"
            style={{ fontSize: "22px", color: C.dark }}
          >
            Tsen
            <span>
              <Image
                src="/logo.png"
                alt="@"
                width={25}
                height={25}
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  margin: "0 0 5px 0",
                }}
              />
            </span>
            be
          </span>
          <div className="nav-links">
            <a href="#comment" className="nav-link">Comment ça marche</a>
            <a href="#tarifs" className="nav-link">Tarifs</a>
            <button className="btn-secondary" onClick={() => router.push('/login')} style={{ fontSize: '13px', color: C.dark, background: 'none', border: `1px solid ${C.dark}`, borderRadius: '6px', padding: '7px 18px', cursor: 'pointer' }}>
              Se connecter
            </button>
            <button className="btn-primary" onClick={() => router.push('/signup')} style={{ fontSize: '13px', color: C.cream, background: '#28676B', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' }}>
              Commencer gratuitement
            </button>
          </div>
          <button className="hamburger" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <div style={{ width: '22px', height: '2px', background: C.dark, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <div style={{ width: '22px', height: '2px', background: C.dark, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
            <div style={{ width: '22px', height: '2px', background: C.dark, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-navigation" className="mobile-menu" style={{ background: C.cream, borderBottom: `1px solid ${C.light}`, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '60px', zIndex: 99 }}>
          <a href="#comment" onClick={() => setMenuOpen(false)} className="nav-link">Comment ça marche</a>
          <a href="#tarifs"  onClick={() => setMenuOpen(false)} className="nav-link">Tarifs</a>
          <button className="btn-secondary" onClick={() => router.push('/login')} style={{ padding: '10px', background: 'none', border: `1px solid ${C.dark}`, borderRadius: '6px', fontSize: '14px', color: C.dark, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Se connecter
          </button>
          <button className="btn-primary" onClick={() => router.push('/signup')} style={{ padding: '10px', background: '#28676B', border: 'none', borderRadius: '8px', fontSize: '14px', color: C.cream, cursor: 'pointer' }}>
            Commencer gratuitement
          </button>
        </div>
      )}

      <main className={styles.home}>
        <section className={styles.hero}>
          <div className={styles.heroHeading}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span /> VOTRE COMMERCE, PARTOUT À MADAGASCAR</p>
              <h1>Votre boutique en ligne<br /><span>en 5 minutes.</span></h1>
              <p className={styles.intro}>Créez votre boutique en ligne, partagez vos produits sur Facebook et recevez vos commandes directement sur WhatsApp.</p>
              <div className={styles.heroActions}><a href="/signup" className={styles.primaryButton}>Créer ma boutique <ArrowUpRight size={19} /></a><a href="#apercu" className={styles.secondaryButton}>Voir les boutiques <ArrowRight size={18} /></a></div>
              <div className={styles.heroSteps} aria-label="Trois étapes pour créer votre boutique"><span><b>01</b> Créez votre compte</span><span><b>02</b> Ajoutez vos produits</span><span><b>03</b> Partagez votre lien</span></div>
              <div className={styles.reassurance}><span><Check size={14} /> 7 jours offerts</span><span><Check size={14} /> Sans carte bancaire</span></div>
            </div>
            <div className={styles.phoneStage} aria-label="Exemples de boutiques sur téléphone">
              <div className={styles.orbit} aria-hidden="true" />
              {[
                { name: 'MAISON LOVA', kind: 'Artisanat & déco', color: 'sand', image: 'photo-1578749556568-bc2c40e68b61', products: ['photo-1578749556568-bc2c40e68b61', 'photo-1544816155-12df9643f363'], names: ['Tasse artisanale', 'Sac quotidien'], prices: ['28 000 Ar', '45 000 Ar'] },
                { name: 'TOKY MODE', kind: 'Vos essentiels du quotidien', color: 'light', image: 'photo-1441986300917-64674bd600d8', products: ['photo-1521572163474-6864f9cf17ab', 'photo-1544816155-12df9643f363'], names: ['T-shirt coton', 'Sac quotidien'], prices: ['35 000 Ar', '45 000 Ar'] },
                { name: 'BON GOÛT', kind: 'À commander sur WhatsApp', color: 'dark', image: 'photo-1550547660-d9450f859349', products: ['photo-1568901346375-23c9450c58cd', 'photo-1513104890138-7c749659a591'], names: ['Burger maison', 'Pizza maison'], prices: ['12 000 Ar', '22 000 Ar'] },
              ].map((shop, i) => <div className={`${styles.phone} ${styles[shop.color]}`} key={shop.name} aria-hidden="true">
                <div className={styles.phoneScreen}><div className={styles.phoneBanner} style={{backgroundImage:`url(https://images.unsplash.com/${shop.image}?auto=format&fit=crop&w=400&q=75)`}} /><div className={styles.phoneAvatar}>{shop.name.slice(0, 1)}</div><div className={styles.phoneShop}><strong>{shop.name}</strong><span>{shop.kind}</span><small>◉ WhatsApp</small></div><div className={styles.phoneSearch}>⌕ &nbsp; Rechercher un produit...</div><div className={styles.phoneProductsTitle}>PRODUITS <span>2</span></div><div className={styles.phoneProducts}>{shop.products.map((image, j) => <div className={styles.phoneProduct} key={image}><img src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=200&q=75`} alt="" loading={i===1?'eager':'lazy'} /><div><small>RÉF. 00{j+1}</small><strong>{shop.names[j]}</strong><b>{shop.prices[j]}</b><span>◉ Commander</span></div></div>)}</div></div><div className={styles.phoneHome} />
              </div>)}
              <span className={styles.stageCaption}>APERÇUS DE BOUTIQUES · EXEMPLES</span>
            </div>
          </div>
        </section>

        <section id="apercu" className={styles.rankingSection} aria-labelledby="ranking-title">
          <div className={styles.rankingWrap}>
            <div className={styles.rankingHeading}>
              <div><p className={styles.rankingEyebrow}><span /> À DÉCOUVRIR SUR TSEN@BE</p><h2 id="ranking-title">Les boutiques<br /><em>qui font parler d’elles.</em></h2></div>
              <div><p>Découvrez les boutiques les plus visitées sur Tsen@be au cours des 30 derniers jours.</p><span className={styles.rankingPeriod}>CLASSEMENT PAR NOMBRE DE VUES</span></div>
            </div>
            {ranking.status === 'loading' && <p className={styles.rankingMessage} role="status">Chargement du classement des boutiques…</p>}
            {ranking.status === 'error' && <p className={styles.rankingMessage} role="status">Le classement est momentanément indisponible. Revenez un peu plus tard.</p>}
            {ranking.status === 'ready' && ranking.shops.length === 0 && <p className={styles.rankingMessage}>Le classement apparaîtra dès que les boutiques recevront des visites.</p>}
            {ranking.status === 'ready' && ranking.shops.length > 0 && <ol className={styles.rankingGrid}>{ranking.shops.map((shop, index) => <li key={shop.shopSlug}><a className={styles.rankingCard} href={`/${encodeURIComponent(shop.shopSlug)}`}><div className={styles.rankingCover}>{shop.coverImageUrl && <img src={shop.coverImageUrl} alt="" loading="lazy" />}<span className={styles.rankingNumber}>#{String(index + 1).padStart(2, '0')}</span><span className={styles.rankingArrow}><ArrowUpRight size={19} /></span></div><div className={styles.rankingDetails}><span className={styles.rankingAvatar}>{shop.profileImageUrl ? <img src={shop.profileImageUrl} alt="" loading="lazy" /> : (shop.shopName || 'B').slice(0, 1).toUpperCase()}</span><div><h3>{shop.shopName}</h3><p>{shop.description || 'Découvrez cette boutique sur Tsen@be.'}</p></div></div><div className={styles.rankingFooter}><span>{new Intl.NumberFormat('fr-FR').format(shop.views)} {shop.views === 1 ? 'vue' : 'vues'} · 30 jours</span><b>Visiter la boutique <ArrowRight size={14} /></b></div></a></li>)}</ol>}
          </div>
        </section>
        <div className={styles.toolsStrip}><span>Vos clients sont déjà là.<br /><b>Retrouvez-les simplement.</b></span><div><MessageCircle /> WhatsApp</div><div><span className={styles.facebook}>f</span> Facebook</div><div><QrCode /> QR Code</div><div><Smartphone /> Mobile</div></div>

        <section className={styles.features}>
          <div className={styles.wrap}>
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>MOINS DE COMPLICATIONS. PLUS DE POSSIBILITÉS.</p><h2>Tout ce qu’il faut pour vendre.<br /><span>Et le plaisir de faire simple.</span></h2></div>
            <div className={styles.featureGrid}>
              <article className={styles.catalogFeature}><div><span className={styles.iconBox}><LayoutGrid size={22} /></span><h3>Une vraie vitrine.<br />À votre image.</h3><p>Photos, prix et références : rassemblez vos produits dans un catalogue clair, agréable à parcourir et prêt à partager.</p></div><div className={styles.catalogVisual}><div className={styles.miniCard}><img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=350&q=80" width="200" height="200" alt="Sac présenté dans un exemple de catalogue" loading="lazy" /><div><b>Votre prochain coup de cœur</b><span>45 000 Ar</span></div></div><div className={styles.customize}><Palette size={17} /><span>Votre boutique, vos couleurs</span><i /><i /><i /></div></div></article>
              <article className={styles.whatsappFeature}><span className={styles.iconBox}><MessageCircle size={22} /></span><h3>La conversation<br />fait la vente.</h3><p>Votre client choisit un produit et vous contacte sur WhatsApp. Vous gardez le lien, de la première question à la commande.</p><div className={styles.chat}><div>Salama ! Cet article est disponible ?<span>10:24</span></div><div>Oui, avec plaisir ! 😊<span>10:25 <Check size={12} /></span></div></div></article>
              <article className={styles.shareFeature}><div><span className={styles.iconBox}><Share2 size={22} /></span><h3>Un lien. Toutes les opportunités.</h3><p>Dans votre bio Facebook, dans un message ou sur votre QR code : emportez votre boutique partout.</p></div><div className={styles.linkVisual}><Link2 size={20} /><span>tsenabe.app/<b>votre-boutique</b></span><Check size={18} /></div></article>
            </div>
          </div>
        </section>

        <section id="comment" className={styles.how}>
          <div className={styles.wrap}><div className={styles.howHeading}><div><p className={styles.eyebrow}>DE L’IDÉE À LA PREMIÈRE VITRINE</p><h2>Vous avez les produits.<br /><span>On a le point de départ.</span></h2></div><a href="/signup" className={styles.primaryButton}>Je me lance <ArrowUpRight size={18}/></a></div><div className={styles.steps}>{[{title:'Faites les présentations.',text:'Créez votre compte, choisissez un nom de boutique et ajoutez votre numéro WhatsApp.',icon:ShoppingBag},{title:'Installez vos essentiels.',text:'Ajoutez les photos de vos produits, leurs prix et leurs références. Votre catalogue prend vie.',icon:Package},{title:'Ouvrez grand les portes.',text:'Partagez votre lien sur Facebook, WhatsApp ou avec votre QR code. Votre boutique est en ligne.',icon:ArrowUpRight}].map((step,index)=><article className={styles.step} key={step.title}><div><span>0{index+1}</span><step.icon size={23}/></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div>
        </section>

        <section id="tarifs" className={styles.pricing}><div className={styles.wrap}><div className={styles.sectionHeading}><p className={styles.eyebrow}>UN PETIT PRIX. DE GRANDES ENVIES.</p><h2>Votre prochaine étape,<br /><span>à votre rythme.</span></h2><p className={styles.sectionDescription}>Toutes les fonctionnalités. Des formules sans complication.</p><div className={styles.billingToggle} role="group" aria-label="Périodicité de l’abonnement"><button aria-pressed={!annual} onClick={()=>setAnnual(false)}>Mensuel</button><button aria-pressed={annual} onClick={()=>setAnnual(true)}>Annuel <span>2 mois offerts</span></button></div></div><div className={styles.plans}><article className={styles.plan}><span className={styles.planEyebrow}>POUR FAIRE LE PREMIER PAS</span><h3>Découvrez Tsen@be</h3><p className={styles.price}>0 <span>Ar / 7 jours</span></p><p className={styles.planDescription}>Le temps de créer votre boutique et de prendre vos marques.</p><a href="/signup" className={styles.secondaryButton}>Essayer gratuitement <ArrowUpRight size={18}/></a><ul>{['Catalogue illimité','Bouton WhatsApp','Lien unique et QR code','Statistiques de votre boutique'].map(f=><li key={f}><Check size={16}/>{f}</li>)}</ul></article><article className={`${styles.plan} ${styles.highlight}`}><span className={styles.planEyebrow}>POUR FAIRE GRANDIR VOTRE ACTIVITÉ</span><h3>Votre boutique au quotidien</h3><p className={styles.price}>{annual?'100 000':'10 000'} <span>Ar / {annual?'an':'mois'}</span></p><p className={styles.planDescription}>{annual?'Une année pour développer votre activité, avec 2 mois offerts.':'Votre catalogue en ligne, vos clients à portée de message.'}</p><a href="/signup" className={styles.primaryButton}>Créer ma boutique <ArrowUpRight size={18}/></a><ul>{['Catalogue illimité','Bouton WhatsApp','Lien unique et QR code','Statistiques de votre boutique'].map(f=><li key={f}><Check size={16}/>{f}</li>)}</ul></article></div><div className={styles.payNote}><span>Paiement local, tout simplement.</span><b>MVola</b><b>Orange Money</b><b>Airtel Money</b><small>Activation manuelle sous 24h.</small></div></div></section>

        <section className={styles.faq}><div className={styles.wrap}><div><p className={styles.eyebrow}>ON VOUS RÉPOND</p><h2>Encore une<br />petite question ?</h2><a href="https://wa.me/261345159568" target="_blank" rel="noreferrer">Parlons sur WhatsApp <ArrowUpRight size={17}/></a></div><div>{[{q:'Faut-il savoir coder pour créer ma boutique ?',a:'Aucune connaissance technique n’est nécessaire. Créez votre compte, renseignez votre boutique et ajoutez vos produits depuis votre espace vendeur.'},{q:'Comment mes clients passent-ils commande ?',a:'Ils parcourent votre catalogue et utilisent le bouton WhatsApp d’un produit pour vous contacter directement. Vous convenez ensemble du paiement et de la livraison.'},{q:'Puis-je gérer ma boutique depuis mon téléphone ?',a:'Oui. Votre espace vendeur et votre boutique publique sont accessibles depuis le navigateur de votre téléphone.'},{q:'Comment fonctionne l’essai gratuit ?',a:'Vous pouvez découvrir la plateforme pendant 7 jours sans carte bancaire. Choisissez ensuite une formule mensuelle ou annuelle pour continuer.'}].map(item=><details key={item.q}><summary>{item.q}<ChevronDown size={18}/></summary><p>{item.a}</p></details>)}</div></div></section>
        <section className={styles.finalCta}><div className={styles.wrap}><p className={styles.eyebrow}>L’AVENTURE COMMENCE AVEC UN LIEN.</p><h2>Votre prochaine belle idée<br />mérite <span>sa boutique.</span></h2><a href="/signup" className={styles.primaryButton}>Ouvrir ma boutique gratuitement <ArrowUpRight size={18}/></a><p>7 jours offerts. Votre ambition fait le reste.</p></div></section>
      </main>

      {/* FOOTER */}
      <footer className="footer-outer" style={{ background: C.dark, padding: '64px 40px 40px' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ marginBottom: '48px' }}>

            <div>
              <p
                className="brand-name"
                style={{ fontSize: "24px", color: C.cream, margin: "0 0 14px" }}
              >
                Tsen
                <Image
                  src="/logo_light.png"
                  alt="@"
                  width={25}
                  height={25}
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    margin: "0 0 5px 0",
                  }}
                />
                be
              </p>
              <p style={{ fontSize: '14px', color: C.footerText, lineHeight: '1.85', margin: '0 0 24px', fontWeight: '300' }}>
                La plateforme de mini-boutiques pour les vendeurs malgaches. Simple, rapide, adaptée à votre quotidien.
              </p>
              <a href="https://wa.me/261345159568" rel="noreferrer" target="_blank" style={{ fontSize: '13px', color: '#A5D0CC', textDecoration: 'none', fontWeight: '500', borderBottom: '1px solid #f0c94e80', paddingBottom: '1px' }}>
                Nous contacter sur WhatsApp
              </a>
            </div>

            <div>
              <p style={{ fontSize: '10px', fontWeight: '600', color: C.footerText, margin: '0 0 22px', textTransform: 'uppercase', letterSpacing: '2px' }}>Plateforme</p>
              {[
                { label: 'Créer un compte',   href: '/signup' },
                { label: 'Se connecter',      href: '/login' },
                { label: 'Comment ça marche', href: '#comment' },
                { label: 'Tarifs',            href: '#tarifs' },
              ].map(link => (
                <a key={link.label} href={link.href} className="footer-link">{link.label}</a>
              ))}
            </div>

            <div>
              <p style={{ fontSize: '10px', fontWeight: '600', color: C.footerText, margin: '0 0 22px', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact</p>
              {[
                { label: 'WhatsApp', href: 'https://wa.me/261345159568' },
                { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61586337260046' },
              ].map(link => (
                <a key={link.label} href={link.href} rel="noreferrer" target="_blank" className="footer-link">{link.label}</a>
              ))}
            </div>

          </div>

          <div style={{ borderTop: `1px solid ${C.footerBorder}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '12px', color: C.footerMuted, margin: 0, fontWeight: '300' }}>powered by keyros.</p>
            <p style={{ fontSize: '12px', color: C.footerMuted, margin: 0, fontWeight: '300' }}>Madagascar</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
