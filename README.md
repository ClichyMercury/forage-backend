# Forage — Backend API

API REST de la **Plateforme de Mise en Relation pour Prestations de Forage** : une solution web tripartite (Client · Entreprise · Administrateur) qui digitalise le processus de demande de forage, la mise en concurrence des prestataires et la sélection finale par un administrateur tiers de confiance.

> Backend basé sur **AdonisJS v7** + **Lucid (MySQL)** + **Auth (Access Tokens)**.

---

## Sommaire

- [Acteurs et workflow](#acteurs-et-workflow)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration de l'environnement](#configuration-de-lenvironnement)
- [Base de données](#base-de-données)
- [Lancer le serveur](#lancer-le-serveur)
- [Structure du projet](#structure-du-projet)
- [Endpoints principaux](#endpoints-principaux)
- [Règles de sécurité](#règles-de-sécurité)
- [Scripts utiles](#scripts-utiles)

---

## Acteurs et workflow

Trois rôles interagissent autour d'une **demande de forage** :

| Acteur | Rôle |
|---|---|
| **Client** | Soumet une demande avec un **budget confidentiel** (visible uniquement par l'admin). |
| **Entreprise** | Reçoit des appels d'offres ciblés et soumet ses propositions (sans connaître le budget). |
| **Administrateur** | Orchestre le processus, compare les offres, fixe le prix final (prestataire + marge) et le transmet au client. |

**Workflow** : `Demande → Validation admin → Appel d'offres → Offres entreprises → Comparaison → Offre finale au client → Acceptation/Refus → Mise en relation`.

---

## Stack technique

- **Framework** : AdonisJS v7
- **ORM** : Lucid (MySQL)
- **Auth** : `@adonisjs/auth` (access tokens)
- **Validation** : VineJS
- **Mail** : Nodemailer (SMTP)
- **Sécurité** : `@adonisjs/shield`, `@adonisjs/cors`
- **Sessions** : `@adonisjs/session`
- **Langage** : TypeScript (ESM)

---

## Prérequis

- **Node.js >= 24.0.0** (requis par AdonisJS v7 — vérifie avec `node -v`)
- **MySQL >= 8.x** en local
- **npm** (livré avec Node)

### Installer Node 24 via nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.zshrc
nvm install 24
nvm use 24
```

### Installer MySQL via Homebrew (macOS)

```bash
brew install mysql
brew services start mysql
```

---

## Installation

```bash
git clone <url-du-repo>
cd backend
npm install
```

---

## Configuration de l'environnement

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Générer la clé d'application :

```bash
node ace generate:key
```

Coller la valeur retournée dans la variable `APP_KEY` du fichier `.env`.

### Variables requises

```env
# Node
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development
LOG_LEVEL=info

# App
APP_KEY=                    # généré via `node ace generate:key`
APP_URL=http://localhost:3333

# Session
SESSION_DRIVER=cookie

# Database MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=forage_db

# Mail (SMTP)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=user
SMTP_PASSWORD=password
MAIL_FROM_ADDRESS=noreply@forage.local
MAIL_FROM_NAME=Forage

# CORS (optionnel)
# CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

> **Pour le développement local sans envoi réel d'emails**, installe [Mailpit](https://github.com/axllent/mailpit) (`brew install mailpit`) — il intercepte les emails sur le port 1025 et les affiche dans une UI web.

---

## Base de données

Créer la base MySQL :

```bash
mysql -u root -e "CREATE DATABASE forage_db;"
```

Lancer les migrations :

```bash
node ace migration:run
```

Lancer les seeders (crée notamment le compte administrateur) :

```bash
node ace db:seed
```

---

## Lancer le serveur

### Mode développement (avec Hot Module Reload)

```bash
npm run dev
```

L'API est disponible sur **http://localhost:3333** — le préfixe global est `/api/v1`.

### Mode production

```bash
npm run build
npm start
```

---

## Structure du projet

```
backend/
├── app/
│   ├── controllers/        # Controllers HTTP (client, entreprise, admin)
│   │   └── admin/          # Controllers admin (gestion des demandes, offres, users…)
│   ├── models/             # Modèles Lucid (User, Demande, Offre, AppelOffre…)
│   ├── middleware/         # Middlewares (auth, role…)
│   ├── validators/         # Schémas de validation VineJS
│   ├── services/           # Logique métier
│   ├── mails/              # Templates d'emails transactionnels
│   ├── events/ & listeners/ # Système d'événements
│   └── policies/           # Politiques d'accès
├── config/                 # Config Adonis (database, auth, mail, cors…)
├── database/
│   ├── migrations/         # Schéma SQL versionné
│   └── seeders/            # Données initiales (admin_seeder)
├── start/
│   ├── routes.ts           # Définition des routes API
│   ├── kernel.ts           # Middlewares globaux et nommés
│   └── env.ts              # Schéma de validation des variables d'environnement
└── tests/                  # Tests Japa
```

---

## Endpoints principaux

Toutes les routes sont préfixées par `/api/v1`.

### Auth (public)

| Méthode | Route | Description |
|---|---|---|
| POST | `/auth/register` | Inscription client (particulier ou entreprise) |
| POST | `/auth/register/entreprise` | Inscription entreprise prestataire (en attente de validation admin) |
| POST | `/auth/login` | Connexion (retourne un access token) |

### Compte (authentifié)

| Méthode | Route | Description |
|---|---|---|
| GET | `/account/profile` | Profil de l'utilisateur connecté |
| PATCH | `/account/profile` | Mise à jour du profil |
| POST | `/account/logout` | Déconnexion (révoque le token) |
| GET | `/account/notifications` | Liste des notifications |
| PATCH | `/account/notifications/:id/read` | Marquer une notification comme lue |
| PATCH | `/account/notifications/read-all` | Tout marquer comme lu |

### Client — Demandes

| Méthode | Route | Description |
|---|---|---|
| POST | `/demandes` | Créer une demande (avec budget confidentiel) |
| GET | `/demandes` | Liste de mes demandes |
| GET | `/demandes/:id` | Détail d'une demande |
| GET | `/demandes/:id/offre-finale` | Offre finale reçue de l'admin |
| GET | `/demandes/offres-finales` | Toutes mes offres finales |
| PATCH | `/demandes/:id/decision` | Accepter ou refuser l'offre finale |
| GET | `/demandes/:demandeId/messages` | Messagerie liée à la demande |
| POST | `/demandes/:demandeId/messages` | Envoyer un message |

### Entreprise — Appels d'offres

| Méthode | Route | Description |
|---|---|---|
| GET | `/appels-offres` | Appels d'offres reçus |
| GET | `/appels-offres/:id` | Détail d'un appel d'offre (sans budget client) |
| POST | `/appels-offres/:appelOffreId/offres` | Soumettre une offre |
| GET | `/mes-offres` | Historique de mes offres |

### Documents

| Méthode | Route | Description |
|---|---|---|
| POST | `/documents` | Upload (lié à une demande ou une offre) |
| GET | `/documents` | Liste des documents accessibles |
| GET | `/documents/:id/download` | Téléchargement |
| DELETE | `/documents/:id` | Suppression |

### Admin

| Méthode | Route | Description |
|---|---|---|
| GET | `/admin/demandes` | Toutes les demandes (avec budget) |
| PATCH | `/admin/demandes/:id/valider` | Valider une demande |
| PATCH | `/admin/demandes/:id/rejeter` | Rejeter une demande |
| PATCH | `/admin/demandes/:id/cloturer` | Clôturer une demande |
| POST | `/admin/appels-offres` | Lancer un appel d'offres |
| GET | `/admin/appels-offres/:appelOffreId/comparatif` | Tableau comparatif des offres |
| PATCH | `/admin/offres/:offreId/selectionner` | Sélectionner l'offre retenue |
| POST | `/admin/demandes/:demandeId/offre-finale` | Envoyer l'offre finale au client |
| GET | `/admin/users` | Liste des utilisateurs |
| GET | `/admin/users/pending-entreprises` | Entreprises en attente de validation |
| PATCH | `/admin/users/:id/valider` | Valider une entreprise |
| PATCH | `/admin/users/:id/suspendre` | Suspendre un compte |
| PATCH | `/admin/users/:id/reactiver` | Réactiver un compte |
| GET | `/admin/analytics` | Tableau de bord analytique |

---

## Règles de sécurité

Les règles suivantes sont **non-négociables** (cf. cahier des charges §6) :

- Le **budget client** est strictement masqué aux entreprises prestataires.
- Les **offres entreprises sont masquées entre elles** (pas d'enchères visibles).
- **Authentification par access token** avec gestion de session.
- **Contrôle d'accès strict par rôle** : aucune action hors du périmètre autorisé.
- **Workflow contrôlé** : aucune transition de statut hors séquence.
- Les entreprises et clients **ne communiquent jamais directement** — la messagerie passe par l'admin.

---

## Scripts utiles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de dev avec HMR |
| `npm run build` | Build de production |
| `npm start` | Lance la version buildée |
| `npm test` | Lance les tests Japa |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | Vérification TypeScript |
| `node ace make:controller` | Générer un controller |
| `node ace make:model` | Générer un modèle |
| `node ace migration:run` | Appliquer les migrations |
| `node ace migration:rollback` | Annuler la dernière migration |
| `node ace db:seed` | Lancer les seeders |
| `node ace list:routes` | Lister toutes les routes |

---

## Licence

MIT
