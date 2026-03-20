// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authVendeur = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non authentifié.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'vendeur') return res.status(403).json({ error: 'Accès refusé.' });

    const db = require('../config/supabase');
    const { data: user, error } = await db
      .from('users')
      .select('is_active, plan, plan_expires_at')
      .eq('id', decoded.id)
      .single();

    if (!user || !user.is_active) {
      return res.status(403).json({ error: 'Compte désactivé.', disabled: true });
    }

    // Bloquer uniquement si plan = 'expired'
    if (user.plan === 'expired') {
      return res.status(403).json({ error: 'Votre abonnement est terminé. Contactez le support.', expired: true });
    }

    // Bloquer si trial expiré
    if (user.plan === 'trial' && user.plan_expires_at && new Date(user.plan_expires_at) < new Date()) {
      return res.status(403).json({ error: 'Votre periode d\'essai est terminée. Contactez le support.', expired: true });
    }

    // monthly et annual — laisser passer même si plan_expires_at est dépassé
    // (c'est l'admin qui gère manuellement)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide ou expiré.' });
  }
};

const authAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non authentifié.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return res.status(403).json({ error: 'Accès admin requis.' });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token invalide ou expiré.' });
  }
};

module.exports = { authVendeur, authAdmin };