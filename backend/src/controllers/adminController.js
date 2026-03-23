// src/controllers/adminController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/supabase');

const toSlug = (name) =>
  name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-');

// ─── POST /api/admin/login ─────────────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: admin } = await db.from('admins').select('*').eq('email', email).maybeSingle();
    if (!admin) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (err) {
    console.error('ADMIN LOGIN ERROR:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── POST /api/admin/setup ─────────────────────────────────
// Créer le premier compte admin (protégé par ADMIN_SECRET)
exports.setupAdmin = async (req, res) => {
  try {
    const { email, password, name, adminSecret } = req.body;

    if (adminSecret !== process.env.ADMIN_SECRET)
      return res.status(403).json({ error: 'Secret admin incorrect.' });

    const { data: exists } = await db.from('admins').select('id').eq('email', email).maybeSingle();
    if (exists) return res.status(409).json({ error: 'Admin déjà existant.' });

    const hashed = await bcrypt.hash(password, 10);
    const { data: admin, error } = await db
      .from('admins')
      .insert([{ email, password: hashed, name, role: 'superadmin' }])
      .select('id, email, name, role')
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Compte admin créé.', admin });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── GET /api/admin/dashboard ──────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const [
      { count: totalVendors },
      { count: premiumVendors },
      { count: totalProducts },
      { data: recentVendors }
    ] = await Promise.all([
      db.from('users').select('id', { count: 'exact', head: true }),
      db.from('users').select('id', { count: 'exact', head: true }).eq('plan', 'active'),
      db.from('products').select('id', { count: 'exact', head: true }),
      db.from('users')
        .select('id, email, shop_name, shop_slug, plan, is_active, created_at')
        .order('created_at', { ascending: false }).limit(5)
    ]);

    res.json({
      stats: {
        totalVendors:   totalVendors || 0,
        premiumVendors: premiumVendors || 0,
        freeVendors:    (totalVendors || 0) - (premiumVendors || 0),
        totalProducts:  totalProducts || 0
      },
      recentVendors: recentVendors || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── GET /api/admin/vendors ────────────────────────────────
exports.getAllVendors = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, plan } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = db
      .from('users')
      .select('id, email, shop_name, shop_slug, whatsapp, plan, plan_expires_at, is_active, created_at', { count: 'exact' });

    if (search) query = query.or(`email.ilike.%${search}%,shop_name.ilike.%${search}%`);
    if (plan)   query = query.eq('plan', plan);

    const { data: vendors, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;
    res.json({ vendors: vendors || [], total: count || 0, page: parseInt(page) });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── GET /api/admin/vendors/:id ────────────────────────────
exports.getVendorDetail = async (req, res) => {
  try {
    const { data: vendor } = await db
      .from('users')
      .select('id, email, shop_name, shop_slug, description, whatsapp, facebook_url, profile_image_url, plan, plan_expires_at, is_active, created_at')
      .eq('id', req.params.id).maybeSingle();

    if (!vendor) return res.status(404).json({ error: 'Vendeur introuvable.' });

    const { data: products } = await db
      .from('products').select('*').eq('user_id', req.params.id)
      .order('display_order', { ascending: true });

    // Stats 30 derniers jours
    const since = new Date(); since.setDate(since.getDate() - 30);
    const { data: views } = await db
      .from('page_views').select('event_type')
      .eq('user_id', req.params.id).gte('created_at', since.toISOString());

    res.json({
      vendor,
      products: products || [],
      stats: {
        pageViews:      (views || []).filter(v => v.event_type === 'page_view').length,
        whatsappClicks: (views || []).filter(v => v.event_type === 'whatsapp_click').length
      }
    });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── POST /api/admin/vendors ───────────────────────────────
// L'admin crée manuellement un compte vendeur
exports.createVendor = async (req, res) => {
  try {
    const { email, password, shopName, whatsapp, plan } = req.body;

    if (!email || !password || !shopName)
      return res.status(400).json({ error: 'Email, mot de passe et nom de boutique requis.' });

    const { data: exists } = await db.from('users').select('id').eq('email', email).maybeSingle();
    if (exists) return res.status(409).json({ error: 'Cet email est déjà utilisé.' });

    let slug = toSlug(shopName);
    const { data: slugExists } = await db.from('users').select('id').eq('shop_slug', slug).maybeSingle();
    if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

    const hashed = await bcrypt.hash(password, 10);

    let planExpiresAt = null;
    if (plan === 'premium') {
      const d = new Date(); d.setMonth(d.getMonth() + 1);
      planExpiresAt = d.toISOString();
    }

    const { data: vendor, error } = await db
      .from('users')
      .insert([{
        email, password: hashed,
        shop_name: shopName, shop_slug: slug,
        whatsapp: whatsapp || null,
        plan: plan || 'free',
        plan_expires_at: planExpiresAt
      }])
      .select('id, email, shop_name, shop_slug, plan, plan_expires_at, created_at')
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Compte vendeur créé.',
      vendor,
      shopUrl:     `${process.env.FRONTEND_URL}/${slug}`,
      credentials: { email, password }   // À transmettre au vendeur
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── PUT /api/admin/vendors/:id/plan ──────────────────────
exports.updatePlan = async (req, res) => {
  try {
    const { plan, months = 1 } = req.body;

    let planExpiresAt = null;
    if (plan === 'premium') {
      const { data: v } = await db.from('users').select('plan_expires_at').eq('id', req.params.id).single();
      const base = v?.plan_expires_at && new Date(v.plan_expires_at) > new Date()
        ? new Date(v.plan_expires_at) : new Date();
      base.setMonth(base.getMonth() + parseInt(months));
      planExpiresAt = base.toISOString();
    }

    const { data: vendor, error } = await db
      .from('users')
      .update({ plan, plan_expires_at: planExpiresAt })
      .eq('id', req.params.id)
      .select('id, email, shop_name, plan, plan_expires_at')
      .single();

    if (error) throw error;
    res.json({ message: `Plan mis à jour → ${plan}`, vendor });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── PUT /api/admin/vendors/:id/toggle ────────────────────
exports.toggleVendor = async (req, res) => {
  try {
    const { data: v } = await db.from('users').select('is_active').eq('id', req.params.id).single();
    if (!v) return res.status(404).json({ error: 'Vendeur introuvable.' });

    const { data: vendor } = await db
      .from('users').update({ is_active: !v.is_active }).eq('id', req.params.id)
      .select('id, email, shop_name, is_active').single();

    res.json({ message: vendor.is_active ? 'Compte activé.' : 'Compte désactivé.', vendor });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── DELETE /api/admin/vendors/:id ────────────────────────
exports.deleteVendor = async (req, res) => {
  try {
    await db.from('users').delete().eq('id', req.params.id);
    res.json({ message: 'Compte supprimé.' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};