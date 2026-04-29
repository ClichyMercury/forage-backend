import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import app from '@adonisjs/core/services/app'
import { createReadStream, existsSync } from 'node:fs'
import { extname } from 'node:path'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

// ─── Fichiers statiques (uploads publics) ────────────────────────────────────
router.get('/uploads/*', ({ request, response }) => {
  const pathname = decodeURIComponent(request.parsedUrl.pathname ?? request.url())
  const filePath = app.makePath(pathname.replace(/^\//, ''))
  if (!existsSync(filePath)) return response.notFound({ message: 'Fichier introuvable' })
  const mime = MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
  response.header('Content-Type', mime)
  response.header('Cache-Control', 'public, max-age=86400')
  return response.stream(createReadStream(filePath))
})

const PasswordResetController = () => import('#controllers/password_reset_controller')
const DemandesController = () => import('#controllers/demandes_controller')
const AppelsOffresController = () => import('#controllers/appels_offres_controller')
const OffresController = () => import('#controllers/offres_controller')
const MessagesController = () => import('#controllers/messages_controller')
const NotificationsController = () => import('#controllers/notifications_controller')
const DocumentsController = () => import('#controllers/documents_controller')
const AdminDemandesController = () => import('#controllers/admin/demandes_controller')
const AdminAppelsOffresController = () => import('#controllers/admin/appels_offres_controller')
const AdminOffresController = () => import('#controllers/admin/offres_controller')
const AdminUsersController = () => import('#controllers/admin/users_controller')
const AdminAnalyticsController = () => import('#controllers/admin/analytics_controller')

router.get('/', () => ({ hello: 'world' }))

router
  .group(() => {
    // ─── Auth ────────────────────────────────────────────────────────────────
    router
      .group(() => {
        router.post('register', [controllers.NewAccount, 'store'])
        router.post('register/entreprise', [controllers.NewAccount, 'storeEntreprise'])
        router.post('login', [controllers.AccessTokens, 'store'])
        // Mot de passe oublié — pas besoin d'être connecté
        router.post('forgot-password', [PasswordResetController, 'forgotPassword'])
        router.post('reset-password', [PasswordResetController, 'resetPassword'])
        router.get('verify-reset-token', [PasswordResetController, 'verifyToken'])
      })
      .prefix('auth')
      .as('auth')

    // ─── Compte connecté ─────────────────────────────────────────────────────
    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.patch('profile', [controllers.Profile, 'update'])
        router.post('profile/avatar', [controllers.Profile, 'uploadAvatar'])
        router.delete('profile/avatar', [controllers.Profile, 'removeAvatar'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])

        // Notifications
        router.get('notifications', [NotificationsController, 'index'])
        router.patch('notifications/:id/read', [NotificationsController, 'markRead'])
        router.patch('notifications/read-all', [NotificationsController, 'markAllRead'])
      })
      .prefix('account')
      .as('account')
      .use(middleware.auth())

    // ─── Client: demandes ────────────────────────────────────────────────────
    router
      .group(() => {
        router.post('/', [DemandesController, 'store'])
        router.get('/offres-finales', [DemandesController, 'mesOffresFinales'])
        router.get('/', [DemandesController, 'index'])
        router.get('/:id/offre-finale', [DemandesController, 'offreFinale'])
        router.get('/:id', [DemandesController, 'show'])
        router.patch('/:id/decision', [DemandesController, 'decision'])
        router.get('/:demandeId/messages', [MessagesController, 'index'])
        router.post('/:demandeId/messages', [MessagesController, 'store'])
      })
      .prefix('demandes')
      .as('demandes')
      .use(middleware.auth())

    // ─── Entreprise: appels d'offres reçus ───────────────────────────────────
    router
      .group(() => {
        router.get('/', [AppelsOffresController, 'index'])
        router.get('/:id', [AppelsOffresController, 'show'])
        router.post('/:appelOffreId/offres', [OffresController, 'store'])
      })
      .prefix('appels-offres')
      .as('appels_offres')
      .use(middleware.auth())

    // Entreprise: historique de ses offres
    router
      .group(() => {
        router.get('/', [OffresController, 'index'])
      })
      .prefix('mes-offres')
      .as('mes_offres')
      .use(middleware.auth())
    // ─── Documents (upload) ──────────────────────────────────────────────────
    router
      .group(() => {
        router.post('/', [DocumentsController, 'store'])
        router.get('/', [DocumentsController, 'index'])
        router.get('/:id/download', [DocumentsController, 'download'])
        router.delete('/:id', [DocumentsController, 'destroy'])
      })
      .prefix('documents')
      .as('documents')
      .use(middleware.auth())

    // ─── Admin ───────────────────────────────────────────────────────────────
    router
      .group(() => {
        // Gestion des demandes
        router.get('demandes', [AdminDemandesController, 'index'])
        router.get('demandes/:id', [AdminDemandesController, 'show'])
        router.patch('demandes/:id/valider', [AdminDemandesController, 'valider'])
        router.patch('demandes/:id/rejeter', [AdminDemandesController, 'rejeter'])
        router.patch('demandes/:id/cloturer', [AdminDemandesController, 'cloturer'])

        // Appels d'offres
        router.post('appels-offres', [AdminAppelsOffresController, 'store'])
        router.get('appels-offres', [AdminAppelsOffresController, 'index'])

        // Comparatif offres et sélection
        router.get('appels-offres/:appelOffreId/comparatif', [AdminOffresController, 'comparatif'])
        router.patch('offres/:offreId/selectionner', [AdminOffresController, 'selectionner'])
        router.patch('offres/:offreId/rejeter', [AdminOffresController, 'rejeter'])
        router.post('demandes/:demandeId/offre-finale', [AdminOffresController, 'envoyerOffreFinale'])

        // Gestion des utilisateurs (CDC §3.3)
        router.get('users', [AdminUsersController, 'index'])
        router.get('users/pending-entreprises', [AdminUsersController, 'pendingEntreprises'])
        router.get('users/:id', [AdminUsersController, 'show'])
        router.patch('users/:id/valider', [AdminUsersController, 'validerEntreprise'])
        router.patch('users/:id/suspendre', [AdminUsersController, 'suspendre'])
        router.patch('users/:id/reactiver', [AdminUsersController, 'reactiver'])
        router.delete('users/:id', [AdminUsersController, 'destroy'])

        // Tableau de bord analytique
        router.get('analytics', [AdminAnalyticsController, 'dashboard'])

        // Gestion des notifications (activation/désactivation par type)
        router.get('notifications/types', [NotificationsController, 'types'])
        router.get('notifications/settings', [NotificationsController, 'settings'])
        router.patch('notifications/settings/:type', [NotificationsController, 'toggleType'])
      })
      .prefix('admin')
      .as('admin')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
