import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'appel_offre_entreprises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('appel_offre_id').unsigned().notNullable().references('id').inTable('appels_offres').onDelete('CASCADE')
      table.integer('entreprise_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.datetime('notifie_at').nullable()
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
