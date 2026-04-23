import Notification from '#models/notification'
import type { HttpContext } from '@adonisjs/core/http'

// Types de notifications gérés par la plateforme
const NOTIFICATION_TYPES = [
  'nouvelle_demande',
  'demande_validee',
  'demande_rejetee',
  'appel_offre_lance',
  'offre_soumise',
  'offre_finale_envoyee',
  'offre_acceptee',
  'offre_refusee',
  'compte_valide',
  'nouveau_message',
] as const

export default class NotificationsController {
  // Mes notifications
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const notifications = await Notification.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(50)

    return response.ok(notifications)
  }

  // Marquer comme lu
  async markRead({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const notification = await Notification.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()

    notification.lu = true
    await notification.save()

    return response.ok(notification)
  }

  // Marquer toutes comme lues
  async markAllRead({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await Notification.query()
      .where('user_id', user.id)
      .where('lu', false)
      .update({ lu: true })

    return response.ok({ message: 'Toutes les notifications marquées comme lues' })
  }

  // Admin: liste des types de notifications disponibles
  async types({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    return response.ok({ types: NOTIFICATION_TYPES })
  }

  // Admin: activer/désactiver un type de notification (stocké en base)
  async toggleType({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const { type } = params
    if (!NOTIFICATION_TYPES.includes(type as any)) {
      return response.badRequest({ message: 'Type de notification invalide' })
    }

    const { actif } = request.only(['actif'])

    // Stocker la préférence dans la table notification_settings
    const db = (await import('@adonisjs/lucid/services/db')).default
    await db.table('notification_settings').insert({ type, actif }).onConflict('type').merge()

    return response.ok({ type, actif, message: `Notification "${type}" ${actif ? 'activée' : 'désactivée'}` })
  }

  // Admin: état de tous les types de notifications
  async settings({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const db = (await import('@adonisjs/lucid/services/db')).default
    const settings = await db.from('notification_settings').select('*')

    // Fusionner avec les types connus (ceux non configurés = actifs par défaut)
    const result = NOTIFICATION_TYPES.map((type) => {
      const setting = settings.find((s: any) => s.type === type)
      return { type, actif: setting ? Boolean(setting.actif) : true }
    })

    return response.ok(result)
  }
}
