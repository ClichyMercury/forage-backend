import Message from '#models/message'
import Demande from '#models/demande'
import User from '#models/user'
import Notification from '#models/notification'
import { createMessageValidator } from '#validators/message'
import type { HttpContext } from '@adonisjs/core/http'

export default class MessagesController {
  /**
   * POST /api/v1/demandes/:demandeId/messages
   * Envoyer un message contextuel par demande (CDC §5.3)
   * Règle: Admin ↔ Client et Admin ↔ Entreprise uniquement
   * Les clients et entreprises ne communiquent JAMAIS directement
   */
  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const demande = await Demande.findOrFail(params.demandeId)

    // Vérifier que l'utilisateur a accès à cette demande
    if (user.role === 'client' && demande.clientId !== user.id) {
      return response.forbidden({ message: 'Accès refusé' })
    }

    // Entreprise: vérifier qu'elle est bien invitée sur un AO lié à cette demande
    if (user.role === 'entreprise') {
      const AppelOffre = (await import('#models/appel_offre')).default
      const ao = await AppelOffre.query()
        .where('demande_id', demande.id)
        .whereHas('entreprises', (q) => q.where('users.id', user.id))
        .first()

      if (!ao) return response.forbidden({ message: 'Accès refusé à cette demande' })
    }

    const { contenu } = await request.validateUsing(createMessageValidator)

    // Trouver l'admin destinataire automatiquement si l'expéditeur n'est pas admin
    let receiverId: number

    if (user.role !== 'admin') {
      // Client ou entreprise → envoie toujours à l'admin
      const admin = await User.query().where('role', 'admin').firstOrFail()
      receiverId = admin.id
    } else {
      // Admin → doit préciser le destinataire (client ou entreprise)
      const { receiverId: rid } = request.only(['receiverId'])
      if (!rid) return response.badRequest({ message: 'receiverId requis pour l\'admin' })

      const receiver = await User.findOrFail(rid)
      if (receiver.role === 'admin') {
        return response.badRequest({ message: 'Communication admin → admin non autorisée' })
      }
      receiverId = rid
    }

    const message = await Message.create({
      demandeId: demande.id,
      senderId: user.id,
      receiverId,
      contenu,
    })

    await message.load('sender')
    await message.load('receiver')

    // Notification interne au destinataire
    await Notification.create({
      userId: receiverId,
      type: 'nouveau_message',
      canal: 'interne',
      contenu: `Nouveau message de ${user.fullName ?? user.email} concernant la demande #${demande.id} : "${contenu.slice(0, 80)}${contenu.length > 80 ? '...' : ''}"`,
      lu: false,
    })

    // Email au destinataire (CDC §5.1 — notifications email à chaque étape clé)
    try {
      const receiver = await User.findOrFail(receiverId)
      const MailService = (await import('#services/mail_service')).default
      await MailService.nouveauMessage(receiver.email, {
        destinataire: receiver.fullName ?? receiver.email,
        expediteur: user.fullName ?? user.email,
        demandeId: demande.id,
        apercu: contenu.slice(0, 120),
      })
    } catch (e: any) {
      console.error('Erreur email message:', e?.message)
    }

    return response.created(message)
  }

  /**
   * GET /api/v1/demandes/:demandeId/messages
   * Lire les messages d'une demande (filtrés selon le rôle)
   */
  async index({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const demande = await Demande.findOrFail(params.demandeId)

    // Vérifier accès
    if (user.role === 'client' && demande.clientId !== user.id) {
      return response.forbidden({ message: 'Accès refusé' })
    }

    if (user.role === 'entreprise') {
      const AppelOffre = (await import('#models/appel_offre')).default
      const ao = await AppelOffre.query()
        .where('demande_id', demande.id)
        .whereHas('entreprises', (q) => q.where('users.id', user.id))
        .first()

      if (!ao) return response.forbidden({ message: 'Accès refusé à cette demande' })
    }

    const query = Message.query()
      .where('demande_id', demande.id)
      .preload('sender', (q) => q.select(['id', 'full_name', 'role']))
      .preload('receiver', (q) => q.select(['id', 'full_name', 'role']))
      .orderBy('created_at', 'asc')

    // Client et entreprise ne voient que leurs propres échanges avec l'admin
    if (user.role !== 'admin') {
      query.where((q) => {
        q.where('sender_id', user.id).orWhere('receiver_id', user.id)
      })
    }

    const messages = await query

    // Marquer les messages reçus comme lus
    await Message.query()
      .where('demande_id', demande.id)
      .where('receiver_id', user.id)
      .where('lu', false)
      .update({ lu: true })

    return response.ok(messages)
  }
}
