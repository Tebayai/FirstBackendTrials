const supabaseAuth = require("../data/supabaseAuthClient");

// Erreurs les plus courantes de Supabase Auth -> code HTTP + message en francais
const erreursAuth = {
  user_already_exists: { status: 409, message: "Un compte existe deja avec cet email" },
  email_exists: { status: 409, message: "Un compte existe deja avec cet email" },
  weak_password: { status: 400, message: "Mot de passe trop faible (6 caracteres minimum)" },
  email_address_invalid: { status: 400, message: "Adresse email invalide" },
  validation_failed: { status: 400, message: "Email ou mot de passe invalide" },
  invalid_credentials: { status: 401, message: "Email ou mot de passe incorrect" },
  email_not_confirmed: { status: 403, message: "Email pas encore confirme : clique sur le lien recu par email" },
  over_email_send_rate_limit: { status: 429, message: "Trop d'emails envoyes, reessaie plus tard" },
  over_request_rate_limit: { status: 429, message: "Trop de tentatives, reessaie plus tard" },
};

// Transforme une erreur Supabase en reponse JSON
const repondreErreurAuth = (res, error) => {
  const erreurConnue = erreursAuth[error.code];

  if (erreurConnue) {
    return res.status(erreurConnue.status).json({ message: erreurConnue.message });
  }

  console.error(error);

  // Pas de status ou status 5xx : Supabase est injoignable ou a un probleme
  if (!error.status || error.status >= 500) {
    return res.status(500).json({ message: "Erreur du service d'authentification" });
  }

  res.status(400).json({ message: error.message });
};

// Cree un nouveau compte (email + mot de passe)
const signUp = async (req, res) => {
  const { email, password } = req.body;

  const champsInvalides = [];

  if (typeof email !== "string" || email.trim() === "") {
    champsInvalides.push("email");
  }

  if (typeof password !== "string" || password === "") {
    champsInvalides.push("password");
  }

  if (champsInvalides.length > 0) {
    return res.status(400).json({
      message: "Champs manquants ou invalides",
      champs: champsInvalides,
    });
  }

  const { data, error } = await supabaseAuth.auth.signUp({ email: email.trim(), password });

  if (error) {
    return repondreErreurAuth(res, error);
  }

  // Quand la confirmation par email est activee, Supabase ne renvoie pas d'erreur si l'email
  // est deja utilise : il renvoie un faux utilisateur sans "identities"
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return res.status(409).json({ message: "Un compte existe deja avec cet email" });
  }

  const utilisateur = { id: data.user.id, email: data.user.email };

  // Pas de session = l'utilisateur doit d'abord confirmer son email
  if (!data.session) {
    return res.status(201).json({
      message: "Compte cree. Confirme ton email (lien recu par email) avant de te connecter",
      utilisateur,
    });
  }

  res.status(201).json({
    message: "Compte cree",
    access_token: data.session.access_token,
    expires_at: data.session.expires_at,
    utilisateur,
  });
};

// Connecte un utilisateur et renvoie son token (a envoyer ensuite dans le header Authorization)
const signIn = async (req, res) => {
  const { email, password } = req.body;

  const champsInvalides = [];

  if (typeof email !== "string" || email.trim() === "") {
    champsInvalides.push("email");
  }

  if (typeof password !== "string" || password === "") {
    champsInvalides.push("password");
  }

  if (champsInvalides.length > 0) {
    return res.status(400).json({
      message: "Champs manquants ou invalides",
      champs: champsInvalides,
    });
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email: email.trim(), password });

  if (error) {
    return repondreErreurAuth(res, error);
  }

  res.status(200).json({
    message: "Connexion reussie",
    access_token: data.session.access_token,
    expires_at: data.session.expires_at,
    utilisateur: { id: data.user.id, email: data.user.email },
  });
};

module.exports = { signUp, signIn };
