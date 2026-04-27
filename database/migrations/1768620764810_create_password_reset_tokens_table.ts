import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'password_reset_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // L'email de l'utilisateur qui demande la réinitialisation
      table.string('email').notNullable().index()
      // Le token aléatoire sécurisé (haché en base pour plus de sécurité)
      table.string('token').notNullable().unique()
      // Date d'expiration : 1 heure après création
      table.datetime('expires_at').notNullable()
      table.datetime('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
