// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/supabase');

const otpStore = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;

const normalizeWhatsapp = (value = '') => String(value).replace(/\D/g, '');
const isValidWhatsapp = (value) => /^\d{10,15}$/.test(value);

const createOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const setOtp = ({ whatsapp, purpose, code }) => {
  const key = `${purpose}:${whatsapp}`;
  otpStore.set(key, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
};

const verifyOtp = ({ whatsapp, purpose, code }) => {
  const key = `${purpose}:${whatsapp}`;
  const entry = otpStore.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return false;
  }
  if (entry.code !== String(code || '').trim()) return false;
  otpStore.delete(key);
  return true;
};

const createWhatsappVerificationToken = ({ whatsapp, purpose }) =>
  jwt.sign(
    {
      type: 'whatsapp_verification',
      whatsapp,
      purpose,
    },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

const verifyWhatsappVerificationToken = ({ token, whatsapp, purpose }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return (
      decoded?.type === 'whatsapp_verification' &&
      decoded?.purpose === purpose &&
      decoded?.whatsapp === whatsapp
    );
  } catch {
    return false;
  }
};

const sendWhatsappOtpMessage = async ({ whatsapp, code }) => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'fr';

  if (!accessToken || !phoneNumberId || !templateName) {
    return { sent: false, reason: 'not_configured' };
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: whatsapp,
      type: 'template',
      template: {
        name: templateName,
        language: { code: templateLanguage },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: code }],
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(`WhatsApp API error (${response.status}): ${raw}`);
  }

  return { sent: true };
};

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

