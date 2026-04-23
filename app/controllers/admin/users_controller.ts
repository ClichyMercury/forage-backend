import User from '#models/user'
import EntrepriseProfile from '#models/entreprise_profile'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AdminUsersController {
  /**
   * GET /api/v1/admin/users
   * CDC §3.3 — Liste de tous les utilisateurs avec filtre par rôle
   * ?role=client | entreprise | admin
   */
  async index({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const { role, page = 1, limit = 20 } = request.qs()

    const query = User.query()
      .orderBy('created_at', 'desc')

    if (role) query.where('role', role)

    const users = await query.paginate(page, limit)
    return response.ok(users)
  }

  /**
   * GET /api/v1/admin/users/pending-entreprises
   * CDC §3.3 — Entreprises en attente de validation
   */
  async pendingEntreprises({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const entreprises = await User.query()
      .where('role', 'entreprise')
      .where('is_active', false)
      .preload('entrepriseProfile')
      .orderBy('created_at', 'desc')

    return response.ok(entreprises)
  }

  /**
   * GET /api/v1/admin/users/:id
   * CDC §3.3 — Détail d'un utilisateur avec son profil entreprise si applicable
   */
  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const target = await User.findOrFail(params.id)

    let profile = null
    if (target.role === 'entreprise') {
      profile = await EntrepriseProfile.query()
        .where('user_id', target.id)
        .first()
    }

    return response.ok({ ...target.toJSON(), entreprise_profile: profile })
  }

  /**
   * PATCH /api/v1/admin/users/:id/valider
   * CDC §3.3 — Validation du compte entreprise avant activation
   */
  async validerEntreprise({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const entreprise = await User.findOrFail(params.id)

    if (entreprise.role !== 'entreprise') {
      return response.badRequest({ message: 'Cet utilisateur n\'est pas une entreprise' })
    }
    if (entreprise.isActive) {
      return response.badRequest({ message: 'Ce compte est déjà actif' })
    }

    entreprise.isActive = true
    await entreprise.save()

    await EntrepriseProfile.query()
      .where('user_id', entreprise.id)
      .update({
        validated_by: user.id,
        validated_at: DateTime.now().toSQL(),
      })

    // Email de confirmation à l'entreprise (CDC §3.2)
    try {
      const MailService = (await import('#services/mail_service')).default
      const profile = await EntrepriseProfile.query().where('user_id', entreprise.id).first()
      await MailService.compteEntrepriseValide(entreprise.email, {
        raisonSociale: profile?.raisonSociale ?? entreprise.fullName ?? entreprise.email,
      })
    } catch (e) {
      console.error('Erreur email:', (e as any)?.message ?? e)
    }

    return response.ok({
      message: 'Compte entreprise validé et activé avec succès.',
      entreprise,
    })
  }

  /**
   * PATCH /api/v1/admin/users/:id/suspendre
   * CDC §3.3 — Suspension d'un compte (client ou entreprise)
   * Le compte reste en base mais ne peut plus se connecter
   */
  async suspendre({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const target = await User.findOrFail(params.id)

    if (target.role === 'admin') {
      return response.forbidden({ message: 'Impossible de suspendre un compte administrateur' })
    }
    if (!target.isActive) {
      return response.badRequest({ message: 'Ce compte est déjà suspendu' })
    }

    target.isActive = false
    await target.save()

    return response.ok({
      message: `Compte de "${target.fullName}" suspendu avec succès.`,
      user: target,
    })
  }

  /**
   * PATCH /api/v1/admin/users/:id/reactiver
   * CDC §3.3 — Réactivation d'un compte suspendu
   */
  async reactiver({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const target = await User.findOrFail(params.id)

    if (target.isActive) {
      return response.badRequest({ message: 'Ce compte est déjà actif' })
    }

    target.isActive = true
    await target.save()

    return response.ok({
      message: `Compte de "${target.fullName}" réactivé avec succès.`,
      user: target,
    })
  }

  /**
   * DELETE /api/v1/admin/users/:id
   * CDC §3.3 — Suppression définitive d'un compte (client ou entreprise)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    const target = await User.findOrFail(params.id)

    if (target.role === 'admin') {
      return response.forbidden({ message: 'Impossible de supprimer un compte administrateur' })
    }

    await target.delete()

    return response.ok({
      message: `Compte de "${target.fullName}" supprimé définitivement.`,
    })
  }
}
