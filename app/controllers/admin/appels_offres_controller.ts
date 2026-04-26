import AppelOffre from '#models/appel_offre'
import Demande from '#models/demande'
import { createAppelOffreValidator } from '#validators/appel_offre'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AdminAppelsOffresController {
  // Admin: lancer un appel d'offre
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const { demandeId, entrepriseIds, delaiReponse } =
      await request.validateUsing(createAppelOffreValidator)

    const demande = await Demande.findOrFail(demandeId)
    if (demande.statut !== 'validee') {
      return response.badRequest({ message: 'La demande doit être validée avant de lancer un AO' })
    }

    const appelOffre = await AppelOffre.create({
      demandeId,
      lancePar: user.id,
      delaiReponse,
      statut: 'ouvert',
    })

    // Attacher les entreprises invitées
    const now = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
    type PivotRow = { notifie_at: string; created_at: string; updated_at: string }
    await appelOffre.related('entreprises').attach(
      entrepriseIds.reduce((acc: Record<number, PivotRow>, id: number) => {
        acc[id] = { notifie_at: now, created_at: now, updated_at: now }
        return acc
      }, {})
    )

    // Mettre à jour le statut de la demande
    demande.statut = 'appel_offre_lance'
    await demande.save()

    await appelOffre.load('entreprises')

    try {
      const MailService = (await import('#services/mail_service')).default
      const Notification = (await import('#models/notification')).default
      const EntrepriseProfile = (await import('#models/entreprise_profile')).default

      for (const entreprise of (appelOffre as any).entreprises) {
        // Notification interne
        await Notification.create({
          userId: entreprise.id,
          type: 'appel_offre_lance',
          canal: 'interne',
          contenu: `Vous avez été invité à soumettre une offre pour un forage (${demande.typeForage}) à ${demande.localisationAdresse}. Date limite: ${delaiReponse}.`,
          lu: false,
        })

        // Email
        const profile = await EntrepriseProfile.query().where('user_id', entreprise.id).first()
        await MailService.appelOffreEntreprise(entreprise.email, {
          raisonSociale: profile?.raisonSociale ?? entreprise.fullName ?? entreprise.email,
          appelOffreId: appelOffre.id,
          typeForage: demande.typeForage,
          localisation: demande.localisationAdresse,
          delaiReponse: delaiReponse.toFormat('dd/MM/yyyy'),
        })
      }
    } catch (e) {
      // Notifications non bloquantes
    }

    return response.created({
      message: `Appel d'offre lancé. ${entrepriseIds.length} entreprise(s) notifiée(s).`,
      appel_offre: appelOffre,
    })
  }

  // Admin: voir les appels d'offres
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const appelsOffres = await AppelOffre.query()
      .preload('demande')
      .preload('entreprises')
      .orderBy('created_at', 'desc')

    if (appelsOffres.length === 0) {
      return response.ok({
        message: 'Aucun appel d\'offre lancé pour le moment.',
        data: [],
      })
    }

    return response.ok({
      message: `${appelsOffres.length} appel(s) d'offre trouvé(s).`,
      data: appelsOffres,
    })
  }
}
