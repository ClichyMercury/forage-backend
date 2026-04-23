import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import Demande from '#models/demande'
import Offre from '#models/offre'

export default class OffreFinale extends BaseModel {
  static table = 'offres_finales'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare demandeId: number

  @column()
  declare offreId: number

  @column()
  declare prixFinalClient: number

  @column()
  declare margeAdmin: number

  @column()
  declare delaiExecution: number

  @column()
  declare resumePrestation: string | null

  @column()
  declare statut: 'envoyee' | 'acceptee' | 'refusee'

  @column()
  declare envoyePar: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Demande, { foreignKey: 'demandeId' })
  declare demande: BelongsTo<typeof Demande>

  @belongsTo(() => Offre, { foreignKey: 'offreId' })
  declare offre: BelongsTo<typeof Offre>

  @belongsTo(() => User, { foreignKey: 'envoyePar' })
  declare admin: BelongsTo<typeof User>
}
