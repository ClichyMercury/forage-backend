import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokensController {
  async store({ request, serialize, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    let user
    try {
      user = await User.verifyCredentials(email, password)
    } catch (err: any) {
      // L'exception InvalidCredentialsException du package @adonisjs/auth
      // a un message en anglais — on le remplace par un message FR clair.
      return response.unauthorized({
        message: 'Email ou mot de passe incorrect.',
      })
    }

    // Bloquer la connexion si le compte est inactif (CDC §3.2)
    if (!user.isActive) {
      return response.forbidden({
        message: 'Votre compte est en attente de validation. Vous recevrez un email dès qu\'il sera activé.',
      })
    }

    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async destroy({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return { message: 'Déconnexion réussie' }
  }
}
