// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authVendeur = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non authentifié.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DECODED:', decoded);

    if (decoded.role !== 'vendeur') return res.status(403).json({ error: 'Accès refusé.' });

    const db = require('../config/supabase');
    const { data: user, error } = await db
      .from('users')
      .select('is_active, plan, plan_expires_at')
      .eq('id', decoded.id)
      .single();

    console.log('USER FROM DB:', user);
    console.log('DB ERROR:', error);

    if (!user || !user.is_active) {
      console.log('BLOCKED: inactive');
      return res.status(403).json({ error: 'Compte désactivé.', disabled: true });
    }

    if (user.plan === 'expired') {
      console.log('BLOCKED: expired');
      return res.status(403).json({ error: 'Période d\'essai terminée.', expired: true });
    }

    console.log('AUTH OK');
    req.user = decoded;
    next();
  } catch (err) {
    console.log('AUTH CATCH ERROR:', err.message);
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