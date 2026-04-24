import Demande from '#models/demande'
import Document from '#models/document'
import Notification from '#models/notification'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AdminDemandesController {
  // Vue centralisée de toutes les demandes avec filtres (CDC §3.3)
  async index({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const { statut, typeForage, region, dateDebut, dateFin, page = 1, limit = 20 } = request.qs()

    const query = Demande.query()
      .preload('client')
      .orderBy('created_at', 'desc')

    if (statut) query.where('statut', statut)
    if (typeForage) query.where('type_forage', typeForage)
    if (region) query.where('localisation_adresse', 'like', `%${region}%`)
    if (dateDebut) query.where('created_at', '>=', dateDebut)
    if (dateFin) query.where('created_at', '<=', dateFin)

    const demandes = await query.paginate(page, limit)
    return response.ok(demandes)
  }

  // Détail d'une demande avec budget confidentiel + documents (CDC §3.3)
  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const demande = await Demande.query()
      .where('id', params.id)
      .preload('client')
      .firstOrFail()

    const documents = await Document.query()
      .where('entity_type', 'demande')
      .where('entity_id', demande.id)

    return response.ok({ ...demande.toJSON(), documents })
  }

  // Valider une demande (CDC §3.3)
  async valider({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const demande = await Demande.findOrFail(params.id)
    if (demande.statut !== 'en_attente') {
      return response.badRequest({ message: `Impossible de valider une demande avec le statut "${demande.statut}"` })
    }

    demande.statut = 'validee'
    demande.validatedBy = user.id
    demande.validatedAt = DateTime.now()
    await demande.save()

    // Notification interne + email au client (CDC §3.1)
    await Notification.create({
      userId: demande.clientId,
      type: 'demande_validee',
      canal: 'interne',
      contenu: `Votre demande #${demande.id} a été validée et est en cours de traitement.`,
      lu: false,
    })

    try {
      const User = (await import('#models/user')).default
      const client = await User.findOrFail(demande.clientId)
      const MailService = (await import('#services/mail_service')).default
      await MailService.statutDemande(client.email, {
        fullName: client.fullName ?? client.email,
        demandeId: demande.id,
        statut: 'validee',
      })
    } catch (e) {
      console.error('Erreur email:', (e as any)?.message ?? e)
    }

    return response.ok({ message: 'Demande validée avec succès.', demande })
  }

  // Clôturer une demande (après acceptation — chantier terminé)
  async cloturer({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const demande = await Demande.findOrFail(params.id)
    if (demande.statut !== 'acceptee') {
      return response.badRequest({ message: `Impossible de clôturer une demande avec le statut "${demande.statut}". La demande doit être acceptée.` })
    }

    demande.statut = 'cloturee'
    await demande.save()

    // Notifier le client
    await Notification.create({
      userId: demande.clientId,
      type: 'demande_validee',
      canal: 'interne',
      contenu: `Votre dossier #${demande.id} a été clôturé. Le chantier est terminé.`,
      lu: false,
    })

    return response.ok({ message: 'Dossier clôturé avec succès.', demande })
  }
  async rejeter({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const demande = await Demande.findOrFail(params.id)
    if (demande.statut !== 'en_attente') {
      return response.badRequest({ message: `Impossible de rejeter une demande avec le statut "${demande.statut}"` })
    }

    demande.statut = 'refusee'
    demande.validatedBy = user.id
    demande.validatedAt = DateTime.now()
    await demande.save()

    // Notification interne + email au client
    await Notification.create({
      userId: demande.clientId,
      type: 'demande_rejetee',
      canal: 'interne',
      contenu: `Votre demande #${demande.id} a été rejetée par l'administrateur.`,
      lu: false,
    })

    try {
      const User = (await import('#models/user')).default
      const client = await User.findOrFail(demande.clientId)
      const MailService = (await import('#services/mail_service')).default
      await MailService.statutDemande(client.email, {
        fullName: client.fullName ?? client.email,
        demandeId: demande.id,
        statut: 'refusee',
      })
    } catch (e) {
      console.error('Erreur email:', (e as any)?.message ?? e)
    }

    return response.ok({ message: 'Demande rejetée.', demande })
  }
}
