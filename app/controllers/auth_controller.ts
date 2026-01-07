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
            session.flash('error', 'El email debe contener @ y ser de gmail')
            return response.redirect().back()
        }

        if (!password || password.length < 4) {
            session.flash('error', 'La contraseña debe tener al menos 4 caracteres')
            return response.redirect().back()
        }

        try {
            const user = await User.create({
                fullName: fullName,
                email: email,
                password: password,
            })

            session.put('userId', user.id)
            return response.redirect('/tareas')
        } catch (error) {
            session.flash('error', 'El email ya está registrado')
            return response.redirect().back()
        }
    }

    /**
     * Iniciar sesión
     */
    async login({ request, response, session }: HttpContext) {
        const email = request.input('email')
        const password = request.input('password')

        if (!email || !password) {
            session.flash('error', 'Debes ingresar email y contraseña')
            return response.redirect().back()
        }

        const user = await User.findBy('email', email)

        if (!user) {
            session.flash('error', 'Email no registrado')
            return response.redirect().back()
        }

        const isValid = await hash.verify(user.password, password)

        if (!isValid) {
            session.flash('error', 'Contraseña incorrecta')
            return response.redirect().back()
        }

        session.put('userId', user.id)
        return response.redirect('/tareas')
    }
}
