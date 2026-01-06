import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'

export default class TasksController {
    // Mostrar tareas del usuario
    async index({ session, inertia }: HttpContext) {
        const userId = session.get('userId')

        if (!userId) {
            return inertia.render('login')
        }

        const tareas = await Task.query().where('user_id', userId).orderBy('id', 'desc')
        return inertia.render('tareas', { tareas })
    }

    // Crear nueva tarea
    async store({ request, session, response }: HttpContext) {
        const userId = session.get('userId')
        const texto = request.input('texto')

        if (!userId) {
            return response.redirect('/')
        }

        await Task.create({ userId, texto, completada: false })
        return response.redirect('/tareas')
    }

    // Marcar tarea como completada/no completada
    async update({ params, request, response }: HttpContext) {
        const task = await Task.findOrFail(params.id)
        task.completada = request.input('completada')
        await task.save()
        return response.redirect('/tareas')
    }

    // Borrar tarea
    async destroy({ params, response }: HttpContext) {
        const task = await Task.findOrFail(params.id)
        await task.delete()
        return response.redirect('/tareas')
    }
}