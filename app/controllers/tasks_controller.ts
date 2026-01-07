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

        await Task.create({ userId: user.id, texto, completada: false })
        return response.redirect('/tareas')
    }

    // Marcar tarea como completada/no completada
    async update({ params, request, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        const task = await Task.findOrFail(params.id)
        
        if (task.userId !== user.id) {
            return response.unauthorized('No tienes permiso para modificar esta tarea')
        }
        
        task.completada = request.input('completada')
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