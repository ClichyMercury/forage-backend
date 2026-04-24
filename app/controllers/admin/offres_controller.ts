 import Offre from '#models/offre'
import OffreFinale from '#models/offre_finale'
import Demande from '#models/demande'
import AppelOffre from '#models/appel_offre'
import Notification from '#models/notification'
import { createOffreFinaleValidator } from '#validators/offre'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminOffresController {
  /**
   * GET /api/v1/admin/appels-offres/:appelOffreId/comparatif
   * CDC §3.3 — Tableau comparatif automatique des offres reçues
   */
  async comparatif({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const appelOffre = await AppelOffre.query().where('id', params.appelOffreId).firstOrFail()
    const demande = await Demande.findOrFail(appelOffre.demandeId)

    const offres = await Offre.query()
      .where('appel_offre_id', params.appelOffreId)
      .preload('entreprise' as any, (q: any) => q.select(['id', 'full_name', 'email']))
      .orderBy('prix_ttc', 'asc')

    if (offres.length === 0) {      return response.ok({
        message: "Aucune offre reçue pour cet appel d'offre.",
        appel_offre_id: appelOffre.id,
        budget_client: demande.budgetMax,
        comparatif: [],
      })
    }

    const budgetMax = parseFloat(demande.budgetMax as any)

    const DocumentModel = (await import('#models/document')).default

    const comparatif = await Promise.all(offres.map(async (offre, index) => {
      const prixTtc = parseFloat(offre.prixTtc as any)
      const margeDisponible = budgetMax - prixTtc
      const dansBudget = prixTtc <= budgetMax

      const documents = await DocumentModel.query()
        .where('entity_type', 'offre')
        .where('entity_id', offre.id)

      return {
        rang: index + 1,
        offre_id: offre.id,
        statut: offre.statut,
        entreprise: (offre as any).entreprise,
        prix_ht: parseFloat(offre.prixHt as any),
        prix_ttc: prixTtc,
        delai_execution_jours: offre.delaiExecution,
        description_technique: offre.descriptionTechnique,
        budget_client: budgetMax,
        marge_disponible: margeDisponible,
        dans_budget: dansBudget,
        meilleure_offre: index === 0 && dansBudget,
        created_at: offre.createdAt,
        documents: documents.map(d => ({ id: d.id, nomFichier: d.nomFichier, mimeType: d.mimeType })),
      }
    }))

    const offresDansBudget = comparatif.filter((o) => o.dans_budget)
    const meilleurPrixTtc = parseFloat(offres[0].prixTtc as any)

    return response.ok({
      appel_offre_id: appelOffre.id,
      demande_id: demande.id,
      budget_client: budgetMax,
      resume: {
        total_offres: offres.length,
        offres_dans_budget: offresDansBudget.length,
        meilleur_prix_ttc: meilleurPrixTtc,
        marge_max_disponible: budgetMax - meilleurPrixTtc,
      },
      comparatif,
      action_suivante: 'PATCH /api/v1/admin/offres/{offre_id}/selectionner',
    })
  }

  /**
   * PATCH /api/v1/admin/offres/:offreId/selectionner
   */
  async selectionner({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const offre = await Offre.findOrFail(params.offreId)

    if (offre.statut === 'retenue') {
      return response.badRequest({ message: 'Cette offre est déjà retenue' })
    }
    if (offre.statut === 'non_retenue') {
      return response.badRequest({ message: 'Cette offre a déjà été rejetée' })
    }

    const { margeAdmin, resumePrestation } = await request.validateUsing(
      (await import('#validators/offre')).retenirOffreValidator
    )

    const appelOffre = await AppelOffre.findOrFail(offre.appelOffreId)
    const demande = await Demande.findOrFail(appelOffre.demandeId)
    const prixTtc = parseFloat(offre.prixTtc as any)
    const budgetMax = parseFloat(demande.budgetMax as any)
    const prixFinalClient = prixTtc + margeAdmin
    const margeDisponible = budgetMax - prixTtc

    // Alerte automatique bloquante si prix_final > budget_client (CDC §3.3)
    if (prixFinalClient > budgetMax) {
      return response.badRequest({
        message: 'ALERTE: Le prix final proposé dépasse le budget du client.',
        calcul: {
          prix_prestataire_ttc: prixTtc,
          marge_admin_saisie: margeAdmin,
          prix_final_calcule: prixFinalClient,
          budget_client: budgetMax,
          depassement: prixFinalClient - budgetMax,
          marge_maximum_autorisee: margeDisponible,
        },
        action_requise: `Réduisez votre marge. Maximum autorisé: ${margeDisponible} FCFA`,
      })
    }

    // Marquer toutes les autres offres du même AO comme non_retenue
    await Offre.query()
      .where('appel_offre_id', offre.appelOffreId)
      .whereNot('id', offre.id)
      .update({ statut: 'non_retenue' })

    // Retenir (valider) cette offre
    offre.statut = 'retenue'
    await offre.save()

    demande.statut = 'offres_recues'
    await demande.save()

    await offre.load('entreprise' as any)

    return response.ok({
      message: "Offre retenue et validée. Passez à l'étape suivante : générer l'offre finale.",
      offre_retenue: {
        offre_id: offre.id,
        entreprise: (offre as any).entreprise,
        prix_ttc: prixTtc,
        marge_admin: margeAdmin,
        prix_final_prevu: prixFinalClient,
        budget_client: budgetMax,
        marge_restante: budgetMax - prixFinalClient,
      },
      resume_prestation_suggere: resumePrestation,
      action_suivante: `POST /api/v1/admin/demandes/${demande.id}/offre-finale`,
    })
  }

  /**
   * POST /api/v1/admin/demandes/:demandeId/offre-finale
   */
  async envoyerOffreFinale({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const demande = await Demande.findOrFail(params.demandeId)

    if (demande.statut !== 'offres_recues') {
      return response.badRequest({
        message: `Vous devez d'abord sélectionner une offre. Statut actuel: "${demande.statut}"`,
      })
    }

    // Récupérer automatiquement l'offre retenue
    const appelOffre = await AppelOffre.query().where('demande_id', demande.id).firstOrFail()
    const offreRetenue = await Offre.query()
      .where('appel_offre_id', appelOffre.id)
      .where('statut', 'retenue')
      .firstOrFail()

    const { resumePrestation, prixFinalClient, delaiExecution } =
      await request.validateUsing(createOffreFinaleValidator)

    const prixTtc = parseFloat(offreRetenue.prixTtc as any)
    const budgetMax = parseFloat(demande.budgetMax as any)
    const margeAdmin = prixFinalClient - prixTtc

    // Alerte automatique bloquante si prix_final > budget_client (CDC §3.3)
    if (prixFinalClient > budgetMax) {
      return response.badRequest({
        message: 'ALERTE: Le prix final proposé dépasse le budget du client.',
        calcul: {
          prix_prestataire_ttc: prixTtc,
          prix_final_saisi: prixFinalClient,
          budget_client: budgetMax,
          depassement: prixFinalClient - budgetMax,
          prix_maximum_autorise: budgetMax,
        },
        action_requise: `Le prix final ne doit pas dépasser ${budgetMax} FCFA`,
      })
    }

    // Génération du récapitulatif (CDC §3.3 : prestation, prix, délai)
    const offreFinale = await OffreFinale.create({
      demandeId: demande.id,
      offreId: offreRetenue.id,
      prixFinalClient,
      margeAdmin,
      delaiExecution,
      resumePrestation,
      statut: 'envoyee',
      envoyePar: user.id,
    })

    demande.statut = 'offre_envoyee'
    await demande.save()

    // Notification automatique au client (CDC §3.3)
    await Notification.create({
      userId: demande.clientId,
      type: 'offre_finale_envoyee',
      canal: 'interne',
      contenu: `Vous avez reçu une offre pour votre demande #${demande.id}. Prix: ${prixFinalClient} FCFA — Délai: ${delaiExecution} jours. Connectez-vous pour accepter ou refuser.`,
      lu: false,
    })

    await Notification.create({
      userId: offreRetenue.entrepriseId,
      type: 'offre_soumise',
      canal: 'interne',
      contenu: `Votre offre #${offreRetenue.id} a été retenue pour la demande #${demande.id}.`,
      lu: false,
    })

    // Emails (CDC §3.1 + §3.2)
    try {
      const MailService = (await import('#services/mail_service')).default
      const User = (await import('#models/user')).default

      const client = await User.findOrFail(demande.clientId)
      await MailService.offreFinaleClient(client.email, {
        fullName: client.fullName ?? client.email,
        demandeId: demande.id,
        prixFinalClient,
        delaiExecution,
        resumePrestation,
      })

      const entrepriseUser = await User.findOrFail(offreRetenue.entrepriseId)
      await MailService.decisionOffreEntreprise(entrepriseUser.email, {
        raisonSociale: entrepriseUser.fullName ?? entrepriseUser.email,
        offreId: offreRetenue.id,
        demandeId: demande.id,
        retenue: true,
      })
    } catch (e: any) {
      console.error('Erreur email:', e?.message ?? e)
    }

    return response.created({
      message: "Récapitulatif d'offre généré et envoyé au client avec succès.",
      recapitulatif: {
        prestation: resumePrestation,
        prix_final_client: prixFinalClient,
        delai_execution_jours: delaiExecution,
      },
      calcul: {
        prix_prestataire_ttc: prixTtc,
        marge_admin: margeAdmin,
        budget_client: budgetMax,
      },
      offre_finale_id: offreFinale.id,
    })
  }

  /**
   * PATCH /api/v1/admin/offres/:offreId/rejeter
   * CDC §3.3 — Rejeter une offre spécifique
   */
  async rejeter({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const offre = await Offre.findOrFail(params.offreId)

    if (offre.statut !== 'soumise') {
      return response.badRequest({
        message: `Impossible de rejeter une offre avec le statut "${offre.statut}"`,
      })
    }

    offre.statut = 'non_retenue'
    await offre.save()

    await Notification.create({
      userId: offre.entrepriseId,
      type: 'offre_refusee',
      canal: 'interne',
      contenu: `Votre offre #${offre.id} n'a pas été retenue.`,
      lu: false,
    })

    return response.ok({ message: 'Offre rejetée.', offre })
  }
}
