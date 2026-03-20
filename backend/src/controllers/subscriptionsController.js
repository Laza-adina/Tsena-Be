// src/controllers/subscriptionsController.js
const db = require('../config/supabase');

const PLANS = {
  monthly: { amount: 10000,  months: 1  },
  annual:  { amount: 100000, months: 12 }
};

// ─── GET /api/subscriptions/history ───────────────────────
exports.getMySubscriptions = async (req, res) => {
  try {
    const { data: subscriptions, error } = await db
      .from('subscriptions')
      .select('id, plan_type, amount, status, note, created_at, confirmed_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ subscriptions });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── GET /api/admin/subscriptions ─────────────────────────
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { status } = req.query;

    let query = db
      .from('subscriptions')
      .select(`*, users:user_id (email, shop_name, shop_slug, plan, plan_expires_at)`);

    if (status) query = query.eq('status', status);

    const { data: subscriptions, error } = await query
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ subscriptions });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── POST /api/admin/vendors/:id/activate ─────────────────
exports.activateVendor = async (req, res) => {
  try {
    const { planType } = req.body;
    const vendorId = parseInt(req.params.id);

    if (!PLANS[planType])
      return res.status(400).json({ error: 'Plan invalide. (monthly ou annual)' });

    const plan = PLANS[planType];

    // Calculer expiration
    const { data: vendor } = await db
      .from('users')
      .select('plan, plan_expires_at')
      .eq('id', vendorId)
      .single();

    const baseDate = vendor?.plan_expires_at && new Date(vendor.plan_expires_at) > new Date()
      ? new Date(vendor.plan_expires_at)
      : new Date();

    baseDate.setMonth(baseDate.getMonth() + plan.months);

    // Enregistrer dans subscriptions
    const { error: subError } = await db.from('subscriptions').insert([{
      user_id:        vendorId,
      plan_type:      planType,
      amount:         plan.amount,
      payment_method: 'manual',
      reference:      `ADMIN-${Date.now()}`,
      status:         'confirmed',
      confirmed_by:   req.admin.id,
      confirmed_at:   new Date().toISOString()
    }]);

    if (subError) {
      console.error('SUB INSERT ERROR:', subError);
      throw subError;
    }

    // Activer le plan
    const { data: updated, error } = await db
      .from('users')
      .update({
        plan:            planType,
        plan_expires_at: baseDate.toISOString(),
        is_active:       true
      })
      .eq('id', vendorId)
      .select('id, email, shop_name, plan, plan_expires_at')
      .single();

    if (error) {
      console.error('USER UPDATE ERROR:', error);
      throw error;
    }

    res.json({
      message: `Plan ${planType} active jusqu'au ${baseDate.toLocaleDateString('fr-FR')}.`,
      vendor: updated
    });

  } catch (err) {
    console.error('ACTIVATE ERROR:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};