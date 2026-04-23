import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class Demande extends BaseModel {
  static table = 'demandes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare typeForage: 'eau' | 'geotechnique' | 'petrolier' | 'autre'

  @column()
  declare description: string

  @column()
  declare localisationAdresse: string

  @column()
  declare localisationLat: number | null

  @column()
  declare localisationLng: number | null

  @column()
  declare profondeurEstimee: number | null

  @column()
  declare budgetMax: number

  @column.date()
  declare delaiSouhaite: DateTime | null

  @column()
  declare statut:
    | 'en_attente'
    | 'validee'
    | 'appel_offre_lance'
    | 'offres_recues'
    | 'offre_envoyee'
    | 'acceptee'
    | 'refusee'
    | 'cloturee'

  @column()
  declare validatedBy: number | null

  @column.dateTime()
  declare validatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'clientId' })
  declare client: BelongsTo<typeof User>
}
