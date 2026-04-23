import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'offres_finales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('demande_id').unsigned().notNullable().references('id').inTable('demandes').onDelete('CASCADE')
      table.integer('offre_id').unsigned().notNullable().references('id').inTable('offres').onDelete('CASCADE')
      table.decimal('prix_final_client', 15, 2).notNullable()
      table.decimal('marge_admin', 15, 2).notNullable()
      table.integer('delai_execution').notNullable()
      table.text('resume_prestation').nullable()
      table.enum('statut', ['envoyee', 'acceptee', 'refusee']).notNullable().defaultTo('envoyee')
      table.integer('envoye_par').unsigned().notNullable().references('id').inTable('users')
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
