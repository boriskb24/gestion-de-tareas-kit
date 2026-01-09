import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'tasks'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            // Prioridad: 'baja', 'media', 'alta'
            table.string('prioridad', 10).defaultTo('media').notNullable()
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('prioridad')
        })
    }
}
