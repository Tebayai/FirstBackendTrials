const supabase = require("../data/supabaseClient");

// Renvoie la liste de tous les utilisateurs
const getAllUsers = async (req, res) => {
  const { ville } = req.query;

  const villes = []
    .concat(ville ?? [])
    .filter((v) => typeof v === "string")
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter((v) => v !== "");

  // Seulement des lettres (accents compris), espaces, tirets et apostrophes :
  // les autres caracteres (% , . ( ) ...) ont un sens special pour Supabase
  const villesInvalides = villes.filter((v) => !/^[\p{L} '-]+$/u.test(v));

  if (villesInvalides.length > 0) {
    return res.status(400).json({ message: "Nom de ville invalide", villes: villesInvalides });
  }

  let requete = supabase.from("users").select("*").order("id");

  if (villes.length > 0) {
    // ilike = comparaison qui ignore les majuscules
    requete = requete.or(villes.map((v) => `ville.ilike."${v}"`).join(","));
  }

  const { data: users, error } = await requete;

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur de la base de données" });
  }

  res.status(200).json(users);
};

// Renvoie un seul utilisateur, trouvé grâce à son id
const getUserById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ message: `Id invalide : ${req.params.id} (nombre entier positif attendu)` });
  }

  // maybeSingle : renvoie l'utilisateur, ou null si aucune ligne ne correspond
  const { data: user, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur de la base de données" });
  }

  if (!user) {
    return res.status(404).json({ message: `Utilisateur ${req.params.id} introuvable` });
  }

  res.status(200).json(user);
};

// Cree un nouvel utilisateur
const createUser = async (req, res) => {
  const { nom, age, ville } = req.body;

  const champsInvalides = [];

  if (typeof nom !== "string" || nom.trim() === "") {
    champsInvalides.push("nom");
  }

  if (!Number.isInteger(age) || age < 0 || age > 150) {
    champsInvalides.push("age");
  }

  if (typeof ville !== "string" || ville.trim() === "") {
    champsInvalides.push("ville");
  }

  if (champsInvalides.length > 0) {
    return res.status(400).json({
      message: "Champs manquants ou invalides",
      champs: champsInvalides,
    });
  }

  // L'id est genere par la bdd, select() renvoie la ligne creee
  const { data: nouvelUtilisateur, error } = await supabase
    .from("users")
    .insert({ nom: nom.trim(), age, ville: ville.trim() })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur de la base de données" });
  }

  res.status(201).json(nouvelUtilisateur);
};

// Modifie un utilisateur existant, trouve grace a son id
// (les trois champs sont obligatoires, un eventuel id dans le body est ignore)
const updateUser = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ message: `Id invalide : ${req.params.id} (nombre entier positif attendu)` });
  }

  const { nom, age, ville } = req.body;

  const champsInvalides = [];

  if (typeof nom !== "string" || nom.trim() === "") {
    champsInvalides.push("nom");
  }

  if (!Number.isInteger(age) || age < 0 || age > 150) {
    champsInvalides.push("age");
  }

  if (typeof ville !== "string" || ville.trim() === "") {
    champsInvalides.push("ville");
  }

  if (champsInvalides.length > 0) {
    return res.status(400).json({
      message: "Champs manquants ou invalides",
      champs: champsInvalides,
    });
  }

  // Si aucune ligne n'a cet id, rien n'est modifie et user vaut null
  const { data: user, error } = await supabase
    .from("users")
    .update({ nom: nom.trim(), age, ville: ville.trim() })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur de la base de données" });
  }

  if (!user) {
    return res.status(404).json({ message: `Utilisateur ${req.params.id} introuvable` });
  }

  res.status(200).json(user);
};

// Supprime un utilisateur, trouve grace a son id
const deleteUser = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ message: `Id invalide : ${req.params.id} (nombre entier positif attendu)` });
  }

  // select() renvoie la ligne supprimee, ou null si aucune ligne n'a cet id
  const { data: userSupprime, error } = await supabase.from("users").delete().eq("id", id).select().maybeSingle();

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur de la base de données" });
  }

  if (!userSupprime) {
    return res.status(404).json({ message: `Utilisateur ${req.params.id} introuvable` });
  }

  res.status(200).json({ message: "Utilisateur supprime", utilisateur: userSupprime });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
