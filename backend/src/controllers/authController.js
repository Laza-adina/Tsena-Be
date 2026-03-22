// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/supabase");

const toSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      shopSlug: user.shop_slug,
      role: "vendeur",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

exports.signup = async (req, res) => {
  try {
    const { email, password, shopName, whatsapp } = req.body;

    if (!email || !password || !shopName)
      return res
        .status(400)
        .json({ error: "Email, mot de passe et nom de boutique requis." });
    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Mot de passe minimum 6 caractères." });

    const { data: exists } = await db
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (exists)
      return res.status(409).json({ error: "Cet email est déjà utilisé." });

    let slug = toSlug(shopName);
    const { data: slugExists } = await db
      .from("users")
      .select("id")
      .eq("shop_slug", slug)
      .maybeSingle();
    if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

    const hashed = await bcrypt.hash(password, 10);

  

const trialExpires = new Date();
trialExpires.setDate(trialExpires.getDate() + 7);

const { data: user, error } = await db
  .from('users')
  .insert([{
    email,
    password: hashed,
    shop_name: shopName,
    shop_slug: slug,
    whatsapp: whatsapp || null,
    plan: 'trial',
    plan_expires_at: trialExpires.toISOString(),
    is_verified: true,
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
    // Ne pas retourner de token, l'utilisateur doit d'abord vérifier son email
    return res.status(201).json({
      message:
        "Compte créé avec succès ! Un lien de vérification a été envoyé à votre adresse email. Veuillez vérifier votre email pour activer votre compte.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe requis." });

    const { data: user } = await db
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (!user)
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect." });
    if (!user.is_active)
      return res
        .status(403)
        .json({ error: "Compte désactivé. Contactez le support." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect." });

    return res.json({
      message: "Connexion réussie !",
      token: generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        shopName: user.shop_name,
        shopSlug: user.shop_slug,
        shopUrl: `${process.env.FRONTEND_URL}/${user.shop_slug}`,
        plan: user.plan,
        planExpiresAt: user.plan_expires_at,
        whatsapp: user.whatsapp,
        facebookUrl: user.facebook_url,
        profileImageUrl: user.profile_image_url,
        description: user.description,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { data: user } = await db
      .from("users")
      .select(
        "id, email, shop_name, shop_slug, description, profile_image_url, cover_image_url, whatsapp, facebook_url, plan, plan_expires_at, theme, display_currency",
      )
      .eq("id", req.user.id)
      .single();

    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable." });
    res.json({ user });
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { shopName, description, whatsapp, facebookUrl, profileImageUrl } =
      req.body;
    const updates = {};
    if (shopName) updates.shop_name = shopName;
    if (description !== undefined) updates.description = description;
    if (whatsapp !== undefined) updates.whatsapp = whatsapp;
    if (facebookUrl !== undefined) updates.facebook_url = facebookUrl;
    if (profileImageUrl !== undefined)
      updates.profile_image_url = profileImageUrl;
    if (req.body.theme !== undefined) updates.theme = req.body.theme;
    if (req.body.coverImageUrl !== undefined)
      updates.cover_image_url = req.body.coverImageUrl;
    if (req.body.displayCurrency !== undefined)
      updates.display_currency = req.body.displayCurrency;

    const { data: user, error } = await db
      .from("users")
      .update(updates)
      .eq("id", req.user.id)
      .select(
        "id, email, shop_name, shop_slug, description, profile_image_url, whatsapp, facebook_url, plan",
      )
      .single();

    if (error) throw error;
    res.json({ message: "Profil mis à jour.", user });
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token manquant." });

    const { data: user, error } = await db
      .from("users")
      .select("id")
      .eq("verify_token", token)
      .maybeSingle();

    if (error) throw error;
    if (!user)
      return res.status(400).json({ error: "Token invalide ou déjà utilisé." });

    const { error: updateError } = await db
      .from("users")
      .update({ is_verified: true, verify_token: null })
      .eq("id", user.id);

    if (updateError) throw updateError;
    return res.json({ message: "Email vérifié avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis." });

    const { data: user } = await db
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();
    if (!user) return res.status(404).json({ error: "Compte introuvable." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await db
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expires: resetExpires.toISOString(),
      })
      .eq("id", user.id);

    const resetUrl = `${process.env.FRONTEND_URL}/login/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      text: `Réinitialisez votre mot de passe ici: ${resetUrl}`,
      html: `<p>Cliquez <a href="${resetUrl}">ici</a> pour réinitialiser votre mot de passe. Ce lien expire dans 1 heure.</p>`,
    });

    res.json({ message: "Email de réinitialisation envoyé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res
        .status(400)
        .json({ error: "Token et nouveau mot de passe requis." });
    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ error: "Mot de passe minimum 6 caractères." });

    const { data: user } = await db
      .from("users")
      .select("id, reset_token_expires")
      .eq("reset_token", token)
      .maybeSingle();

    if (!user) return res.status(400).json({ error: "Token invalide." });

    if (new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ error: "Token expiré." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db
      .from("users")
      .update({
        password: hashed,
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    res.json({ message: "Mot de passe réinitialisé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
