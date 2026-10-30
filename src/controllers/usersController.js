const users = require("../data/usersData");

// Renvoie la liste de tous les utilisateurs
const getAllUsers = (req, res) => {
  const { ville } = req.query;

  if (!ville) {
    return res.status(200).json(users);
  }

  const villes = []
    .concat(ville)
    .flatMap((v) => v.split(","))
    .map((v) => v.trim().toLowerCase())
    .filter((v) => v !== "");

  if (villes.length === 0) {
    return res.status(200).json(users);
  }

  const resultat = users.filter((u) => villes.includes(u.ville.toLowerCase()));

  res.status(200).json(resultat);
};

// Renvoie un seul utilisateur, trouvé grâce à son id
const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: `Utilisateur ${req.params.id} introuvable` });
  }

  res.status(200).json(user);
};

// Cree un nouvel utilisateur
const createUser = (req, res) => {
  const { nom, age, ville } = req.body;

  const champsInvalides = [];

  if (typeof nom !== "string" || nom.trim() === "") {
    champsInvalides.push("nom");
  }

  if (!Number.isInteger(age) || age < 0) {
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

  const nouvelUtilisateur = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    nom: nom.trim(),
    age,
    ville: ville.trim(),
  };

  users.push(nouvelUtilisateur);

  res.status(201).json(nouvelUtilisateur);
};

module.exports = { getAllUsers, getUserById, createUser };

/*
* Il existe 4 grandes manière de tester Manuellement une route d'un backend/API :
* 1. Avec un navigateur web (pour les requêtes GET)
* 2. Avec curl (en ligne de commande, c'est moche et peu lisible ex. curl http://localhost:3000/api/users)
* 3. Dans la codebase avec un script (long et peu pratique)
* 4. Avec Postman (application dédiée, tout les methodes HTTP, très pratique et lisible)
*/
