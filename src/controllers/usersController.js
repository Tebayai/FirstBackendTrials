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

module.exports = { getAllUsers, getUserById };
