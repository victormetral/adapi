# Adapi

API REST pour La Remise — Node.js, Express 5, PostgreSQL (driver `pg`, sans ORM).

Projet réalisé dans le cadre d'Ada Tech School (Bloc 1, semaines 13-14).

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+

### Étapes

```bash
git clone https://github.com/victormetral/adapi.git
cd adapi
npm install
```

Créer un fichier `.env` à la racine, sur le modèle de `.env.example` :

```
PORT=3000
DATABASE_URL=postgresql://votre_user@localhost:5432/laremise
```

⚠️ Sur macOS/Homebrew, le rôle `postgres` n'existe pas par défaut : utiliser `createdb` plutôt que `psql -U postgres`.

Importer la base :

```bash
createdb laremise
psql -d laremise -f db/migration_up.sql
psql -d laremise -f db/seed.sql
```

Vérifier l'import :

```bash
psql -d laremise -c "SELECT COUNT(*) FROM objet;"
```
Doit renvoyer `79`.

Démarrer le serveur :

```bash
npm start        # une fois
npm run dev       # avec rechargement automatique
```

Le serveur écoute sur `http://localhost:3000`.

## Routes disponibles

### Lecture

| Verbe | Route | Description |
|---|---|---|
| GET | `/api/categories` | Toutes les catégories |
| GET | `/api/objets` | Liste des objets, avec leur catégorie |
| GET | `/api/objets?statut=&categorie_id=` | Liste filtrée (filtres optionnels et cumulables) |
| GET | `/api/objets/:id` | Un objet, sa catégorie, son dépôt, sa donatrice |
| GET | `/api/depots/:id` | Un dépôt, sa donatrice, ses objets |

### Écriture

| Verbe | Route | Description |
|---|---|---|
| POST | `/api/personnes` | Crée une donatrice |
| POST | `/api/depots` | Enregistre un dépôt |
| POST | `/api/depots/:id/objets` | Ajoute un objet à un dépôt |
| PATCH | `/api/objets/:id/statut` | Fait évoluer le statut d'un objet |
| GET | `/api/stats` | Objets par statut, poids total, poids détourné de la déchetterie |

## Tester l'API

Les requêtes de test sont dans `requetes/`, au format `.http` (extension **REST Client** de VS Code) :

- `requetes/lecture.http` — les 5 routes de lecture, dont 2 cas d'erreur (404)
- `requetes/ecriture.http` — les 5 routes d'écriture, dont plusieurs cas d'erreur (400/404)

Ouvrir le fichier dans VS Code, cliquer sur **Send Request** au-dessus de chaque bloc, serveur lancé.

## Choix techniques

- **Pas d'ORM** : le SQL est écrit à la main via le driver `pg`, pour en garder la maîtrise complète.
- **Requêtes paramétrées** (`$1, $2...`) partout où une valeur vient du client — jamais de concaténation.
- **Filtres optionnels** implémentés avec `COALESCE`, une seule requête pour toutes les combinaisons.
- **Validation en liste blanche** des valeurs d'enum avant tout envoi à PostgreSQL, pour renvoyer 400 plutôt que de laisser une erreur serveur remonter.
- **`statut_objet` compte 5 valeurs** dans la vraie migration (`vendu` inclus), contre 4 dans l'énoncé — le code suit la migration réelle.

## Bonus

## Bonus

- **Documentation interactive** : Swagger UI sur `/api-docs`, décrivant les 10 routes (paramètres, corps attendu, codes de réponse).
- **Middleware d'erreurs centralisé** : toute exception non gérée renvoie un JSON `{ erreur: ... }` avec un statut 500, jamais une stack trace brute.
- **Middleware de log** : chaque requête affiche sa méthode, son URL, son code de statut et sa durée dans le terminal.