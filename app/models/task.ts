import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Task extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: number

    @column()
    declare texto: string

    @column()
    declare completada: boolean

    @column.dateTime()
    declare fechaTermino: DateTime | null

    @column()
    declare reminderSent: boolean

    @column()
    declare prioridad: 'baja' | 'media' | 'alta'

    @column()
    declare descripcion: string | null

    @column({
        prepare: (value: any) => JSON.stringify(value),
        consume: (value: any) => typeof value === 'string' ? JSON.parse(value) : value,
    })
    declare subtasks: { texto: string; completada: boolean }[] | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>
}