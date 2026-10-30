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


/*
* Il existe 4 grandes manière de tester Manuellement une route d'un backend/API :
* 1. Avec un navigateur web (pour les requêtes GET)
* 2. Avec curl (en ligne de commande, c'est moche et peu lisible ex. curl http://localhost:3000/api/users)
* 3. Dans la codebase avec un script (long et peu pratique)
* 4. Avec Postman (application dédiée, tout les methodes HTTP, très pratique et lisible)
*/