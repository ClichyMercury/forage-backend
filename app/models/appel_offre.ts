import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import Demande from '#models/demande'

export default class AppelOffre extends BaseModel {
  static table = 'appels_offres'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare demandeId: number

  @column()
  declare lancePar: number

  @column.dateTime()
  declare delaiReponse: DateTime

  @column()
  declare statut: 'ouvert' | 'clos'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Demande, { foreignKey: 'demandeId' })
  declare demande: BelongsTo<typeof Demande>

  @belongsTo(() => User, { foreignKey: 'lancePar' })
  declare admin: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'appel_offre_entreprises',
    localKey: 'id',
    pivotForeignKey: 'appel_offre_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'entreprise_id',
    pivotColumns: ['notifie_at'],
  })
  declare entreprises: ManyToMany<typeof User>
}
