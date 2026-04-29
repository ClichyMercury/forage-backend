/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [{"old":"/api/v1/auth/register","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.new_account.store_entreprise': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register/entreprise',
    tokens: [{"old":"/api/v1/auth/register/entreprise","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register/entreprise","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register/entreprise","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register/entreprise","type":0,"val":"register","end":""},{"old":"/api/v1/auth/register/entreprise","type":0,"val":"entreprise","end":""}],
    types: placeholder as Registry['auth.new_account.store_entreprise']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'auth.password_reset.forgot_password': {
    methods: ["POST"],
    pattern: '/api/v1/auth/forgot-password',
    tokens: [{"old":"/api/v1/auth/forgot-password","type":0,"val":"api","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.password_reset.forgot_password']['types'],
  },
  'auth.password_reset.reset_password': {
    methods: ["POST"],
    pattern: '/api/v1/auth/reset-password',
    tokens: [{"old":"/api/v1/auth/reset-password","type":0,"val":"api","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"reset-password","end":""}],
    types: placeholder as Registry['auth.password_reset.reset_password']['types'],
  },
  'auth.password_reset.verify_token': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/verify-reset-token',
    tokens: [{"old":"/api/v1/auth/verify-reset-token","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-reset-token","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-reset-token","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-reset-token","type":0,"val":"verify-reset-token","end":""}],
    types: placeholder as Registry['auth.password_reset.verify_token']['types'],
  },
  'account.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['account.profile.show']['types'],
  },
  'account.profile.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['account.profile.update']['types'],
  },
  'account.profile.upload_avatar': {
    methods: ["POST"],
    pattern: '/api/v1/account/profile/avatar',
    tokens: [{"old":"/api/v1/account/profile/avatar","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile/avatar","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile/avatar","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile/avatar","type":0,"val":"profile","end":""},{"old":"/api/v1/account/profile/avatar","type":0,"val":"avatar","end":""}],
    types: placeholder as Registry['account.profile.upload_avatar']['types'],
  },
  'account.profile.remove_avatar': {
    methods: ["DELETE"],
    pattern: '/api/v1/account/profile/avatar',
    tokens: [{"old":"/api/v1/account/profile/avatar","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile/avatar","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile/avatar","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile/avatar","type":0,"val":"profile","end":""},{"old":"/api/v1/account/profile/avatar","type":0,"val":"avatar","end":""}],
    types: placeholder as Registry['account.profile.remove_avatar']['types'],
  },
  'account.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['account.access_tokens.destroy']['types'],
  },
  'account.notifications.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/notifications',
    tokens: [{"old":"/api/v1/account/notifications","type":0,"val":"api","end":""},{"old":"/api/v1/account/notifications","type":0,"val":"v1","end":""},{"old":"/api/v1/account/notifications","type":0,"val":"account","end":""},{"old":"/api/v1/account/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['account.notifications.index']['types'],
  },
  'account.notifications.mark_read': {
    methods: ["PATCH"],
    pattern: '/api/v1/account/notifications/:id/read',
    tokens: [{"old":"/api/v1/account/notifications/:id/read","type":0,"val":"api","end":""},{"old":"/api/v1/account/notifications/:id/read","type":0,"val":"v1","end":""},{"old":"/api/v1/account/notifications/:id/read","type":0,"val":"account","end":""},{"old":"/api/v1/account/notifications/:id/read","type":0,"val":"notifications","end":""},{"old":"/api/v1/account/notifications/:id/read","type":1,"val":"id","end":""},{"old":"/api/v1/account/notifications/:id/read","type":0,"val":"read","end":""}],
    types: placeholder as Registry['account.notifications.mark_read']['types'],
  },
  'account.notifications.mark_all_read': {
    methods: ["PATCH"],
    pattern: '/api/v1/account/notifications/read-all',
    tokens: [{"old":"/api/v1/account/notifications/read-all","type":0,"val":"api","end":""},{"old":"/api/v1/account/notifications/read-all","type":0,"val":"v1","end":""},{"old":"/api/v1/account/notifications/read-all","type":0,"val":"account","end":""},{"old":"/api/v1/account/notifications/read-all","type":0,"val":"notifications","end":""},{"old":"/api/v1/account/notifications/read-all","type":0,"val":"read-all","end":""}],
    types: placeholder as Registry['account.notifications.mark_all_read']['types'],
  },
  'demandes.demandes.store': {
    methods: ["POST"],
    pattern: '/api/v1/demandes',
    tokens: [{"old":"/api/v1/demandes","type":0,"val":"api","end":""},{"old":"/api/v1/demandes","type":0,"val":"v1","end":""},{"old":"/api/v1/demandes","type":0,"val":"demandes","end":""}],
    types: placeholder as Registry['demandes.demandes.store']['types'],
  },
  'demandes.demandes.mes_offres_finales': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/demandes/offres-finales',
    tokens: [{"old":"/api/v1/demandes/offres-finales","type":0,"val":"api","end":""},{"old":"/api/v1/demandes/offres-finales","type":0,"val":"v1","end":""},{"old":"/api/v1/demandes/offres-finales","type":0,"val":"demandes","end":""},{"old":"/api/v1/demandes/offres-finales","type":0,"val":"offres-finales","end":""}],
    types: placeholder as Registry['demandes.demandes.mes_offres_finales']['types'],
  },
  'demandes.demandes.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/demandes',
    tokens: [{"old":"/api/v1/demandes","type":0,"val":"api","end":""},{"old":"/api/v1/demandes","type":0,"val":"v1","end":""},{"old":"/api/v1/demandes","type":0,"val":"demandes","end":""}],
    types: placeholder as Registry['demandes.demandes.index']['types'],
  },
  'demandes.demandes.offre_finale': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/demandes/:id/offre-finale',
    tokens: [{"old":"/api/v1/demandes/:id/offre-finale","type":0,"val":"api","end":""},{"old":"/api/v1/demandes/:id/offre-finale","type":0,"val":"v1","end":""},{"old":"/api/v1/demandes/:id/offre-finale","type":0,"val":"demandes","end":""},{"old":"/api/v1/demandes/:id/offre-finale","type":1,"val":"id","end":""},{"old":"/api/v1/demandes/:id/offre-finale","type":0,"val":"offre-finale","end":""}],
    types: placeholder as Registry['demandes.demandes.offre_finale']['types'],
  },
  'demandes.demandes.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/demandes/:id',
    tokens: [{"old":"/api/v1/demandes/:id","type":0,"val":"api","end":""},{"old":"/api/v1/demandes/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/demandes/:id","type":0,"val":"demandes","end":""},{"old":"/api/v1/demandes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['demandes.demandes.show']['types'],
  },
  'demandes.demandes.decision': {
    methods: ["PATCH"],
    pattern: '/api/v1/demandes/:id/decision',
    tokens: [{"old":"/api/v1/demandes/:id/decision","type":0,"val":"api","end":""},{"old":"/api/v1/demandes/:id/decision","type":0,"val":"v1","end":""},{"old":"/api/v1/demandes/:id/decision","type":0,"val":"demandes","end":""},{"old":"/api/v1/demandes/:id/decision","type":1,"val":"id","end":""},{"old":"/api/v1/demandes/:id/decision","type":0,"val":"decision","end":""}],
    types: placeholder as Registry['demandes.demandes.decision']['types'],
  },
  'demandes.messages.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/demandes/:demandeId/messages',
    tokens: [{"old":"/api/v1/demandes/:demandeId/messages","type":0,"val":"api","end":""},{"old":"/api/v1/demandes/:demandeId/messages","type":0,"val":"v1","end":""},{"old":"/api/v1/demandes/:demandeId/messages","type":0,"val":"demandes","end":""},{"old":"/api/v1/demandes/:demandeId/messages","type":1,"val":"demandeId","end":""},{"old":"/api/v1/demandes/:demandeId/messages","type":0,"val":"messages","end":""}],
    types: placeholder as Registry['demandes.messages.index']['types'],
  },
  'demandes.messages.store': {
    methods: ["POST"],
    pattern: '/api/v1/demandes/:demandeId/messages',
    tokens: [{"old":"/api/v1/demandes/:demandeId/messages","type":0,"val":"api","end":""},{"old":"/api/v1/demandes/:demandeId/messages","type":0,"val":"v1","end":""},{"old":"/api/v1/demandes/:demandeId/messages","type":0,"val":"demandes","end":""},{"old":"/api/v1/demandes/:demandeId/messages","type":1,"val":"demandeId","end":""},{"old":"/api/v1/demandes/:demandeId/messages","type":0,"val":"messages","end":""}],
    types: placeholder as Registry['demandes.messages.store']['types'],
  },
  'appels_offres.appels_offres.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/appels-offres',
    tokens: [{"old":"/api/v1/appels-offres","type":0,"val":"api","end":""},{"old":"/api/v1/appels-offres","type":0,"val":"v1","end":""},{"old":"/api/v1/appels-offres","type":0,"val":"appels-offres","end":""}],
    types: placeholder as Registry['appels_offres.appels_offres.index']['types'],
  },
  'appels_offres.appels_offres.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/appels-offres/:id',
    tokens: [{"old":"/api/v1/appels-offres/:id","type":0,"val":"api","end":""},{"old":"/api/v1/appels-offres/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/appels-offres/:id","type":0,"val":"appels-offres","end":""},{"old":"/api/v1/appels-offres/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['appels_offres.appels_offres.show']['types'],
  },
  'appels_offres.offres.store': {
    methods: ["POST"],
    pattern: '/api/v1/appels-offres/:appelOffreId/offres',
    tokens: [{"old":"/api/v1/appels-offres/:appelOffreId/offres","type":0,"val":"api","end":""},{"old":"/api/v1/appels-offres/:appelOffreId/offres","type":0,"val":"v1","end":""},{"old":"/api/v1/appels-offres/:appelOffreId/offres","type":0,"val":"appels-offres","end":""},{"old":"/api/v1/appels-offres/:appelOffreId/offres","type":1,"val":"appelOffreId","end":""},{"old":"/api/v1/appels-offres/:appelOffreId/offres","type":0,"val":"offres","end":""}],
    types: placeholder as Registry['appels_offres.offres.store']['types'],
  },
  'mes_offres.offres.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/mes-offres',
    tokens: [{"old":"/api/v1/mes-offres","type":0,"val":"api","end":""},{"old":"/api/v1/mes-offres","type":0,"val":"v1","end":""},{"old":"/api/v1/mes-offres","type":0,"val":"mes-offres","end":""}],
    types: placeholder as Registry['mes_offres.offres.index']['types'],
  },
  'documents.documents.store': {
    methods: ["POST"],
    pattern: '/api/v1/documents',
    tokens: [{"old":"/api/v1/documents","type":0,"val":"api","end":""},{"old":"/api/v1/documents","type":0,"val":"v1","end":""},{"old":"/api/v1/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['documents.documents.store']['types'],
  },
  'documents.documents.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/documents',
    tokens: [{"old":"/api/v1/documents","type":0,"val":"api","end":""},{"old":"/api/v1/documents","type":0,"val":"v1","end":""},{"old":"/api/v1/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['documents.documents.index']['types'],
  },
  'documents.documents.download': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/documents/:id/download',
    tokens: [{"old":"/api/v1/documents/:id/download","type":0,"val":"api","end":""},{"old":"/api/v1/documents/:id/download","type":0,"val":"v1","end":""},{"old":"/api/v1/documents/:id/download","type":0,"val":"documents","end":""},{"old":"/api/v1/documents/:id/download","type":1,"val":"id","end":""},{"old":"/api/v1/documents/:id/download","type":0,"val":"download","end":""}],
    types: placeholder as Registry['documents.documents.download']['types'],
  },
  'documents.documents.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/documents/:id',
    tokens: [{"old":"/api/v1/documents/:id","type":0,"val":"api","end":""},{"old":"/api/v1/documents/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/documents/:id","type":0,"val":"documents","end":""},{"old":"/api/v1/documents/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['documents.documents.destroy']['types'],
  },
  'admin.admin_demandes.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/demandes',
    tokens: [{"old":"/api/v1/admin/demandes","type":0,"val":"api","end":""},{"old":"/api/v1/admin/demandes","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/demandes","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/demandes","type":0,"val":"demandes","end":""}],
    types: placeholder as Registry['admin.admin_demandes.index']['types'],
  },
  'admin.admin_demandes.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/demandes/:id',
    tokens: [{"old":"/api/v1/admin/demandes/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/demandes/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/demandes/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/demandes/:id","type":0,"val":"demandes","end":""},{"old":"/api/v1/admin/demandes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.admin_demandes.show']['types'],
  },
  'admin.admin_demandes.valider': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/demandes/:id/valider',
    tokens: [{"old":"/api/v1/admin/demandes/:id/valider","type":0,"val":"api","end":""},{"old":"/api/v1/admin/demandes/:id/valider","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/demandes/:id/valider","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/demandes/:id/valider","type":0,"val":"demandes","end":""},{"old":"/api/v1/admin/demandes/:id/valider","type":1,"val":"id","end":""},{"old":"/api/v1/admin/demandes/:id/valider","type":0,"val":"valider","end":""}],
    types: placeholder as Registry['admin.admin_demandes.valider']['types'],
  },
  'admin.admin_demandes.rejeter': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/demandes/:id/rejeter',
    tokens: [{"old":"/api/v1/admin/demandes/:id/rejeter","type":0,"val":"api","end":""},{"old":"/api/v1/admin/demandes/:id/rejeter","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/demandes/:id/rejeter","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/demandes/:id/rejeter","type":0,"val":"demandes","end":""},{"old":"/api/v1/admin/demandes/:id/rejeter","type":1,"val":"id","end":""},{"old":"/api/v1/admin/demandes/:id/rejeter","type":0,"val":"rejeter","end":""}],
    types: placeholder as Registry['admin.admin_demandes.rejeter']['types'],
  },
  'admin.admin_demandes.cloturer': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/demandes/:id/cloturer',
    tokens: [{"old":"/api/v1/admin/demandes/:id/cloturer","type":0,"val":"api","end":""},{"old":"/api/v1/admin/demandes/:id/cloturer","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/demandes/:id/cloturer","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/demandes/:id/cloturer","type":0,"val":"demandes","end":""},{"old":"/api/v1/admin/demandes/:id/cloturer","type":1,"val":"id","end":""},{"old":"/api/v1/admin/demandes/:id/cloturer","type":0,"val":"cloturer","end":""}],
    types: placeholder as Registry['admin.admin_demandes.cloturer']['types'],
  },
  'admin.admin_appels_offres.store': {
    methods: ["POST"],
    pattern: '/api/v1/admin/appels-offres',
    tokens: [{"old":"/api/v1/admin/appels-offres","type":0,"val":"api","end":""},{"old":"/api/v1/admin/appels-offres","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/appels-offres","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/appels-offres","type":0,"val":"appels-offres","end":""}],
    types: placeholder as Registry['admin.admin_appels_offres.store']['types'],
  },
  'admin.admin_appels_offres.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/appels-offres',
    tokens: [{"old":"/api/v1/admin/appels-offres","type":0,"val":"api","end":""},{"old":"/api/v1/admin/appels-offres","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/appels-offres","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/appels-offres","type":0,"val":"appels-offres","end":""}],
    types: placeholder as Registry['admin.admin_appels_offres.index']['types'],
  },
  'admin.admin_offres.comparatif': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/appels-offres/:appelOffreId/comparatif',
    tokens: [{"old":"/api/v1/admin/appels-offres/:appelOffreId/comparatif","type":0,"val":"api","end":""},{"old":"/api/v1/admin/appels-offres/:appelOffreId/comparatif","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/appels-offres/:appelOffreId/comparatif","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/appels-offres/:appelOffreId/comparatif","type":0,"val":"appels-offres","end":""},{"old":"/api/v1/admin/appels-offres/:appelOffreId/comparatif","type":1,"val":"appelOffreId","end":""},{"old":"/api/v1/admin/appels-offres/:appelOffreId/comparatif","type":0,"val":"comparatif","end":""}],
    types: placeholder as Registry['admin.admin_offres.comparatif']['types'],
  },
  'admin.admin_offres.selectionner': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/offres/:offreId/selectionner',
    tokens: [{"old":"/api/v1/admin/offres/:offreId/selectionner","type":0,"val":"api","end":""},{"old":"/api/v1/admin/offres/:offreId/selectionner","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/offres/:offreId/selectionner","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/offres/:offreId/selectionner","type":0,"val":"offres","end":""},{"old":"/api/v1/admin/offres/:offreId/selectionner","type":1,"val":"offreId","end":""},{"old":"/api/v1/admin/offres/:offreId/selectionner","type":0,"val":"selectionner","end":""}],
    types: placeholder as Registry['admin.admin_offres.selectionner']['types'],
  },
  'admin.admin_offres.rejeter': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/offres/:offreId/rejeter',
    tokens: [{"old":"/api/v1/admin/offres/:offreId/rejeter","type":0,"val":"api","end":""},{"old":"/api/v1/admin/offres/:offreId/rejeter","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/offres/:offreId/rejeter","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/offres/:offreId/rejeter","type":0,"val":"offres","end":""},{"old":"/api/v1/admin/offres/:offreId/rejeter","type":1,"val":"offreId","end":""},{"old":"/api/v1/admin/offres/:offreId/rejeter","type":0,"val":"rejeter","end":""}],
    types: placeholder as Registry['admin.admin_offres.rejeter']['types'],
  },
  'admin.admin_offres.envoyer_offre_finale': {
    methods: ["POST"],
    pattern: '/api/v1/admin/demandes/:demandeId/offre-finale',
    tokens: [{"old":"/api/v1/admin/demandes/:demandeId/offre-finale","type":0,"val":"api","end":""},{"old":"/api/v1/admin/demandes/:demandeId/offre-finale","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/demandes/:demandeId/offre-finale","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/demandes/:demandeId/offre-finale","type":0,"val":"demandes","end":""},{"old":"/api/v1/admin/demandes/:demandeId/offre-finale","type":1,"val":"demandeId","end":""},{"old":"/api/v1/admin/demandes/:demandeId/offre-finale","type":0,"val":"offre-finale","end":""}],
    types: placeholder as Registry['admin.admin_offres.envoyer_offre_finale']['types'],
  },
  'admin.admin_users.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/users',
    tokens: [{"old":"/api/v1/admin/users","type":0,"val":"api","end":""},{"old":"/api/v1/admin/users","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/users","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.admin_users.index']['types'],
  },
  'admin.admin_users.pending_entreprises': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/users/pending-entreprises',
    tokens: [{"old":"/api/v1/admin/users/pending-entreprises","type":0,"val":"api","end":""},{"old":"/api/v1/admin/users/pending-entreprises","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/users/pending-entreprises","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/users/pending-entreprises","type":0,"val":"users","end":""},{"old":"/api/v1/admin/users/pending-entreprises","type":0,"val":"pending-entreprises","end":""}],
    types: placeholder as Registry['admin.admin_users.pending_entreprises']['types'],
  },
  'admin.admin_users.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/users/:id',
    tokens: [{"old":"/api/v1/admin/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.admin_users.show']['types'],
  },
  'admin.admin_users.valider_entreprise': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/users/:id/valider',
    tokens: [{"old":"/api/v1/admin/users/:id/valider","type":0,"val":"api","end":""},{"old":"/api/v1/admin/users/:id/valider","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/users/:id/valider","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/users/:id/valider","type":0,"val":"users","end":""},{"old":"/api/v1/admin/users/:id/valider","type":1,"val":"id","end":""},{"old":"/api/v1/admin/users/:id/valider","type":0,"val":"valider","end":""}],
    types: placeholder as Registry['admin.admin_users.valider_entreprise']['types'],
  },
  'admin.admin_users.suspendre': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/users/:id/suspendre',
    tokens: [{"old":"/api/v1/admin/users/:id/suspendre","type":0,"val":"api","end":""},{"old":"/api/v1/admin/users/:id/suspendre","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/users/:id/suspendre","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/users/:id/suspendre","type":0,"val":"users","end":""},{"old":"/api/v1/admin/users/:id/suspendre","type":1,"val":"id","end":""},{"old":"/api/v1/admin/users/:id/suspendre","type":0,"val":"suspendre","end":""}],
    types: placeholder as Registry['admin.admin_users.suspendre']['types'],
  },
  'admin.admin_users.reactiver': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/users/:id/reactiver',
    tokens: [{"old":"/api/v1/admin/users/:id/reactiver","type":0,"val":"api","end":""},{"old":"/api/v1/admin/users/:id/reactiver","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/users/:id/reactiver","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/users/:id/reactiver","type":0,"val":"users","end":""},{"old":"/api/v1/admin/users/:id/reactiver","type":1,"val":"id","end":""},{"old":"/api/v1/admin/users/:id/reactiver","type":0,"val":"reactiver","end":""}],
    types: placeholder as Registry['admin.admin_users.reactiver']['types'],
  },
  'admin.admin_users.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/admin/users/:id',
    tokens: [{"old":"/api/v1/admin/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.admin_users.destroy']['types'],
  },
  'admin.admin_analytics.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/analytics',
    tokens: [{"old":"/api/v1/admin/analytics","type":0,"val":"api","end":""},{"old":"/api/v1/admin/analytics","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/analytics","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/analytics","type":0,"val":"analytics","end":""}],
    types: placeholder as Registry['admin.admin_analytics.dashboard']['types'],
  },
  'admin.notifications.types': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/notifications/types',
    tokens: [{"old":"/api/v1/admin/notifications/types","type":0,"val":"api","end":""},{"old":"/api/v1/admin/notifications/types","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/notifications/types","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/notifications/types","type":0,"val":"notifications","end":""},{"old":"/api/v1/admin/notifications/types","type":0,"val":"types","end":""}],
    types: placeholder as Registry['admin.notifications.types']['types'],
  },
  'admin.notifications.settings': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/notifications/settings',
    tokens: [{"old":"/api/v1/admin/notifications/settings","type":0,"val":"api","end":""},{"old":"/api/v1/admin/notifications/settings","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/notifications/settings","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/notifications/settings","type":0,"val":"notifications","end":""},{"old":"/api/v1/admin/notifications/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['admin.notifications.settings']['types'],
  },
  'admin.notifications.toggle_type': {
    methods: ["PATCH"],
    pattern: '/api/v1/admin/notifications/settings/:type',
    tokens: [{"old":"/api/v1/admin/notifications/settings/:type","type":0,"val":"api","end":""},{"old":"/api/v1/admin/notifications/settings/:type","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/notifications/settings/:type","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/notifications/settings/:type","type":0,"val":"notifications","end":""},{"old":"/api/v1/admin/notifications/settings/:type","type":0,"val":"settings","end":""},{"old":"/api/v1/admin/notifications/settings/:type","type":1,"val":"type","end":""}],
    types: placeholder as Registry['admin.notifications.toggle_type']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
