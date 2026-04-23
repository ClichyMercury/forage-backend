import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'appels_offres'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('demande_id').unsigned().notNullable().references('id').inTable('demandes').onDelete('CASCADE')
      table.integer('lance_par').unsigned().notNullable().references('id').inTable('users')
      table.datetime('delai_reponse').notNullable()
      table.enum('statut', ['ouvert', 'clos']).notNullable().defaultTo('ouvert')
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
