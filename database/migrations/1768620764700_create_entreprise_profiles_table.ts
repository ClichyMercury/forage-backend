import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entreprise_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('raison_sociale').notNullable()
      table.string('rccm').nullable()
      table.json('domaines').nullable()
      table.json('zones_geographiques').nullable()
      table.integer('validated_by').unsigned().nullable().references('id').inTable('users')
      table.datetime('validated_at').nullable()
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
