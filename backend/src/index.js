// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS dynamique selon l'environnement
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
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

// Start - Railway fournit automatiquement la variable PORT
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
