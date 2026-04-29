/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/register'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.new_account.store_entreprise': {
    methods: ["POST"]
    pattern: '/api/v1/auth/register/entreprise'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupEntrepriseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupEntrepriseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['storeEntreprise']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['storeEntreprise']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.password_reset.forgot_password': {
    methods: ["POST"]
    pattern: '/api/v1/auth/forgot-password'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/password_reset_controller').default['forgotPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/password_reset_controller').default['forgotPassword']>>>
    }
  }
  'auth.password_reset.reset_password': {
    methods: ["POST"]
    pattern: '/api/v1/auth/reset-password'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/password_reset_controller').default['resetPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/password_reset_controller').default['resetPassword']>>>
    }
  }
  'auth.password_reset.verify_token': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/verify-reset-token'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/password_reset_controller').default['verifyToken']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/password_reset_controller').default['verifyToken']>>>
    }
  }
  'account.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'account.profile.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/account/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'account.profile.upload_avatar': {
    methods: ["POST"]
    pattern: '/api/v1/account/profile/avatar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['uploadAvatar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['uploadAvatar']>>>
    }
  }
  'account.profile.remove_avatar': {
    methods: ["DELETE"]
    pattern: '/api/v1/account/profile/avatar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['removeAvatar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['removeAvatar']>>>
    }
  }
  'account.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'account.notifications.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['index']>>>
    }
  }
  'account.notifications.mark_read': {
    methods: ["PATCH"]
    pattern: '/api/v1/account/notifications/:id/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['markRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['markRead']>>>
    }
  }
  'account.notifications.mark_all_read': {
    methods: ["PATCH"]
    pattern: '/api/v1/account/notifications/read-all'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['markAllRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['markAllRead']>>>
    }
  }
  'demandes.demandes.store': {
    methods: ["POST"]
    pattern: '/api/v1/demandes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/demande').createDemandeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/demande').createDemandeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'demandes.demandes.mes_offres_finales': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/demandes/offres-finales'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['mesOffresFinales']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['mesOffresFinales']>>>
    }
  }
  'demandes.demandes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/demandes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['index']>>>
    }
  }
  'demandes.demandes.offre_finale': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/demandes/:id/offre-finale'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['offreFinale']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['offreFinale']>>>
    }
  }
  'demandes.demandes.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/demandes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['show']>>>
    }
  }
  'demandes.demandes.decision': {
    methods: ["PATCH"]
    pattern: '/api/v1/demandes/:id/decision'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['decision']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/demandes_controller').default['decision']>>>
    }
  }
  'demandes.messages.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/demandes/:demandeId/messages'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { demandeId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['index']>>>
    }
  }
  'demandes.messages.store': {
    methods: ["POST"]
    pattern: '/api/v1/demandes/:demandeId/messages'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/message').createMessageValidator)>>
      paramsTuple: [ParamValue]
      params: { demandeId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/message').createMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'appels_offres.appels_offres.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/appels-offres'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/appels_offres_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/appels_offres_controller').default['index']>>>
    }
  }
  'appels_offres.appels_offres.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/appels-offres/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/appels_offres_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/appels_offres_controller').default['show']>>>
    }
  }
  'appels_offres.offres.store': {
    methods: ["POST"]
    pattern: '/api/v1/appels-offres/:appelOffreId/offres'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/offre').createOffreValidator)>>
      paramsTuple: [ParamValue]
      params: { appelOffreId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/offre').createOffreValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/offres_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/offres_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'mes_offres.offres.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/mes-offres'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/offres_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/offres_controller').default['index']>>>
    }
  }
  'documents.documents.store': {
    methods: ["POST"]
    pattern: '/api/v1/documents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['store']>>>
    }
  }
  'documents.documents.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/documents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['index']>>>
    }
  }
  'documents.documents.download': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/documents/:id/download'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['download']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['download']>>>
    }
  }
  'documents.documents.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/documents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['destroy']>>>
    }
  }
  'admin.admin_demandes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/demandes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['index']>>>
    }
  }
  'admin.admin_demandes.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/demandes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['show']>>>
    }
  }
  'admin.admin_demandes.valider': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/demandes/:id/valider'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['valider']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['valider']>>>
    }
  }
  'admin.admin_demandes.rejeter': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/demandes/:id/rejeter'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['rejeter']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['rejeter']>>>
    }
  }
  'admin.admin_demandes.cloturer': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/demandes/:id/cloturer'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['cloturer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/demandes_controller').default['cloturer']>>>
    }
  }
  'admin.admin_appels_offres.store': {
    methods: ["POST"]
    pattern: '/api/v1/admin/appels-offres'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/appel_offre').createAppelOffreValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/appel_offre').createAppelOffreValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/appels_offres_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/appels_offres_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.admin_appels_offres.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/appels-offres'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/appels_offres_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/appels_offres_controller').default['index']>>>
    }
  }
  'admin.admin_offres.comparatif': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/appels-offres/:appelOffreId/comparatif'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { appelOffreId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/offres_controller').default['comparatif']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/offres_controller').default['comparatif']>>>
    }
  }
  'admin.admin_offres.selectionner': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/offres/:offreId/selectionner'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { offreId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/offres_controller').default['selectionner']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/offres_controller').default['selectionner']>>>
    }
  }
  'admin.admin_offres.rejeter': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/offres/:offreId/rejeter'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { offreId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/offres_controller').default['rejeter']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/offres_controller').default['rejeter']>>>
    }
  }
  'admin.admin_offres.envoyer_offre_finale': {
    methods: ["POST"]
    pattern: '/api/v1/admin/demandes/:demandeId/offre-finale'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/offre').createOffreFinaleValidator)>>
      paramsTuple: [ParamValue]
      params: { demandeId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/offre').createOffreFinaleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/offres_controller').default['envoyerOffreFinale']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/offres_controller').default['envoyerOffreFinale']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.admin_users.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['index']>>>
    }
  }
  'admin.admin_users.pending_entreprises': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/users/pending-entreprises'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['pendingEntreprises']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['pendingEntreprises']>>>
    }
  }
  'admin.admin_users.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['show']>>>
    }
  }
  'admin.admin_users.valider_entreprise': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/users/:id/valider'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['validerEntreprise']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['validerEntreprise']>>>
    }
  }
  'admin.admin_users.suspendre': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/users/:id/suspendre'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['suspendre']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['suspendre']>>>
    }
  }
  'admin.admin_users.reactiver': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/users/:id/reactiver'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['reactiver']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['reactiver']>>>
    }
  }
  'admin.admin_users.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['destroy']>>>
    }
  }
  'admin.admin_analytics.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/analytics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/analytics_controller').default['dashboard']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/analytics_controller').default['dashboard']>>>
    }
  }
  'admin.notifications.types': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/notifications/types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['types']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['types']>>>
    }
  }
  'admin.notifications.settings': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/notifications/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['settings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['settings']>>>
    }
  }
  'admin.notifications.toggle_type': {
    methods: ["PATCH"]
    pattern: '/api/v1/admin/notifications/settings/:type'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { type: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['toggleType']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['toggleType']>>>
    }
  }
}
