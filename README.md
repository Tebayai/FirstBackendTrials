# API REST - CRUD Utilisateurs

Première API backend en Node.js + Express. Construction pas à pas.

## Démarrer

```bash
npm install      # une seule fois
npm run dev      # nodemon : redémarre à chaque sauvegarde
npm start        # node server.js
```

Serveur : http://localhost:3000

## État actuel

Tout tient dans [server.js](server.js) :

- import d'Express et création de l'app
- middleware `express.json()` pour lire le body JSON
- une route principale `GET /`
- démarrage avec `app.listen`

## Tester

```bash
curl http://localhost:3000/
```

Ou ouvrir [requests.http](requests.http) avec l'extension VSCode **REST Client**.

## À venir

- le tableau d'utilisateurs en mémoire
- les routes CRUD : GET / POST / PUT / DELETE sur `/api/users`

## Note

Express 4 est utilisé (Express 5 exige Node >= 18, cette machine est en Node 16).
