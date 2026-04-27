import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class PasswordResetToken extends BaseModel {
  static table = 'password_reset_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare token: string

  // Lucid convertit automatiquement les DateTime en SQL et vice-versa
  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Méthode utilitaire : est-ce que ce token est encore valide ?
  isValid(): boolean {
    return DateTime.now() < this.expiresAt
  }
}
