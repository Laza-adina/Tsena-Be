// src/controllers/uploadController.js
const cloudinary = require("../config/cloudinary");

const getUploadedFileInfo = (file) => {
  const imageUrl = file?.path || file?.secure_url || file?.url || null;
  const publicId = file?.filename || file?.public_id || null;
  return { imageUrl, publicId };
};

// POST /api/upload/product
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Aucune image fournie." });

    const { imageUrl, publicId } = getUploadedFileInfo(req.file);
    if (!imageUrl) {
      return res
        .status(500)
        .json({ error: "Upload Cloudinary invalide (URL manquante)." });
    }

    return res.json({
      message: "Image uploadée avec succès.",
      imageUrl,
      publicId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'upload." });
  }
};

// POST /api/upload/profile
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Aucune image fournie." });

    const { imageUrl } = getUploadedFileInfo(req.file);
    if (!imageUrl) {
      return res
        .status(500)
        .json({ error: "Upload Cloudinary invalide (URL manquante)." });
    }

    // Mettre à jour le profil du vendeur avec la nouvelle image
    const db = require("../config/supabase");
    await db
      .from("users")
      .update({ profile_image_url: imageUrl })
      .eq("id", req.user.id);

    return res.json({
      message: "Photo de profil mise à jour.",
      profileImageUrl: imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'upload." });
  }
};

// DELETE /api/upload/:publicId
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(`keyros/${publicId}`);
    res.json({ message: "Image supprimée." });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
};
//pdc
exports.uploadCoverImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Aucune image fournie." });

    const { imageUrl } = getUploadedFileInfo(req.file);
    if (!imageUrl) {
      return res
        .status(500)
        .json({ error: "Upload Cloudinary invalide (URL manquante)." });
    }

    const db = require("../config/supabase");
    await db
      .from("users")
      .update({ cover_image_url: imageUrl })
      .eq("id", req.user.id);

    return res.json({
      message: "Photo de couverture mise à jour.",
      coverImageUrl: imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'upload." });
  }
};
