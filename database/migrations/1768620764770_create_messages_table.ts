import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('demande_id').unsigned().notNullable().references('id').inTable('demandes').onDelete('CASCADE')
      table.integer('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('receiver_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.text('contenu').notNullable()
      table.boolean('lu').notNullable().defaultTo(false)
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
