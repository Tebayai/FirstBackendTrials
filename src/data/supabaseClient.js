const { createClient } = require("@supabase/supabase-js");

// Connexion a la bdd Supabase (URL et cle secrete dans le fichier .env)
// Ce client sert uniquement aux requetes sur les tables, jamais a connecter un utilisateur
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = supabase;
