// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authVendeur = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non authentifié.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'vendeur') return res.status(403).json({ error: 'Accès refusé.' });
    req.user = decoded; // { id, email, shopSlug, role }
    next();
  } catch {
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