import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'offres'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('appel_offre_id').unsigned().notNullable().references('id').inTable('appels_offres').onDelete('CASCADE')
      table.integer('entreprise_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.decimal('prix_ht', 15, 2).notNullable()
      table.decimal('prix_ttc', 15, 2).notNullable()
      table.integer('delai_execution').notNullable()
      table.text('description_technique').nullable()
      table.enum('statut', ['soumise', 'retenue', 'non_retenue']).notNullable().defaultTo('soumise')
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
