// src/controllers/productsController.js
const db = require('../config/supabase');

// Génère la référence produit automatiquement si non fournie
// ex: "REF-0042"
const autoRef = (index) => `REF-${String(index).padStart(4, '0')}`;

// Construit le lien WhatsApp avec message pré-rempli en malgache
// "Salama, mbola misy ve ilay produit REF-001 ?"
const buildWhatsappLink = (whatsapp, productRef, productName) => {
  const msg = encodeURIComponent(
    `Salama e!!!, mbola misy ve ilay produit *${productRef}* - ${productName} ?`
  );
  return `https://wa.me/${whatsapp}?text=${msg}`;
};

// ─── GET /api/products ─────────────────────────────────────
exports.getMyProducts = async (req, res) => {
  try {
    const { search } = req.query;

    let query = db
      .from('products')
      .select('*')
      .eq('user_id', req.user.id)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,reference.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error } = await query;
    if (error) throw error;
    res.json({ products });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits.' });
  }
};

// ─── POST /api/products ────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, reference, displayOrder, isFeatured, isPromo, promoPrice, promoStartDate, promoEndDate } = req.body;

    if (!name) return res.status(400).json({ error: 'Le nom du produit est requis.' });
    if (price === undefined || price === null)
      return res.status(400).json({ error: 'Le prix est requis.' });

    // Vérifier limite plan gratuit (5 produits max)
    const { data: vendor } = await db.from('users').select('plan').eq('id', req.user.id).single();

    // if (vendor?.plan === 'free') {
    //   const { count } = await db
    //     .from('products')
    //     .select('id', { count: 'exact', head: true })
    //     .eq('user_id', req.user.id);

    //   if (count >= 5) {
    //     return res.status(403).json({
    //       error: 'Limite du plan gratuit atteinte (5 produits max). Passez en Premium pour un catalogue illimité.',
    //       upgradeRequired: true
    //     });
    //   }
    // }

    // Générer une référence auto si non fournie
    const { count: total } = await db
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    const finalRef = reference?.trim() || autoRef((total || 0) + 1);

    // Vérifier unicité de la référence pour ce vendeur
    const { data: refExists } = await db
      .from('products')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('reference', finalRef)
      .maybeSingle();

    if (refExists)
      return res.status(409).json({ error: `La référence "${finalRef}" existe déjà dans votre boutique.` });

    // Valider dates promo
    if (isPromo && promoStartDate && promoEndDate) {
      const start = new Date(promoStartDate);
      const end = new Date(promoEndDate);
      if (start > end) {
        return res.status(400).json({ error: 'La date de fin de promo doit être après la date de début.' });
      }
    }

    const { data: product, error } = await db
      .from('products')
      .insert([{
        user_id:       req.user.id,
        reference:     finalRef,
        name,
        description:   description || null,
        price:         parseInt(price),
        image_url:     imageUrl || null,
        is_available:  true,
        display_order: displayOrder || 0,
        is_featured:   isPromo || isFeatured || false,
        is_promo:      isPromo || false,
        promo_price:   promoPrice ? parseInt(promoPrice) : null,
        promo_start_date: promoStartDate || null,
        promo_end_date:   promoEndDate || null
      }])
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Produit ajouté !', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du produit.' });
  }
};

// ─── PUT /api/products/:id ─────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, reference, isAvailable, displayOrder, isFeatured, isPromo, promoPrice, promoStartDate, promoEndDate } = req.body;

    // Vérifier ownership
    const { data: existing } = await db
      .from('products').select('id, user_id, reference').eq('id', id).maybeSingle();

    if (!existing || existing.user_id !== req.user.id)
      return res.status(404).json({ error: 'Produit introuvable.' });

    // Si la référence change, vérifier unicité
    if (reference && reference !== existing.reference) {
      const { data: refExists } = await db
        .from('products').select('id')
        .eq('user_id', req.user.id).eq('reference', reference).maybeSingle();
      if (refExists)
        return res.status(409).json({ error: `La référence "${reference}" existe déjà.` });
    }

    // Valider dates promo
    if (isPromo && promoStartDate && promoEndDate) {
      const start = new Date(promoStartDate);
      const end = new Date(promoEndDate);
      if (start > end) {
        return res.status(400).json({ error: 'La date de fin de promo doit être après la date de début.' });
      }
    }

    const updates = {};
    if (name !== undefined)         updates.name = name;
    if (description !== undefined)  updates.description = description;
    if (price !== undefined)        updates.price = parseInt(price);
    if (imageUrl !== undefined)     updates.image_url = imageUrl;
    if (reference !== undefined)    updates.reference = reference;
    if (isAvailable !== undefined)  updates.is_available = isAvailable;
    if (displayOrder !== undefined) updates.display_order = displayOrder;
    if (isPromo !== undefined)      updates.is_promo = isPromo;
    if (promoPrice !== undefined)   updates.promo_price = promoPrice ? parseInt(promoPrice) : null;
    if (promoStartDate !== undefined) updates.promo_start_date = promoStartDate;
    if (promoEndDate !== undefined)   updates.promo_end_date = promoEndDate;

    // Si isPromo est true, forcer is_featured à true
    // Sinon, utiliser la valeur isFeatured si elle est définie
    if (isPromo !== undefined) {
      updates.is_featured = isPromo ? true : (isFeatured !== undefined ? isFeatured : undefined);
    } else if (isFeatured !== undefined) {
      updates.is_featured = isFeatured;
    }

    const { data: product, error } = await db
      .from('products').update(updates).eq('id', id).select('*').single();

    if (error) throw error;
    res.json({ message: 'Produit mis à jour.', product });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
};

