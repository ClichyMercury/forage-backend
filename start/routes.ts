import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

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
      })
      .prefix('auth')
      .as('auth')

    // ─── Compte connecté ─────────────────────────────────────────────────────
    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.patch('profile', [controllers.Profile, 'update'])
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
        router.get('/', [DemandesController, 'index'])
        router.get('/:id', [DemandesController, 'show'])
        router.get('/:id/offre-finale', [DemandesController, 'offreFinale'])
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
