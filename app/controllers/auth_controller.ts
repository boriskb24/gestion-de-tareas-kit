import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
    /**
     * Registrar un nuevo usuario
     */
    async register({ request, response, session }: HttpContext) {
        const fullName = request.input('fullName')
        const email = request.input('email')
        const password = request.input('password')

        if (!email || !email.includes('@gmail.com')) {
            return response.badRequest({
                error: 'El email debe contener @ y ser de gmail (ejemplo: usuario@gmail.com)'
            })
        }

        if (!password || password.length < 4) {
            return response.badRequest({
                error: 'La contraseña debe tener al menos 4 caracteres'
            })
        }

        try {
            const user = await User.create({
                fullName: fullName,
                email: email,
                password: password,
            })

            // Guardar userId en la sesión
            session.put('userId', user.id)

            return response.redirect('/tareas')
        } catch (error) {
            return response.badRequest({
                error: 'El email ya está registrado'
            })
        }
    }

    /**
     * Iniciar sesión
     */
    async login({ request, response, session }: HttpContext) {
        const email = request.input('email')
        const password = request.input('password')

        if (!email || !password) {
            return response.badRequest({
                error: 'Debes ingresar email y contraseña'
            })
        }

        const user = await User.findBy('email', email)

        if (!user) {
            return response.badRequest({
                error: 'Email no registrado'
            })
        }

        const isValid = await hash.verify(user.password, password)

        if (!isValid) {
            return response.badRequest({
                error: 'Contraseña incorrecta'
            })
        }

        // Guardar userId en la sesión
        session.put('userId', user.id)

        return response.redirect('/tareas')
    }
}
