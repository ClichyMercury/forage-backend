import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('type').notNullable()
      table.enum('canal', ['email', 'sms', 'interne']).notNullable().defaultTo('interne')
      table.text('contenu').notNullable()
      table.boolean('lu').notNullable().defaultTo(false)
      table.datetime('envoye_at').nullable()
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