// ─── DELETE /api/products/:id ──────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existing } = await db
      .from('products').select('id, user_id').eq('id', id).maybeSingle();

    if (!existing || existing.user_id !== req.user.id)
      return res.status(404).json({ error: 'Produit introuvable.' });

    await db.from('products').delete().eq('id', id);
    res.json({ message: 'Produit supprimé.' });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
};

// ─── GET /api/public/:slug ─────────────────────────────────
// Page publique de la boutique — retourne vendeur + produits + liens WhatsApp
exports.getPublicShop = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: vendor } = await db
    .from('users')
    .select('id, shop_name, shop_slug, description, profile_image_url, cover_image_url, whatsapp, facebook_url, plan, theme, display_currency')
    .eq('shop_slug', slug)
    .eq('is_active', true)
    .maybeSingle();

    if (!vendor) return res.status(404).json({ error: 'Boutique introuvable.' });

    const { search } = req.query;
    const now = new Date();

    // Récupérer les produits mis en avant (featured)
    let featuredQuery = db
      .from('products')
      .select('id, reference, name, description, price, image_url, display_order, is_featured, is_promo, promo_price, promo_start_date, promo_end_date')
      .eq('user_id', vendor.id)
      .eq('is_available', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true });

    const { data: featuredProducts } = await featuredQuery;

    // Récupérer les produits normaux
    let productsQuery = db
      .from('products')
      .select('id, reference, name, description, price, image_url, display_order, is_featured, is_promo, promo_price, promo_start_date, promo_end_date')
      .eq('user_id', vendor.id)
      .eq('is_available', true)
      .order('display_order', { ascending: true });

    if (search) {
      productsQuery = productsQuery.or(`name.ilike.%${search}%,reference.ilike.%${search}%`);
    }

    const { data: products } = await productsQuery;

    // Fonction pour vérifier si promo est active
    const isPromoActive = (p) => {
      if (!p.is_promo) return false;
      if (!p.promo_start_date || !p.promo_end_date) return false;
      const start = new Date(p.promo_start_date);
      const end = new Date(p.promo_end_date);
      return now >= start && now <= end;
    };

    // Ajouter le lien WhatsApp pré-rempli et le statut promo
    const productsWithLinks = (products || []).map(p => ({
      ...p,
      isPromoActive: isPromoActive(p),
      whatsappLink: vendor.whatsapp
        ? buildWhatsappLink(vendor.whatsapp, p.reference, p.name)
        : null
    }));

    const featuredWithLinks = (featuredProducts || []).map(p => ({
      ...p,
      isPromoActive: isPromoActive(p),
      whatsappLink: vendor.whatsapp
        ? buildWhatsappLink(vendor.whatsapp, p.reference, p.name)
        : null
    }));

    // Tracker la vue (fire & forget)
    db.from('page_views').insert([{ user_id: vendor.id, event_type: 'page_view' }])
      .then(() => {}).catch(() => {});

      res.json({
        vendor: {
          shopName:        vendor.shop_name,
          shopSlug:        vendor.shop_slug,
          description:     vendor.description,
          profileImageUrl: vendor.profile_image_url,
          coverImageUrl:   vendor.cover_image_url,
          whatsapp:        vendor.whatsapp,
          facebookUrl:     vendor.facebook_url,
          isPremium:       vendor.plan === 'premium',
          theme:           vendor.theme || 'dark_premium',
          displayCurrency: vendor.display_currency || 'MGA'
        },
        featured: featuredWithLinks,
        products: productsWithLinks
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── POST /api/public/:slug/track ─────────────────────────
// Tracker un clic WhatsApp depuis la page publique
exports.trackWhatsapp = async (req, res) => {
  try {
    const { slug } = req.params;
    const { productId } = req.body;

    const { data: vendor } = await db
      .from('users').select('id').eq('shop_slug', slug).maybeSingle();

    if (!vendor) return res.status(404).json({ error: 'Boutique introuvable.' });

    await db.from('page_views').insert([{
      user_id:    vendor.id,
      event_type: 'whatsapp_click',
      product_id: productId || null
    }]);

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── GET /api/stats ────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const { data: views } = await db
      .from('page_views')
      .select('event_type, created_at')
      .eq('user_id', req.user.id)
      .gte('created_at', since.toISOString());

    const { count: productCount } = await db
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    // Données par jour pour les 7 derniers jours
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayViews = (views || []).filter(v => {
        const t = new Date(v.created_at);
        return t >= d && t < nextD;
      });

      days.push({
        jour: i === 0 ? 'Auj' : `J-${i}`,
        date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        vues:  dayViews.filter(v => v.event_type === 'page_view').length,
        clics: dayViews.filter(v => v.event_type === 'whatsapp_click').length
      });
    }

    const totalViews = (views || []).filter(v => v.event_type === 'page_view').length;
    const totalClics = (views || []).filter(v => v.event_type === 'whatsapp_click').length;

    res.json({
      stats: {
        last30Days: {
          pageViews:      totalViews,
          whatsappClicks: totalClics
        },
        productCount: productCount || 0,
        chartData:    days
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};