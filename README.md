# API REST - CRUD Utilisateurs

Première API backend en Node.js + Express, avec une base de données Supabase (PostgreSQL). Construction pas à pas.

## Démarrer

```bash
npm install      # une seule fois
# créer le fichier .env (voir "Configuration" ci-dessous)
npm run dev      # nodemon : redémarre à chaque sauvegarde
npm start        # node server.js
```

Serveur : http://localhost:3000

## Structure

```
server.js                             -> middlewares, route /, branchement des routes, app.listen
src/router/usersRouter.js             -> URL -> fonction
src/controllers/usersController.js    -> la logique des routes utilisateurs
src/router/authRouter.js              -> routes d'authentification
src/controllers/authController.js     -> inscription / connexion via Supabase Auth
src/middlewares/authMiddleware.js     -> requireAuth : vérifie le token des routes protégées
src/data/supabaseClient.js            -> client Supabase pour la base (clé secrète)
src/data/supabaseAuthClient.js        -> client Supabase pour l'auth (clé publique)
```

Chemin d'une requête : **client -> server.js -> routes -> controller -> Supabase**

## Configuration

```sql
create table users (
  id    bigint generated always as identity primary key,
  nom   text    not null,
  age   integer not null check (age between 0 and 150),
  ville text    not null
);

alter table users enable row level security;
```

## Routes

| Méthode | URL                                  | Rôle                          | Succès |
|---------|--------------------------------------|-------------------------------|--------|
| GET     | /                                    | Message d'accueil             | 200    |
| POST    | /api/auth/signup                     | Crée un compte                | 201    |
| POST    | /api/auth/signin                     | Connexion, renvoie le token   | 200    |
| GET     | /api/users                           | Tous les utilisateurs         | 200    |
| GET     | /api/users?ville=Caen                | Filtre sur une ville          | 200    |
| GET     | /api/users?ville=Bordeaux&ville=Caen | Filtre sur plusieurs villes   | 200    |
| GET     | /api/users?ville=bordeaux,caen       | Même chose, séparé par virgule| 200    |
| GET     | /api/users/:id                       | Un seul utilisateur           | 200    |
| POST    | /api/users                           | Cree un utilisateur           | 201    |
| PUT     | /api/users/:id                       | Modifie un utilisateur        | 200    |
| DELETE  | /api/users/:id                       | Supprime un utilisateur       | 200    |
