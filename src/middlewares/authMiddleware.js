const supabaseAuth = require("../data/supabaseAuthClient");

// Bloque la requete si elle n'a pas de token valide dans le header "Authorization: Bearer <token>"
// Si le token est bon, l'utilisateur connecte est disponible dans req.user pour la suite
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant : ajoute le header Authorization: Bearer <token>" });
  }

  const token = header.slice("Bearer ".length).trim();

  // Supabase verifie le token et renvoie l'utilisateur correspondant
  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error) {
    // Pas de status ou status 5xx : Supabase est injoignable ou a un probleme
    if (!error.status || error.status >= 500) {
      console.error(error);
      return res.status(500).json({ message: "Impossible de verifier le token" });
    }

    return res.status(401).json({ message: "Token invalide ou expire, reconnecte-toi" });
  }

  req.user = data.user;
  next();
};

module.exports = requireAuth;
