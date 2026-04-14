// src/middleware/upload.js
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Storage pour les images produits et profil
const storage = cloudinaryStorage({
  cloudinary,
  params: {
    folder: "keyros/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" },
    ],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Storage pour les photos de couverture
const storageCover = cloudinaryStorage({
  cloudinary,
  params: {
    folder: "keyros/covers",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1400, height: 400, crop: "fill", quality: "auto" },
    ],
  },
});

const uploadCover = multer({
  storage: storageCover,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { upload, uploadCover };
