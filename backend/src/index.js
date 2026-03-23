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

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (Postman, mobile, Railway health check)
      if (!origin) return callback(null, true);
      // Autoriser tous les sous-domaines Vercel (previews inclus)
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error(`CORS bloqué: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Preflight pour toutes les routes
app.options("*", cors());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// WhatsApp Webhook (Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const verifyToken =
    process.env.WHATSAPP_VERIFY_TOKEN || "whatsapp_secret_2024";

  if (mode === "subscribe" && token && token === verifyToken) {
    console.log("✅ Webhook WhatsApp vérifié");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("📩 WhatsApp webhook event:", JSON.stringify(req.body));
  return res.sendStatus(200);
});

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
