// src/routes/index.js
const router = require("express").Router();
const { authVendeur, authAdmin } = require("../middleware/auth");

const auth = require("../controllers/authController");
const shop = require("../controllers/productsController");
const admin = require("../controllers/adminController");
const upload_ctrl = require("../controllers/uploadController");
const { upload, uploadCover } = require("../middleware/upload");
const qrcode = require("../controllers/qrcodeController");
const subs = require("../controllers/subscriptionsController");
// ════════════════════════════════
// PUBLIC — pas de token requis
// ════════════════════════════════

router.post("/auth/signup", auth.signup);
router.post("/auth/login", auth.login);
router.post("/auth/forgot-password", auth.forgotPassword);
router.post("/auth/reset-password", auth.resetPassword);
router.get("/auth/verify-email", auth.verifyEmail);

// Page publique boutique
router.get("/public/:slug", shop.getPublicShop);
router.post("/public/:slug/track", shop.trackWhatsapp);

// Setup premier admin (une seule fois)
router.post("/admin/setup", admin.setupAdmin);
router.post("/admin/login", admin.adminLogin);
//pdc
router.post(
  "/upload/cover",
  authVendeur,
  uploadCover.single("image"),
  upload_ctrl.uploadCoverImage,
);

// ════════════════════════════════
// VENDEUR — token vendeur requis
// ════════════════════════════════

router.get("/auth/me", authVendeur, auth.getMe);
router.put("/auth/profile", authVendeur, auth.updateProfile);
router.get("/subscriptions/history", authVendeur, subs.getMySubscriptions);

router.get("/products", authVendeur, shop.getMyProducts);
router.post("/products", authVendeur, shop.createProduct);
router.put("/products/:id", authVendeur, shop.updateProduct);
router.delete("/products/:id", authVendeur, shop.deleteProduct);

router.get("/stats", authVendeur, shop.getStats);

router.post(
  "/upload/product",
  authVendeur,
  upload.single("image"),
  upload_ctrl.uploadProductImage,
);
router.post(
  "/upload/profile",
  authVendeur,
  upload.single("image"),
  upload_ctrl.uploadProfileImage,
);
router.delete("/upload/:publicId", authVendeur, upload_ctrl.deleteImage);

router.get("/qrcode/:slug", authVendeur, qrcode.getQRCode);
router.get("/qrcode/:slug/image", authVendeur, qrcode.downloadQRCode);
// ════════════════════════════════
// ADMIN — token admin requis
// ════════════════════════════════

router.get("/admin/dashboard", authAdmin, admin.getDashboard);

router.get("/admin/vendors", authAdmin, admin.getAllVendors);
router.post("/admin/vendors", authAdmin, admin.createVendor);
router.get("/admin/vendors/:id", authAdmin, admin.getVendorDetail);
router.put("/admin/vendors/:id/plan", authAdmin, admin.updatePlan);
router.put("/admin/vendors/:id/toggle", authAdmin, admin.toggleVendor);
router.delete("/admin/vendors/:id", authAdmin, admin.deleteVendor);
router.get("/admin/subscriptions", authAdmin, subs.getAllSubscriptions);
router.put("/admin/vendors/:id/activate", authAdmin, subs.activateVendor);

module.exports = router;
