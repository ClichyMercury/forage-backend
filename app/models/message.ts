import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import Demande from '#models/demande'

export default class Message extends BaseModel {
  static table = 'messages'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare demandeId: number

  @column()
  declare senderId: number

  @column()
  declare receiverId: number

  @column()
  declare contenu: string

  @column()
  declare lu: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Demande, { foreignKey: 'demandeId' })
  declare demande: BelongsTo<typeof Demande>

  @belongsTo(() => User, { foreignKey: 'senderId' })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'receiverId' })
  declare receiver: BelongsTo<typeof User>
}
