import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import PasswordResetToken from '#models/password_reset_token'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'

export default class PasswordResetController {

  /**
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword({ request, response }: HttpContext) {
    const { email } = request.only(['email'])

    if (!email) {
      return response.badRequest({ message: 'Email requis.' })
    }

    const user = await User.findBy('email', email)

    if (user) {
      await PasswordResetToken.query().where('email', email).delete()

      const rawToken = string.generateRandom(32)

      await PasswordResetToken.create({
        email,
        token: rawToken,
        expiresAt: DateTime.now().plus({ hours: 1 }),
      })

      try {
        const MailService = (await import('#services/mail_service')).default
        await MailService.resetPassword(email, {
          fullName: user.fullName ?? email,
          token: rawToken,
        })
      } catch (e) {
        console.error('Erreur email reset:', (e as any)?.message)
      }
    }

    return response.ok({
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
    })
  }

  /**
   * POST /api/v1/auth/reset-password
   */
  async resetPassword({ request, response }: HttpContext) {
    const { token, password, passwordConfirmation } = request.only([
      'token',
      'password',
      'passwordConfirmation',
    ])

    // Validation basique
    if (!token || !password || !passwordConfirmation) {
      return response.badRequest({ message: 'Tous les champs sont requis.' })
    }

    if (password !== passwordConfirmation) {
      return response.badRequest({ message: 'Les mots de passe ne correspondent pas.' })
    }

    if (password.length < 6) {
      return response.badRequest({ message: 'Le mot de passe doit contenir au moins 6 caractères.' })
    }

    // Chercher le token en base
    const resetToken = await PasswordResetToken.findBy('token', token)

    // Token inexistant ou expiré → même message d'erreur (sécurité)
    if (!resetToken || !resetToken.isValid()) {
      return response.badRequest({
        message: 'Ce lien est invalide ou a expiré. Faites une nouvelle demande.',
      })
    }

    // Trouver l'utilisateur associé à cet email
    const user = await User.findBy('email', resetToken.email)

    if (!user) {
      return response.badRequest({ message: 'Utilisateur introuvable.' })
    }

    // Mettre à jour le mot de passe
    // AdonisJS hash automatiquement le mot de passe grâce au hook beforeSave sur le modèle User
    user.password = password
    await user.save()

    // Supprimer le token — usage unique, ne peut plus être réutilisé
    await resetToken.delete()

    return response.ok({
      message: 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.',
    })
  }

  /**
   * GET /api/v1/auth/verify-reset-token?token=xxx

   */
  async verifyToken({ request, response }: HttpContext) {
    const { token } = request.qs()

    if (!token) {
      return response.badRequest({ message: 'Token manquant.' })
    }

    const resetToken = await PasswordResetToken.findBy('token', token)

    if (!resetToken || !resetToken.isValid()) {
      return response.ok({ valid: false, message: 'Lien invalide ou expiré.' })
    }

    return response.ok({ valid: true })
  }
}
