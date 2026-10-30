# API REST - CRUD Utilisateurs

Première API backend en Node.js + Express. Construction pas à pas.

## Démarrer

```bash
npm install      # une seule fois
npm run dev      # nodemon : redémarre à chaque sauvegarde
npm start        # node server.js
```

Serveur : http://localhost:3000

## Structure

```
server.js                             -> middlewares, route /, branchement des routes, app.listen
src/router/usersRouter.js             -> URL -> fonction
src/controllers/usersController.js    -> la logique des routes utilisateurs
src/data/usersData.js                 -> le tableau qui sert de base de données temporaire
```

Chemin d'une requête : **client -> server.js -> routes -> controller -> data**

## Routes

| Méthode | URL                                  | Rôle                          | Succès |
|---------|--------------------------------------|-------------------------------|--------|
| GET     | /                                    | Message d'accueil             | 200    |
| GET     | /api/users                           | Tous les utilisateurs         | 200    |
| GET     | /api/users?ville=Caen                | Filtre sur une ville          | 200    |
| GET     | /api/users?ville=Bordeaux&ville=Caen | Filtre sur plusieurs villes   | 200    |
| GET     | /api/users?ville=bordeaux,caen       | Même chose, séparé par virgule| 200    |
| GET     | /api/users/:id                       | Un seul utilisateur           | 200    |
| POST    | /api/users                           | Cree un utilisateur           | 201    |

Le filtre `ville` ignore la casse et les espaces. Une recherche sans résultat renvoie `[]` en 200.
Un id inconnu renvoie 404.

Le POST attend un body JSON avec les trois champs. L'id est genere par le serveur.

```json
{ "nom": "David", "age": 42, "ville": "Lille" }
```

Un champ manquant ou mal type renvoie 400 avec la liste des champs fautifs.

## Tester

```bash
curl http://localhost:3000/api/users
curl "http://localhost:3000/api/users?ville=bordeaux,caen"
curl http://localhost:3000/api/users/2

curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"nom":"David","age":42,"ville":"Lille"}'
```

Ou ouvrir [requests.http](requests.http) avec l'extension VSCode **REST Client**.

## À venir

- PUT / DELETE sur `/api/users`

## Note

Express 4 est utilisé (Express 5 exige Node >= 18, cette machine est en Node 16).
