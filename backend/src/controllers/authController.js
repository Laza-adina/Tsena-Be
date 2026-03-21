// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/supabase');

const toSlug = (text) =>
  text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, shopSlug: user.shop_slug, role: 'vendeur' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

exports.signup = async (req, res) => {
  try {
    const { email, password, shopName, whatsapp } = req.body;

    if (!email || !password || !shopName)
      return res.status(400).json({ error: 'Email, mot de passe et nom de boutique requis.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Mot de passe minimum 6 caractères.' });

    const { data: exists } = await db.from('users').select('id').eq('email', email).maybeSingle();
    if (exists) return res.status(409).json({ error: 'Cet email est déjà utilisé.' });

    let slug = toSlug(shopName);
    const { data: slugExists } = await db.from('users').select('id').eq('shop_slug', slug).maybeSingle();
    if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

    const hashed = await bcrypt.hash(password, 10);

    const trialExpires = new Date();
    trialExpires.setDate(trialExpires.getDate() + 7);

    const { data: user, error } = await db
      .from('users')
      .insert([{
        email, password: hashed,
        shop_name: shopName, shop_slug: slug,
        whatsapp: whatsapp || null,
        plan: 'trial',
        plan_expires_at: trialExpires.toISOString()
      }])
      .select('id, email, shop_name, shop_slug, plan, plan_expires_at')
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: 'Compte créé !',
      token: generateToken(user),
      user: {
        id: user.id, email: user.email,
        shopName: user.shop_name, shopSlug: user.shop_slug,
        shopUrl: `${process.env.FRONTEND_URL}/${user.shop_slug}`,
        plan: user.plan, planExpiresAt: user.plan_expires_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });

    const { data: user } = await db.from('users').select('*').eq('email', email).maybeSingle();
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    if (!user.is_active) return res.status(403).json({ error: 'Compte désactivé. Contactez le support.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    return res.json({
      message: 'Connexion réussie !',
      token: generateToken(user),
      user: {
        id: user.id, email: user.email,
        shopName: user.shop_name, shopSlug: user.shop_slug,
        shopUrl: `${process.env.FRONTEND_URL}/${user.shop_slug}`,
        plan: user.plan, planExpiresAt: user.plan_expires_at,
        whatsapp: user.whatsapp, facebookUrl: user.facebook_url,
        profileImageUrl: user.profile_image_url, description: user.description
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { data: user } = await db
      .from('users')
      .select('id, email, shop_name, shop_slug, description, profile_image_url, cover_image_url, whatsapp, facebook_url, plan, plan_expires_at, theme')

      .eq('id', req.user.id).single();
      

    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { shopName, description, whatsapp, facebookUrl, profileImageUrl } = req.body;
    const updates = {};
    if (shopName)                  updates.shop_name = shopName;
    if (description !== undefined) updates.description = description;
    if (whatsapp !== undefined)    updates.whatsapp = whatsapp;
    if (facebookUrl !== undefined) updates.facebook_url = facebookUrl;
    if (profileImageUrl !== undefined) updates.profile_image_url = profileImageUrl;
    if (req.body.theme !== undefined) updates.theme = req.body.theme;
    if (req.body.coverImageUrl !== undefined) updates.cover_image_url = req.body.coverImageUrl;

    const { data: user, error } = await db
      .from('users').update(updates).eq('id', req.user.id)
      .select('id, email, shop_name, shop_slug, description, profile_image_url, whatsapp, facebook_url, plan')
      .single();

    if (error) throw error;
    res.json({ message: 'Profil mis à jour.', user });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};