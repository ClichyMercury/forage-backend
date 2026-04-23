import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 50).notNullable().unique()
      table.string('telephone', 14).nullable()
      table.string('password').notNullable()
      table.enum('role', ['client', 'entreprise', 'admin']).notNullable().defaultTo('client')
      table.enum('user_type', ['particulier', 'entreprise']).nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
