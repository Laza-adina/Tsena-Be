// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS sécurisé — autorise localhost + Vercel
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://tsenabe.app",
  "https://www.tsenabe.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const normalizeOrigin = (origin = "") => origin.replace(/\/$/, "");

const normalizedAllowedOrigins = allowedOrigins.map((origin) =>
  normalizeOrigin(origin),
);

const isAllowedOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);
  return (
    normalizedAllowedOrigins.includes(normalizedOrigin) ||
    /^https?:\/\/localhost(:\d+)?$/i.test(normalizedOrigin) ||
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/i.test(normalizedOrigin) ||
    normalizedOrigin.endsWith(".vercel.app")
  );
};

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, mobile, Railway health check)
    if (!origin) return callback(null, true);

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS bloqué: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Preflight pour toutes les routes
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

app.get("/health", (_, res) =>
  res.json({ status: "OK", app: "Keyros Backend" }),
);

app.use((req, res) =>
  res
    .status(404)
    .json({ error: `Route ${req.method} ${req.path} introuvable.` }),
);

app.use((err, req, res, next) => {
  console.error("Unhandled:", err);
  res.status(500).json({ error: "Erreur interne." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
