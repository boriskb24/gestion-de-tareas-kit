/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Páginas (GET)
router.on('/').renderInertia('login')
router.on('/registrarse').renderInertia('registrarse')

// Autenticación (POST)
const AuthController = () => import('#controllers/auth_controller')
router.post('/registrar', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])

const TasksController = () => import('#controllers/tasks_controller')
router.get('/tareas', [TasksController, 'index'])
router.post('/tareas', [TasksController, 'store'])
router.put('/tareas/:id', [TasksController, 'update'])
router.delete('/tareas/:id', [TasksController, 'destroy'])