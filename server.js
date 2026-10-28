const express = require("express");
const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

const confirmServerRunning = (req, res) => {
  res.json({
    status: "ok",
    message: "Le serveur est lancé avec succès !",
  })
}

// La route principale
app.get("/", confirmServerRunning);

// Démarrage du serveur
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
