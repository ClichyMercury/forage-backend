import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import EntrepriseProfile from '#models/entreprise_profile'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '365 days', // Token valide 1 an — expire uniquement à la déconnexion manuelle
  })
  declare currentAccessToken?: AccessToken

  @column()
  declare role: 'client' | 'entreprise' | 'admin'

  @column()
  declare userType: 'particulier' | 'entreprise' | null

  @column()
  declare isActive: boolean

  @column()
  declare avatarUrl: string | null

  @hasOne(() => EntrepriseProfile, { foreignKey: 'userId' })
  declare entrepriseProfile: HasOne<typeof EntrepriseProfile>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
