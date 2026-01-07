import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'tasks'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.timestamp('fecha_termino').nullable()
            table.boolean('reminder_sent').defaultTo(false)
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('fecha_termino')
            table.dropColumn('reminder_sent')
        })
    }
}
