// src/config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// On utilise uniquement le service role key côté backend
// (bypass RLS - sécurité gérée par Express + JWT)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = supabase;