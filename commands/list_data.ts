import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import Task from '#models/task'
import User from '#models/user'

export default class ListData extends BaseCommand {
    static commandName = 'list:data'
    static description = 'Lista usuarios y tareas en la base de datos'

    static options: CommandOptions = {
        startApp: true,
    }

    async run() {
        this.logger.info('=== USUARIOS REGISTRADOS ===')
        const users = await User.all()

        if (users.length === 0) {
            this.logger.warning('No hay usuarios registrados')
        } else {
            for (const user of users) {
                console.log(`  ID: ${user.id} | Email: ${user.email} | Nombre: ${user.fullName || 'Sin nombre'}`)
            }
        }

        this.logger.info('\n=== TAREAS CON FECHA DE TÉRMINO ===')
        const tasks = await Task.query()
            .whereNotNull('fecha_termino')
            .preload('user')

        if (tasks.length === 0) {
            this.logger.warning('No hay tareas con fecha de término')
        } else {
            for (const task of tasks) {
                const estado = task.completada ? '✅' : '⏳'
                const reminder = task.reminderSent ? '📧 Enviado' : '📭 Pendiente'
                console.log(`  ${estado} ID: ${task.id} | Usuario: ${task.user?.email || 'N/A'} | Texto: ${task.texto}`)
                console.log(`     Fecha: ${task.fechaTermino?.toFormat('dd/MM/yyyy') || 'N/A'} | Recordatorio: ${reminder}`)
            }
        }
    }
}
