const db = require('../config/supabase');

// Counts are cached briefly to avoid repeating one exact count per active shop.
const CACHE_MS = 5 * 60 * 1000;
const PAGE_SIZE = 500;
const BATCH_SIZE = 10;
let cache = null;
let pending = null;

async function loadRanking() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const vendors = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await db.from('users')
      .select('id, shop_name, shop_slug, description, profile_image_url, cover_image_url')
      .eq('is_active', true)
      .not('shop_slug', 'is', null)
      .order('id', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) throw error;
    vendors.push(...(data || []));
    if (!data || data.length < PAGE_SIZE) break;
  }

  const ranked = [];
  for (let offset = 0; offset < vendors.length; offset += BATCH_SIZE) {
    const batch = vendors.slice(offset, offset + BATCH_SIZE);
    const counts = await Promise.all(batch.map(async (vendor) => {
      const { count, error } = await db.from('page_views')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', vendor.id)
        .eq('event_type', 'page_view')
        .gte('created_at', since);
      if (error) throw error;
      return { shopName: vendor.shop_name, shopSlug: vendor.shop_slug,
        description: vendor.description, profileImageUrl: vendor.profile_image_url,
        coverImageUrl: vendor.cover_image_url, views: count || 0 };
    }));
    ranked.push(...counts);
  }
  return ranked.filter((shop) => shop.views > 0)
    .sort((a, b) => b.views - a.views || a.shopName.localeCompare(b.shopName, 'fr') || a.shopSlug.localeCompare(b.shopSlug, 'fr'))
    .slice(0, 6);
}

exports.getShopRanking = async (req, res) => {
  try {
    if (!cache || Date.now() >= cache.expires) {
      if (!pending) {
        pending = loadRanking().then((shops) => {
          cache = { shops, expires: Date.now() + CACHE_MS };
          return shops;
        }).finally(() => { pending = null; });
      }
      await pending;
    }
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ shops: cache.shops, periodDays: 30 });
  } catch (error) {
    console.error('SHOP RANKING ERROR:', error.message);
    res.status(503).json({ error: 'Le classement est temporairement indisponible.' });
  }
};
