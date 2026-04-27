/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
      storeEntreprise: typeof routes['auth.new_account.store_entreprise']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  account: {
    profile: {
      show: typeof routes['account.profile.show']
      update: typeof routes['account.profile.update']
      uploadAvatar: typeof routes['account.profile.upload_avatar']
      removeAvatar: typeof routes['account.profile.remove_avatar']
    }
    accessTokens: {
      destroy: typeof routes['account.access_tokens.destroy']
    }
    notifications: {
      index: typeof routes['account.notifications.index']
      markRead: typeof routes['account.notifications.mark_read']
      markAllRead: typeof routes['account.notifications.mark_all_read']
    }
  }
  demandes: {
    demandes: {
      store: typeof routes['demandes.demandes.store']
      mesOffresFinales: typeof routes['demandes.demandes.mes_offres_finales']
      index: typeof routes['demandes.demandes.index']
      offreFinale: typeof routes['demandes.demandes.offre_finale']
      show: typeof routes['demandes.demandes.show']
      decision: typeof routes['demandes.demandes.decision']
    }
    messages: {
      index: typeof routes['demandes.messages.index']
      store: typeof routes['demandes.messages.store']
    }
  }
  appelsOffres: {
    appelsOffres: {
      index: typeof routes['appels_offres.appels_offres.index']
      show: typeof routes['appels_offres.appels_offres.show']
    }
    offres: {
      store: typeof routes['appels_offres.offres.store']
    }
  }
  mesOffres: {
    offres: {
      index: typeof routes['mes_offres.offres.index']
    }
  }
  documents: {
    documents: {
      store: typeof routes['documents.documents.store']
      index: typeof routes['documents.documents.index']
      download: typeof routes['documents.documents.download']
      destroy: typeof routes['documents.documents.destroy']
    }
  }
  admin: {
    adminDemandes: {
      index: typeof routes['admin.admin_demandes.index']
      show: typeof routes['admin.admin_demandes.show']
      valider: typeof routes['admin.admin_demandes.valider']
      rejeter: typeof routes['admin.admin_demandes.rejeter']
      cloturer: typeof routes['admin.admin_demandes.cloturer']
    }
    adminAppelsOffres: {
      store: typeof routes['admin.admin_appels_offres.store']
      index: typeof routes['admin.admin_appels_offres.index']
    }
    adminOffres: {
      comparatif: typeof routes['admin.admin_offres.comparatif']
      selectionner: typeof routes['admin.admin_offres.selectionner']
      rejeter: typeof routes['admin.admin_offres.rejeter']
      envoyerOffreFinale: typeof routes['admin.admin_offres.envoyer_offre_finale']
    }
    adminUsers: {
      index: typeof routes['admin.admin_users.index']
      pendingEntreprises: typeof routes['admin.admin_users.pending_entreprises']
      show: typeof routes['admin.admin_users.show']
      validerEntreprise: typeof routes['admin.admin_users.valider_entreprise']
      suspendre: typeof routes['admin.admin_users.suspendre']
      reactiver: typeof routes['admin.admin_users.reactiver']
      destroy: typeof routes['admin.admin_users.destroy']
    }
    adminAnalytics: {
      dashboard: typeof routes['admin.admin_analytics.dashboard']
    }
    notifications: {
      types: typeof routes['admin.notifications.types']
      settings: typeof routes['admin.notifications.settings']
      toggleType: typeof routes['admin.notifications.toggle_type']
    }
  }
}
