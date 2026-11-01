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

## Authentification

Gérée par **Supabase Auth**. Toutes les routes `/api/users` demandent un token (sinon 401).

1. `POST /api/auth/signup` avec `{ "email": "...", "password": "..." }` : crée le compte. Supabase envoie un email de confirmation, à valider avant de pouvoir se connecter.
2. `POST /api/auth/signin` avec les mêmes champs : renvoie un `access_token` (valable 1 heure).
3. Envoyer ce token dans le header de chaque requête :

```
Authorization: Bearer <access_token>
```

Le middleware `requireAuth` vérifie le token auprès de Supabase et met l'utilisateur connecté dans `req.user`.

| Cas                                  | Code |
|--------------------------------------|------|
| Email ou mot de passe incorrect      | 401  |
| Email pas encore confirmé            | 403  |
| Email déjà utilisé (signup)          | 409  |
| Mot de passe trop faible (< 6 car.)  | 400  |
| Token manquant, invalide ou expiré   | 401  |
| Trop de tentatives / d'emails        | 429  |

Le filtre `ville` ignore la casse et les espaces. Un nom de ville ne peut contenir que des lettres, espaces, tirets et apostrophes (sinon 400). Une recherche sans résultat renvoie `[]` en 200.
Un id inconnu renvoie 404, un id qui n'est pas un nombre entier (ex. `abc`) renvoie 400.

Le POST attend un body JSON avec les trois champs. L'id est généré par la base de données.

```json
{ "nom": "David", "age": 42, "ville": "Lille" }
```

Un champ manquant ou mal type renvoie 400 avec la liste des champs fautifs. L'âge doit être un entier entre 0 et 150.

Le PUT modifie l'utilisateur : il attend les trois champs, comme le POST (sinon 400).
L'id vient toujours de l'URL ; un `id` dans le body est ignoré.

## Erreurs

Toutes les erreurs sont renvoyées en JSON sous la forme `{ "message": "..." }` :

| Cas                         | Code |
|-----------------------------|------|
| Champ manquant ou invalide  | 400  |
| Id qui n'est pas un entier  | 400  |
| Nom de ville invalide       | 400  |
| Body JSON mal formé         | 400  |
| Utilisateur introuvable     | 404  |
| Route inexistante           | 404  |
| Body trop volumineux        | 413  |
| Erreur de la base / imprévue| 500  |

## Tester

```bash
# se connecter et copier l'access_token de la réponse
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"ton.email@exemple.com","password":"MotDePasse123!"}'

TOKEN=colle_le_token_ici

curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/users
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/users?ville=bordeaux,caen"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/users/2

curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"nom":"David","age":42,"ville":"Lille"}'

curl -H "Authorization: Bearer $TOKEN" -X PUT http://localhost:3000/api/users/3 \
  -H "Content-Type: application/json" \
  -d '{"nom":"Clémence","age":35,"ville":"Limoges"}'

curl -H "Authorization: Bearer $TOKEN" -X DELETE http://localhost:3000/api/users/2
```

Ou ouvrir [requests.http](requests.http) avec l'extension VSCode **REST Client**.

## Note

Express 4 est utilisé (Express 5 exige Node >= 18, cette machine est en Node 16).
