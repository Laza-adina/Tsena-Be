-- ============================================================
-- KEYROS - Schéma PostgreSQL pour Supabase
-- Exécuter dans : Supabase Dashboard → SQL Editor → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users (les vendeurs)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,

  -- Infos boutique
  shop_name     TEXT NOT NULL,
  shop_slug     TEXT UNIQUE NOT NULL,  -- ex: "miora-fringues" → keyros.mg/miora-fringues
  description   TEXT,
  profile_image_url TEXT,

  -- Contact
  whatsapp      TEXT,                  -- ex: 261341234567 (format international sans +)
  facebook_url  TEXT,

  -- Plan
  plan          TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'premium'
  plan_expires_at TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT true,

  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: products (catalogue du vendeur)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Infos produit
  reference     TEXT NOT NULL,         -- ex: "REF-001" affiché sur le bouton WhatsApp
  name          TEXT NOT NULL,
  description   TEXT,
  price         INTEGER NOT NULL DEFAULT 0,   -- Prix en Ariary
  image_url     TEXT,
  is_available  BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: admins (vous = gestionnaires du SaaS)
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'admin',  -- 'superadmin' | 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: page_views (statistiques simples)
-- ============================================================
CREATE TABLE IF NOT EXISTS page_views (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,  -- 'page_view' | 'whatsapp_click'
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEX
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_user_id    ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id  ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_users_shop_slug     ON users(shop_slug);

-- ============================================================
-- Trigger updated_at automatique
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Désactiver RLS (sécurité gérée par Express + JWT)
-- ============================================================
ALTER TABLE users        DISABLE ROW LEVEL SECURITY;
ALTER TABLE products     DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins       DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views   DISABLE ROW LEVEL SECURITY;