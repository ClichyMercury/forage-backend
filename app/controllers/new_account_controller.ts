import User from '#models/user'
import EntrepriseProfile from '#models/entreprise_profile'
import { signupValidator, signupEntrepriseValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class NewAccountController {
  // Inscription client (CDC §3.1)
  async store({ request, serialize }: HttpContext) {
    const { fullName, email, password, telephone, userType } =
      await request.validateUsing(signupValidator)

    const user = await User.create({
      fullName,
      email,
      password,
      telephone,
      role: 'client',
      userType: userType ?? null,
      isActive: true,
    })
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  // Inscription entreprise (CDC §3.2) — compte inactif jusqu'à validation admin
  async storeEntreprise({ request, serialize }: HttpContext) {
    const { email, password, telephone, raisonSociale, rccm, domaines, zonesGeographiques } =
      await request.validateUsing(signupEntrepriseValidator)

    const user = await User.create({
      email,
      password,
      telephone,
      role: 'entreprise',
      isActive: false,
    })

    await EntrepriseProfile.create({
      userId: user.id,
      raisonSociale,
      rccm: rccm ?? null,
      domaines,
      zonesGeographiques,
    })

    return serialize({
      message: "Compte entreprise créé. En attente de validation par l'administrateur.",
      user: UserTransformer.transform(user),
    })
  }
}
