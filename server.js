// Charge les variables du fichier .env dans process.env (a faire avant tout le reste)
require("dotenv").config();

const express = require("express");
const usersRouter = require("./src/router/usersRouter");
const authRouter = require("./src/router/authRouter");
const requireAuth = require("./src/middlewares/authMiddleware");

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
app.use("/api/auth", authRouter);
app.use("/api/users", requireAuth, usersRouter); // requireAuth : toutes les routes users demandent un token

// Route inconnue -> 404 en JSON (au lieu de la page HTML d'Express)
const routeIntrouvable = (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} introuvable` });
};

// Gestion des erreurs -> toujours du JSON, sans pile d'appels pour le client
// (les 4 parametres sont obligatoires pour qu'Express le reconnaisse comme gestionnaire d'erreurs)
const gestionErreurs = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Le body n'est pas un JSON valide" });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Le body est trop volumineux" });
  }

  console.error(err);
  res.status(500).json({ message: "Erreur interne du serveur" });
};

app.use(routeIntrouvable);
app.use(gestionErreurs);

// Démarrage du serveur
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));


/*
* Il existe 4 grandes manière de tester Manuellement une route d'un backend/API :
* 1. Avec un navigateur web (pour les requêtes GET)
* 2. Avec curl (en ligne de commande, c'est moche et peu lisible ex. curl http://localhost:3000/api/users)
* 3. Dans la codebase avec un script (long et peu pratique)
* 4. Avec Postman (application dédiée, tout les methodes HTTP, très pratique et lisible)
*/