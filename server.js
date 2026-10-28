const express = require("express");
const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Bdd temporaire array
const users = [
  { id: 1, nom: "Bob", age: 25, ville: "Paris" },
  { id: 2, nom: "Alice", age: 18, ville: "Bordeaux" },
  { id: 3, nom: "Clémence", age: 36, ville: "Caen" },
];

// Route principale
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API Utilisateurs" });
});

// Démarrage du serveur
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
