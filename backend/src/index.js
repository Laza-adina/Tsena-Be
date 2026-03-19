// src/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const routes  = require('./routes');

const app  = express();
const PORT = process.env.PORT || 3001;



// ─── Middlewares ───────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, _, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────
app.use('/api', routes);

app.get('/health', (_, res) => res.json({ status: 'OK', app: 'Keyros Backend 🚀' }));

app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} introuvable.` }));

app.use((err, req, res, next) => {
  console.error('Unhandled:', err);
  res.status(500).json({ error: 'Erreur interne.' });
});

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Keyros Backend → http://localhost:${PORT}`);
  console.log(`✅  Health check  → http://localhost:${PORT}/health\n`);
});