/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const TasksController = () => import('#controllers/tasks_controller')

// Páginas (GET)
router.group(() => {
    router.on('/').renderInertia('login')
    router.on('/registrarse').renderInertia('registrarse')
}).use(middleware.guest())

// Autenticación (POST)
router.post('/registrar', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout']).use(middleware.auth())

router.group(() => {
    router.get('/tareas', [TasksController, 'index'])
    router.post('/tareas', [TasksController, 'store'])
    router.put('/tareas/:id', [TasksController, 'update'])
    router.delete('/tareas/:id', [TasksController, 'destroy'])
}).use(middleware.auth())
