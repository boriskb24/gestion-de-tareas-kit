import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import Task from '#models/task'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

export default class SendReminders extends BaseCommand {
    static commandName = 'send:reminders'
    static description = 'Envía recordatorios por email de las tareas que vencen hoy'

    static options: CommandOptions = {
        startApp: true,
    }

    async run() {
        this.logger.info('Buscando tareas con recordatorios pendientes...')

        const hoy = DateTime.now().startOf('day')
        const manana = hoy.plus({ days: 1 })

        // Buscar tareas que vencen hoy, no completadas, y sin recordatorio enviado
        const tareas = await Task.query()
            .where('completada', false)
            .where('reminder_sent', false)
            .whereNotNull('fecha_termino')
            .whereBetween('fecha_termino', [hoy.toSQL(), manana.toSQL()])

        this.logger.info(`Encontradas ${tareas.length} tareas con recordatorio pendiente`)

        for (const tarea of tareas) {
            try {
                // Obtener el usuario dueño de la tarea
                const user = await User.find(tarea.userId)
                if (!user) {
                    this.logger.warning(`Usuario no encontrado para tarea ${tarea.id}`)
                    continue
                }

                // Formatear la fecha
                const fechaFormateada = tarea.fechaTermino?.toFormat('dd/MM/yyyy') || 'Hoy'

                // Enviar email
                await mail.send((message) => {
                    message
                        .to(user.email)
                        .subject(`📋 Recordatorio: ${tarea.texto}`)
                        .htmlView('emails/task_reminder', {
                            user,
                            task: tarea,
                            fechaFormateada
                        })
                })

                // Marcar como enviado
                tarea.reminderSent = true
                await tarea.save()

                this.logger.success(`✅ Recordatorio enviado a ${user.email} para tarea: ${tarea.texto}`)
            } catch (error) {
                this.logger.error(`❌ Error enviando recordatorio para tarea ${tarea.id}: ${error.message}`)
            }
        }

        this.logger.info('Proceso de recordatorios completado')
    }
}
