// src/controllers/qrcodeController.js
const QRCode = require('qrcode');

// GET /api/qrcode/:slug
// Retourne le QR code en image PNG (base64)
exports.getQRCode = async (req, res) => {
  try {
    const { slug } = req.params;
    const shopUrl  = `${process.env.FRONTEND_URL}/${slug}`;

    const qrBase64 = await QRCode.toDataURL(shopUrl, {
      width:           300,
      margin:          2,
      color: {
        dark:  '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      qrCode:  qrBase64,   // image base64 → afficher dans <img src=...>
      shopUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur génération QR Code.' });
  }
};

// GET /api/qrcode/:slug/image
// Retourne directement le QR code en PNG téléchargeable
exports.downloadQRCode = async (req, res) => {
  try {
    const { slug } = req.params;
    const shopUrl  = `${process.env.FRONTEND_URL}/${slug}`;

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="qrcode-${slug}.png"`);

    await QRCode.toFileStream(res, shopUrl, {
      width:  300,
      margin: 2
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur génération QR Code.' });
  }
};