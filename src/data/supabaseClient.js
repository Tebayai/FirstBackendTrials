const { createClient } = require("@supabase/supabase-js");

// Connexion a la bdd Supabase (URL et cle secrete dans le fichier .env)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

module.exports = supabase;
