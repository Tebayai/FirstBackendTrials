const express = require("express");
const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// bdd temp
const users = [
  { id: 1, nom: "Bob", age: 25, ville: "Paris" },
  { id: 2, nom: "Alice", age: 18, ville: "Bordeaux" },
  { id: 3, nom: "Clémence", age: 36, ville: "Caen" },
];

// La route principale
const getRootBase = (req, res) => {
  res.json({ message: "Bienvenue sur l'API Utilisateurs" });
}

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

// def des routes
app.get("/", getRootBase);
app.get("/api/users", getAllUsers);
app.get("/api/users/:id", getUserById);

// Démarrage du serveur
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
