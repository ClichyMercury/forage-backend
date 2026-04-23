import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('entity_type', ['demande', 'offre']).notNullable()
      table.integer('entity_id').unsigned().notNullable()
      table.string('nom_fichier').notNullable()
      table.string('chemin').notNullable()
      table.string('mime_type').nullable()
      table.integer('uploaded_by').unsigned().notNullable().references('id').inTable('users')
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
