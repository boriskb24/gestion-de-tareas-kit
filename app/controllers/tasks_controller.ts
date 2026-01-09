import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'

export default class TasksController {
    // Mostrar tareas del usuario
    async index({ auth, inertia }: HttpContext) {
        const user = auth.getUserOrFail()
        const tareas = await Task.query().where('user_id', user.id).orderBy('id', 'desc')
        return inertia.render('tareas', { tareas })
    }

    // Crear nueva tarea
    async store({ request, auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const texto = request.input('texto')
        const fechaTermino = request.input('fechaTermino') || null
        const prioridad = request.input('prioridad') || 'media'

        await Task.create({
            userId: user.id,
            texto,
            completada: false,
            fechaTermino: fechaTermino,
            reminderSent: false,
            prioridad
        })
        return response.redirect('/tareas')
    }

    // Actualizar tarea (completada, texto, fecha, prioridad)
    async update({ params, request, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        const task = await Task.findOrFail(params.id)

        if (task.userId !== user.id) {
            return response.unauthorized('No tienes permiso para modificar esta tarea')
        }

        // Actualizar completada
        if (request.input('completada') !== undefined) {
            task.completada = request.input('completada')
        }

        // Actualizar texto
        if (request.input('texto')) {
            task.texto = request.input('texto')
        }

        // Actualizar fecha de término
        if (request.input('fechaTermino') !== undefined) {
            task.fechaTermino = request.input('fechaTermino') || null
            // Si se cambia la fecha, resetear el recordatorio
            if (task.fechaTermino) {
                task.reminderSent = false
            }
        }

        // Actualizar prioridad
        if (request.input('prioridad')) {
            task.prioridad = request.input('prioridad')
        }

        // Actualizar descripcion
        if (request.input('descripcion') !== undefined) {
            task.descripcion = request.input('descripcion') || null
        }

        // Actualizar subtasks
        if (request.input('subtasks') !== undefined) {
            task.subtasks = request.input('subtasks')
        }

        await task.save()
        return response.redirect('/tareas')
    }

    // Borrar tarea
    async destroy({ params, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        const task = await Task.findOrFail(params.id)

        if (task.userId !== user.id) {
            return response.unauthorized('No tienes permiso para eliminar esta tarea')
        }

        await task.delete()
        return response.redirect('/tareas')
    }
}