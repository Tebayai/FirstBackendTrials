const { createClient } = require("@supabase/supabase-js");

// Client dedie a l'authentification (inscription, connexion, verification des tokens), avec la cle publique.
// Il est separe du client de la bdd : apres une connexion, un client Supabase garde la session de
// l'utilisateur et ferait ses requetes en son nom au lieu d'utiliser la cle secrete.
const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = supabaseAuth;
