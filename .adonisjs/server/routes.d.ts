import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.new_account.store_entreprise': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'account.profile.update': { paramsTuple?: []; params?: {} }
    'account.profile.upload_avatar': { paramsTuple?: []; params?: {} }
    'account.profile.remove_avatar': { paramsTuple?: []; params?: {} }
    'account.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'account.notifications.index': { paramsTuple?: []; params?: {} }
    'account.notifications.mark_read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'account.notifications.mark_all_read': { paramsTuple?: []; params?: {} }
    'demandes.demandes.store': { paramsTuple?: []; params?: {} }
    'demandes.demandes.mes_offres_finales': { paramsTuple?: []; params?: {} }
    'demandes.demandes.index': { paramsTuple?: []; params?: {} }
    'demandes.demandes.offre_finale': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'demandes.demandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'demandes.demandes.decision': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'demandes.messages.index': { paramsTuple: [ParamValue]; params: {'demandeId': ParamValue} }
    'demandes.messages.store': { paramsTuple: [ParamValue]; params: {'demandeId': ParamValue} }
    'appels_offres.appels_offres.index': { paramsTuple?: []; params?: {} }
    'appels_offres.appels_offres.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'appels_offres.offres.store': { paramsTuple: [ParamValue]; params: {'appelOffreId': ParamValue} }
    'mes_offres.offres.index': { paramsTuple?: []; params?: {} }
    'documents.documents.store': { paramsTuple?: []; params?: {} }
    'documents.documents.index': { paramsTuple?: []; params?: {} }
    'documents.documents.download': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.index': { paramsTuple?: []; params?: {} }
    'admin.admin_demandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.valider': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.rejeter': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.cloturer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_appels_offres.store': { paramsTuple?: []; params?: {} }
    'admin.admin_appels_offres.index': { paramsTuple?: []; params?: {} }
    'admin.admin_offres.comparatif': { paramsTuple: [ParamValue]; params: {'appelOffreId': ParamValue} }
    'admin.admin_offres.selectionner': { paramsTuple: [ParamValue]; params: {'offreId': ParamValue} }
    'admin.admin_offres.rejeter': { paramsTuple: [ParamValue]; params: {'offreId': ParamValue} }
    'admin.admin_offres.envoyer_offre_finale': { paramsTuple: [ParamValue]; params: {'demandeId': ParamValue} }
    'admin.admin_users.index': { paramsTuple?: []; params?: {} }
    'admin.admin_users.pending_entreprises': { paramsTuple?: []; params?: {} }
    'admin.admin_users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_users.valider_entreprise': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_users.suspendre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_users.reactiver': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_analytics.dashboard': { paramsTuple?: []; params?: {} }
    'admin.notifications.types': { paramsTuple?: []; params?: {} }
    'admin.notifications.settings': { paramsTuple?: []; params?: {} }
    'admin.notifications.toggle_type': { paramsTuple: [ParamValue]; params: {'type': ParamValue} }
  }
  GET: {
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'account.notifications.index': { paramsTuple?: []; params?: {} }
    'demandes.demandes.mes_offres_finales': { paramsTuple?: []; params?: {} }
    'demandes.demandes.index': { paramsTuple?: []; params?: {} }
    'demandes.demandes.offre_finale': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'demandes.demandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'demandes.messages.index': { paramsTuple: [ParamValue]; params: {'demandeId': ParamValue} }
    'appels_offres.appels_offres.index': { paramsTuple?: []; params?: {} }
    'appels_offres.appels_offres.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'mes_offres.offres.index': { paramsTuple?: []; params?: {} }
    'documents.documents.index': { paramsTuple?: []; params?: {} }
    'documents.documents.download': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.index': { paramsTuple?: []; params?: {} }
    'admin.admin_demandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_appels_offres.index': { paramsTuple?: []; params?: {} }
    'admin.admin_offres.comparatif': { paramsTuple: [ParamValue]; params: {'appelOffreId': ParamValue} }
    'admin.admin_users.index': { paramsTuple?: []; params?: {} }
    'admin.admin_users.pending_entreprises': { paramsTuple?: []; params?: {} }
    'admin.admin_users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_analytics.dashboard': { paramsTuple?: []; params?: {} }
    'admin.notifications.types': { paramsTuple?: []; params?: {} }
    'admin.notifications.settings': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'account.notifications.index': { paramsTuple?: []; params?: {} }
    'demandes.demandes.mes_offres_finales': { paramsTuple?: []; params?: {} }
    'demandes.demandes.index': { paramsTuple?: []; params?: {} }
    'demandes.demandes.offre_finale': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'demandes.demandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'demandes.messages.index': { paramsTuple: [ParamValue]; params: {'demandeId': ParamValue} }
    'appels_offres.appels_offres.index': { paramsTuple?: []; params?: {} }
    'appels_offres.appels_offres.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'mes_offres.offres.index': { paramsTuple?: []; params?: {} }
    'documents.documents.index': { paramsTuple?: []; params?: {} }
    'documents.documents.download': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.index': { paramsTuple?: []; params?: {} }
    'admin.admin_demandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_appels_offres.index': { paramsTuple?: []; params?: {} }
    'admin.admin_offres.comparatif': { paramsTuple: [ParamValue]; params: {'appelOffreId': ParamValue} }
    'admin.admin_users.index': { paramsTuple?: []; params?: {} }
    'admin.admin_users.pending_entreprises': { paramsTuple?: []; params?: {} }
    'admin.admin_users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_analytics.dashboard': { paramsTuple?: []; params?: {} }
    'admin.notifications.types': { paramsTuple?: []; params?: {} }
    'admin.notifications.settings': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.new_account.store_entreprise': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'account.profile.upload_avatar': { paramsTuple?: []; params?: {} }
    'account.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'demandes.demandes.store': { paramsTuple?: []; params?: {} }
    'demandes.messages.store': { paramsTuple: [ParamValue]; params: {'demandeId': ParamValue} }
    'appels_offres.offres.store': { paramsTuple: [ParamValue]; params: {'appelOffreId': ParamValue} }
    'documents.documents.store': { paramsTuple?: []; params?: {} }
    'admin.admin_appels_offres.store': { paramsTuple?: []; params?: {} }
    'admin.admin_offres.envoyer_offre_finale': { paramsTuple: [ParamValue]; params: {'demandeId': ParamValue} }
  }
  PATCH: {
    'account.profile.update': { paramsTuple?: []; params?: {} }
    'account.notifications.mark_read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'account.notifications.mark_all_read': { paramsTuple?: []; params?: {} }
    'demandes.demandes.decision': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.valider': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.rejeter': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_demandes.cloturer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_offres.selectionner': { paramsTuple: [ParamValue]; params: {'offreId': ParamValue} }
    'admin.admin_offres.rejeter': { paramsTuple: [ParamValue]; params: {'offreId': ParamValue} }
    'admin.admin_users.valider_entreprise': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_users.suspendre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_users.reactiver': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.notifications.toggle_type': { paramsTuple: [ParamValue]; params: {'type': ParamValue} }
  }
  DELETE: {
    'account.profile.remove_avatar': { paramsTuple?: []; params?: {} }
    'documents.documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.admin_users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}