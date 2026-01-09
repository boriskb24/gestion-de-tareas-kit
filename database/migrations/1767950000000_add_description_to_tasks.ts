import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'tasks'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            // Descripción de la tarea (opcional)
            table.text('descripcion').nullable()
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('descripcion')
        })
    }
}
