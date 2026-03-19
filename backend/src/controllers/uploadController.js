// src/controllers/uploadController.js
const cloudinary = require('../config/cloudinary');

// POST /api/upload/product
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucune image fournie.' });

    return res.json({
      message:  'Image uploadée avec succès.',
      imageUrl: req.file.path,      // URL Cloudinary
      publicId: req.file.filename   // pour suppression future
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'upload." });
  }
};

// POST /api/upload/profile
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucune image fournie.' });

    // Mettre à jour le profil du vendeur avec la nouvelle image
    const db = require('../config/supabase');
    await db.from('users')
      .update({ profile_image_url: req.file.path })
      .eq('id', req.user.id);

    return res.json({
      message:         'Photo de profil mise à jour.',
      profileImageUrl: req.file.path
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
    res.json({ message: 'Image supprimée.' });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
};