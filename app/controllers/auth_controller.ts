import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register_validator'
import { loginValidator } from '#validators/login_validator'

export default class AuthController {
    /**
     * Registrar un nuevo usuario
     */
    async register({ request, response, session, auth }: HttpContext) {
        const data = await request.validateUsing(registerValidator)

        try {
            const user = await User.create({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            })

            await auth.use('web').login(user)
            return response.redirect('/tareas')
        } catch (error) {
            session.flash('error', 'El email ya está registrado')
            return response.redirect().back()
        }
    }

    /**
     * Iniciar sesión
     */
    async login({ request, response, session, auth }: HttpContext) {
        const { email, password } = await request.validateUsing(loginValidator)

        try {
            const user = await User.verifyCredentials(email, password)
            await auth.use('web').login(user)
            return response.redirect('/tareas')
        } catch {
            session.flash('error', 'Credenciales inválidas')
            return response.redirect().back()
        }
    }

    /**
     * Cerrar sesión
     */
    async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect('/')
    }
}
