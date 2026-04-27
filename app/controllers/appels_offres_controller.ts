import AppelOffre from '#models/appel_offre'
import Offre from '#models/offre'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AppelsOffresController {
  // Entreprise: liste des appels d'offres reçus
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'entreprise') return response.forbidden({ message: 'Accès refusé' })

    const appelsOffres = await AppelOffre.query()
      .whereHas('entreprises', (q) => q.where('users.id', user.id))
      .preload('demande' as any, (q: any) => {
        q.select(['id', 'type_forage', 'description', 'localisation_adresse', 'profondeur_estimee', 'delai_souhaite', 'statut', 'created_at'])
      })
      .orderBy('created_at', 'desc')

    if (appelsOffres.length === 0) {
      return response.ok({
        message: 'Aucun appel d\'offre reçu pour le moment.',
        data: [],
      })
    }

    const maintenant = DateTime.now()

    const result = await Promise.all(
      appelsOffres.map(async (ao) => {
        const delai = DateTime.fromJSDate(ao.delaiReponse as any)
        const resteSecondes = delai.diff(maintenant, 'seconds').seconds
        const expire = resteSecondes <= 0

        const offreSoumise = await Offre.query()
          .where('appel_offre_id', ao.id)
          .where('entreprise_id', user.id)
          .first()

        return {
          ...ao.toJSON(),
          compte_a_rebours: {
            expire,
            secondes_restantes: expire ? 0 : Math.floor(resteSecondes),
            delai_reponse: ao.delaiReponse,
          },
          ma_reponse: offreSoumise
            ? { soumise: true, statut: offreSoumise.statut, offre_id: offreSoumise.id }
            : { soumise: false, statut: null },
        }
      })
    )

    return response.ok({ message: `${result.length} appel(s) d'offre reçu(s).`, data: result })
  }

  // Entreprise: détail d'un appel d'offre (sans budget client)
  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'entreprise') return response.forbidden({ message: 'Accès refusé' })

    const ao = await AppelOffre.query()
      .where('id', params.id)
      .whereHas('entreprises', (q) => q.where('users.id', user.id))
      .preload('demande' as any, (q: any) => {
        q.select(['id', 'type_forage', 'description', 'localisation_adresse', 'localisation_lat', 'localisation_lng', 'profondeur_estimee', 'delai_souhaite', 'statut', 'created_at'])
      })
      .firstOrFail()

    const maintenant = DateTime.now()
    const delai = DateTime.fromJSDate(ao.delaiReponse as any)
    const resteSecondes = delai.diff(maintenant, 'seconds').seconds

    // Charger les documents de la demande (sans budget — CDC §3.2)
    const Document = (await import('#models/document')).default
    const documents = await Document.query()
      .where('entity_type', 'demande')
      .where('entity_id', ao.demandeId)

    return response.ok({
      ...ao.toJSON(),
      demande: {
        ...ao.demande?.toJSON(),
        documents: documents.map(d => ({ id: d.id, nomFichier: d.nomFichier, mimeType: d.mimeType })),
      },
      compte_a_rebours: {
        expire: resteSecondes <= 0,
        secondes_restantes: resteSecondes <= 0 ? 0 : Math.floor(resteSecondes),
        delai_reponse: ao.delaiReponse,
      },
    })
  }
}
