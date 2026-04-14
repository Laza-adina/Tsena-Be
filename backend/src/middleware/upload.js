// src/middleware/upload.js
const multer = require("multer");
const cloudinaryStoragePackage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const buildParams = (folder, transformation) => ({
  folder,
  allowed_formats: ["jpg", "jpeg", "png", "webp"],
  transformation,
});

const createStorage = (params) => {
  // v3/v4 export: { CloudinaryStorage }
  if (typeof cloudinaryStoragePackage.CloudinaryStorage === "function") {
    return new cloudinaryStoragePackage.CloudinaryStorage({
      cloudinary,
      params,
    });
  }

  // v2 export: factory function expecting cloudinary.v2
  return cloudinaryStoragePackage({
    cloudinary: { v2: cloudinary },
    params,
  });
};

// Storage pour les images produits et profil
const storage = createStorage(
  buildParams("keyros/products", [
    { width: 800, height: 800, crop: "limit", quality: "auto" },
  ]),
);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Storage pour les photos de couverture
const storageCover = createStorage(
  buildParams("keyros/covers", [
    { width: 1400, height: 400, crop: "fill", quality: "auto" },
  ]),
);

const uploadCover = multer({
  storage: storageCover,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { upload, uploadCover };
