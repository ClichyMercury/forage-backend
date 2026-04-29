# Contributing — forage-backend

## Règles de base

**La branche `main` est protégée.** Personne ne peut push directement dessus, ni la supprimer, ni faire de force-push. Toute modification passe par une **Pull Request** approuvée par @ClichyMercury.

## Workflow

```bash
# 1. Toujours partir d'un main à jour
git checkout main
git pull origin main

# 2. Créer une branche dédiée à ta feature/fix
git checkout -b feat/ma-feature
# ou
git checkout -b fix/mon-bug

# 3. Coder, commit (messages clairs et atomiques)
git add <fichiers-spécifiques>   # ⚠️ JAMAIS git add . sans réfléchir
git commit -m "feat: description courte"

# 4. Push la branche
git push origin feat/ma-feature

# 5. Ouvrir une PR sur GitHub vers main
# → @ClichyMercury sera tagué automatiquement comme reviewer (CODEOWNERS)
# → Attendre l'approbation avant de merger
```

## Règles importantes

### ⛔ Ne jamais faire

- `git init` dans un dossier déjà clone d'un repo existant (créerait des histoires Git non liées)
- `git push --force` sur une branche partagée
- `git add .` sans vérifier ce qu'on stage (risque de commit des `.env`, secrets, fichiers temporaires)
- Toucher aux migrations existantes (les modifier après leur exécution en prod = corruption de schéma)
- Toucher à la config de déploiement (`package.json#engines`, `Dockerfile`, `nixpacks.toml`, `.dockerignore`) sans demander
- Push du code qui n'a pas été testé (`npm run typecheck` doit passer **avant** chaque commit)

### ✅ Toujours faire

- Vérifier avec `git status` et `git diff` avant chaque commit
- Lancer `npm run typecheck` avant de push
- Pull/rebase main avant de push : `git fetch origin && git rebase origin/main`
- Écrire des messages de commit clairs : `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`

## Si tu fais une bêtise

**Tu as commit sur main par erreur ?**
```bash
git reset HEAD~1            # annule le dernier commit, garde les changements
git stash                   # sauvegarde
git checkout -b fix/whatever
git stash pop               # remet les changements sur la branche
```

**Tu as push sur main et c'est passé (peu probable maintenant) ?**
→ NE FAIS RIEN, préviens @ClichyMercury immédiatement.

**Tu vois `fatal: refusing to merge unrelated histories` ?**
→ NE FAIS PAS `--allow-unrelated-histories`. Préviens @ClichyMercury. Ça veut dire que l'historique Git est corrompu.

**Tu as un conflit de merge que tu ne sais pas résoudre ?**
→ `git merge --abort` puis demande de l'aide. Ne jamais résoudre à l'aveugle.

## Variables d'environnement requises

Le serveur a besoin de ces variables (configurées côté Dokploy, pas dans le repo) :

- `NODE_ENV`, `PORT`, `HOST`, `LOG_LEVEL`
- `APP_KEY`, `APP_URL`
- `SESSION_DRIVER`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`
- `CORS_ORIGIN` (liste d'origines séparées par virgules pour la prod)
- `FRONTEND_URL` (utilisée dans les emails de reset password)

En local, copier `.env.example` vers `.env` et remplir.

## Stack

- **Framework** : AdonisJS v7
- **Langage** : TypeScript (strict mode)
- **DB** : MySQL via `@adonisjs/lucid`
- **Auth** : `@adonisjs/auth` (access tokens)
- **Mail** : nodemailer + Gmail SMTP
- **Validation** : `@vinejs/vine`
- **Node** : 24.x (forcé via `package.json#engines`)

## Déploiement

Auto-déploiement sur push vers `main` via Dokploy (Nixpacks).

- URL prod : https://api.forage.wharpe.com/
- Build : ~10 min sans cache, ~30s avec cache
- Logs : interface Dokploy → app `forage-project / forageapi` → onglet Deployments

Si le build échoue, **ne pas spammer les redéploiements** — regarder les logs complets dans Dokploy d'abord.
