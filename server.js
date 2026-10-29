const express = require("express");
const usersRouter = require("./src/router/usersRouter");

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// La route principale
const getRootBase = (req, res) => {
  res.json({ message: "Bienvenue sur l'API Utilisateurs" });
}

// def des routes
app.get("/", getRootBase);
app.use("/api/users", usersRouter);

// Démarrage du serveur
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