exports.sendWhatsappCode = async (req, res) => {
  try {
    const purpose = req.body?.purpose || 'signup';
    const whatsapp = normalizeWhatsapp(req.body?.whatsapp);

    if (!['signup', 'change'].includes(purpose)) {
      return res.status(400).json({ error: 'Type de vérification invalide.' });
    }

    if (!isValidWhatsapp(whatsapp)) {
      return res.status(400).json({ error: 'Numéro WhatsApp invalide.' });
    }

    if (purpose === 'signup') {
      const { data: existing } = await db
        .from('users')
        .select('id')
        .eq('whatsapp', whatsapp)
        .maybeSingle();
      if (existing) {
        return res.status(409).json({ error: 'Ce numéro WhatsApp est déjà utilisé.' });
      }
    }

    const code = createOtpCode();
    setOtp({ whatsapp, purpose, code });

    try {
      const sendResult = await sendWhatsappOtpMessage({ whatsapp, code });

      if (sendResult.sent) {
        return res.json({ message: 'Code envoyé sur WhatsApp.' });
      }

      if (process.env.NODE_ENV === 'production') {
        return res.status(503).json({
          error: 'Service WhatsApp non configuré. Contactez le support technique.',
        });
      }

      return res.json({
        message: 'Envoi WhatsApp non configuré en local. Utilisez le code de test ci-dessous.',
        devCode: code,
      });
    } catch (sendErr) {
      console.error(sendErr);

      if (process.env.NODE_ENV === 'production') {
        return res.status(502).json({
          error: 'Impossible d\'envoyer le code WhatsApp pour le moment.',
        });
      }

      return res.json({
        message: 'Échec envoi WhatsApp en local. Utilisez le code de test ci-dessous.',
        devCode: code,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.verifyWhatsappCode = async (req, res) => {
  try {
    const purpose = req.body?.purpose || 'signup';
    const whatsapp = normalizeWhatsapp(req.body?.whatsapp);
    const code = String(req.body?.code || '').trim();

    if (!['signup', 'change'].includes(purpose)) {
      return res.status(400).json({ error: 'Type de vérification invalide.' });
    }

    if (!isValidWhatsapp(whatsapp)) {
      return res.status(400).json({ error: 'Numéro WhatsApp invalide.' });
    }

    if (!code) {
      return res.status(400).json({ error: 'Code de vérification requis.' });
    }

    const isValid = verifyOtp({ whatsapp, purpose, code });
    if (!isValid) {
      return res.status(400).json({ error: 'Code invalide ou expiré.' });
    }

    const verificationToken = createWhatsappVerificationToken({ whatsapp, purpose });
    return res.json({ message: 'Numéro vérifié.', verificationToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.signup = async (req, res) => {
  try {
    const { password, shopName, whatsapp, whatsappVerificationToken } = req.body;
    const normalizedWhatsapp = normalizeWhatsapp(whatsapp);

    if (!password || !shopName || !normalizedWhatsapp)
      return res.status(400).json({ error: 'Numéro WhatsApp, mot de passe et nom de boutique requis.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Mot de passe minimum 6 caractères.' });
    if (!isValidWhatsapp(normalizedWhatsapp))
      return res.status(400).json({ error: 'Numéro WhatsApp invalide.' });
    if (!whatsappVerificationToken)
      return res.status(400).json({ error: 'Vérification WhatsApp requise.' });

    const tokenOk = verifyWhatsappVerificationToken({
      token: whatsappVerificationToken,
      whatsapp: normalizedWhatsapp,
      purpose: 'signup',
    });
    if (!tokenOk) {
      return res.status(400).json({ error: 'Vérification WhatsApp invalide ou expirée.' });
    }

    const { data: existsWhatsapp } = await db
      .from('users')
      .select('id')
      .eq('whatsapp', normalizedWhatsapp)
      .maybeSingle();
    if (existsWhatsapp) return res.status(409).json({ error: 'Ce numéro WhatsApp est déjà utilisé.' });

    let slug = toSlug(shopName);
    const { data: slugExists } = await db.from('users').select('id').eq('shop_slug', slug).maybeSingle();
    if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

    const email = `wa_${normalizedWhatsapp}@tsenabe.local`;

    const hashed = await bcrypt.hash(password, 10);

    const trialExpires = new Date();
    trialExpires.setDate(trialExpires.getDate() + 7);

    const { data: user, error } = await db
      .from('users')
      .insert([{
        email, password: hashed,
        shop_name: shopName, shop_slug: slug,
        whatsapp: normalizedWhatsapp,
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
        whatsapp: normalizedWhatsapp,
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
    const whatsapp = normalizeWhatsapp(req.body?.whatsapp);
    const { password } = req.body;
    if (!whatsapp || !password) return res.status(400).json({ error: 'Numéro WhatsApp et mot de passe requis.' });
    if (!isValidWhatsapp(whatsapp)) return res.status(400).json({ error: 'Numéro WhatsApp invalide.' });

    const { data: user } = await db.from('users').select('*').eq('whatsapp', whatsapp).maybeSingle();
    if (!user) return res.status(401).json({ error: 'Numéro WhatsApp ou mot de passe incorrect.' });
    if (!user.is_active) return res.status(403).json({ error: 'Compte désactivé. Contactez le support.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Numéro WhatsApp ou mot de passe incorrect.' });

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
      .select('id, email, shop_name, shop_slug, description, profile_image_url, cover_image_url, whatsapp, facebook_url, plan, plan_expires_at, theme, display_currency')
      .eq('id', req.user.id).single();
      

    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { shopName, description, whatsapp, facebookUrl, profileImageUrl, whatsappVerificationToken } = req.body;
    const normalizedWhatsapp = whatsapp !== undefined ? normalizeWhatsapp(whatsapp) : undefined;

    const { data: currentUser } = await db
      .from('users')
      .select('id, whatsapp')
      .eq('id', req.user.id)
      .single();

    if (!currentUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    const whatsappChanged =
      normalizedWhatsapp !== undefined &&
      normalizedWhatsapp !== normalizeWhatsapp(currentUser.whatsapp || '');

    if (whatsappChanged) {
      if (!isValidWhatsapp(normalizedWhatsapp)) {
        return res.status(400).json({ error: 'Numéro WhatsApp invalide.' });
      }
      if (!whatsappVerificationToken) {
        return res.status(400).json({ error: 'Veuillez vérifier le nouveau numéro WhatsApp avant de sauvegarder.' });
      }
      const tokenOk = verifyWhatsappVerificationToken({
        token: whatsappVerificationToken,
        whatsapp: normalizedWhatsapp,
        purpose: 'change',
      });
      if (!tokenOk) {
        return res.status(400).json({ error: 'Vérification WhatsApp invalide ou expirée.' });
      }

      const { data: existingWhatsapp } = await db
        .from('users')
        .select('id')
        .eq('whatsapp', normalizedWhatsapp)
        .neq('id', req.user.id)
        .maybeSingle();
      if (existingWhatsapp) {
        return res.status(409).json({ error: 'Ce numéro WhatsApp est déjà utilisé.' });
      }
    }

    const updates = {};
    if (shopName)                  updates.shop_name = shopName;
    if (description !== undefined) updates.description = description;
    if (normalizedWhatsapp !== undefined) updates.whatsapp = normalizedWhatsapp;
    if (facebookUrl !== undefined) updates.facebook_url = facebookUrl;
    if (profileImageUrl !== undefined) updates.profile_image_url = profileImageUrl;
    if (req.body.theme !== undefined) updates.theme = req.body.theme;
    if (req.body.coverImageUrl !== undefined) updates.cover_image_url = req.body.coverImageUrl;
    if (req.body.displayCurrency !== undefined) updates.display_currency = req.body.displayCurrency;

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