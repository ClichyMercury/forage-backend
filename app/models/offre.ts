import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import AppelOffre from '#models/appel_offre'

export default class Offre extends BaseModel {
  static table = 'offres'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare appelOffreId: number

  @column()
  declare entrepriseId: number

  @column()
  declare prixHt: number

  @column()
  declare prixTtc: number

  @column()
  declare delaiExecution: number

  @column()
  declare descriptionTechnique: string | null

  @column()
  declare statut: 'soumise' | 'retenue' | 'non_retenue'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => AppelOffre, { foreignKey: 'appelOffreId' })
  declare appelOffre: BelongsTo<typeof AppelOffre>

  @belongsTo(() => User, { foreignKey: 'entrepriseId' })
  declare entreprise: BelongsTo<typeof User>
}
