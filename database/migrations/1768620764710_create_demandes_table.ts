import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'demandes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.enum('type_forage', ['eau', 'geotechnique', 'petrolier', 'autre']).notNullable()
      table.text('description').notNullable()
      table.string('localisation_adresse').notNullable()
      table.decimal('localisation_lat', 10, 7).nullable()
      table.decimal('localisation_lng', 10, 7).nullable()
      table.decimal('profondeur_estimee', 10, 2).nullable()
      table.decimal('budget_max', 15, 2).notNullable()
      table.date('delai_souhaite').nullable()
      table.enum('statut', [
        'en_attente',
        'validee',
        'appel_offre_lance',
        'offres_recues',
        'offre_envoyee',
        'acceptee',
        'refusee',
        'cloturee',
      ]).notNullable().defaultTo('en_attente')
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
