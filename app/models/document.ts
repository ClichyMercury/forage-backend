import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class Document extends BaseModel {
  static table = 'documents'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare entityType: 'demande' | 'offre'

  @column()
  declare entityId: number

  @column()
  declare nomFichier: string

  @column()
  declare chemin: string

  @column()
  declare mimeType: string | null

  @column()
  declare uploadedBy: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'uploadedBy' })
  declare uploader: BelongsTo<typeof User>
}
