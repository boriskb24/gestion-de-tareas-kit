import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'tasks'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            // Subtareas almacenadas como JSON
            // Estructura: [{ texto: string, completada: boolean }]
            table.jsonb('subtasks').nullable()
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('subtasks')
        })
    }
}
