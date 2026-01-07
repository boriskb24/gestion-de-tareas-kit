# Gestión de Tareas Kit

Aplicación web de gestión de tareas construida con AdonisJS, Inertia.js y React.

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| **AdonisJS** | Backend (API, autenticación, rutas) |
| **Inertia.js** | Conexión entre backend y frontend |
| **React + TypeScript** | Frontend (interfaces de usuario) |
| **PostgreSQL** | Base de datos |
| **Docker** | Contenedor para PostgreSQL |

---

## Estructura del Proyecto

```
gestion-de-tareas-kit/
├── app/
│   ├── controllers/
│   │   ├── auth_controller.ts    # Login y registro
│   │   └── tasks_controller.ts   # CRUD de tareas
│   └── models/
│       ├── user.ts               # Modelo de usuario
│       └── task.ts               # Modelo de tarea
├── database/migrations/
│   ├── create_users_table.ts     # Tabla usuarios
│   └── create_tasks_table.ts     # Tabla tareas
├── inertia/pages/
│   ├── login.tsx                 # Página de login
│   ├── registrarse.tsx           # Página de registro
│   └── tareas.tsx                # Página de tareas
├── start/
│   └── routes.ts                 # Definición de rutas
├── docker-compose.yml            # Configuración PostgreSQL
└── .env                          # Variables de entorno
```

---

## Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/boriskb24/gestion-de-tareas-kit.git
cd gestion-de-tareas-kit
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` con:
```
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=tu_clave_secreta
NODE_ENV=development
SESSION_DRIVER=cookie
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password123
DB_DATABASE=tareas_db
```

### 4. Iniciar PostgreSQL con Docker
```bash
docker-compose up -d
```

### 5. Ejecutar migraciones
```bash
node ace migration:run
```

### 6. Iniciar servidor
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3333`

---

## Rutas de la API

### Páginas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página de login |
| GET | `/registrarse` | Página de registro |
| GET | `/tareas` | Página de tareas |

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/registrar` | Registrar nuevo usuario |
| POST | `/login` | Iniciar sesión |

### Tareas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tareas` | Obtener tareas del usuario |
| POST | `/tareas` | Crear nueva tarea |
| PUT | `/tareas/:id` | Actualizar tarea |
| DELETE | `/tareas/:id` | Eliminar tarea |

---

## Base de Datos

### Tabla: users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | ID único |
| full_name | string | Nombre completo |
| email | string | Email (único) |
| password | string | Contraseña encriptada |
| created_at | timestamp | Fecha de creación |

### Tabla: tasks
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | ID único |
| user_id | integer | ID del usuario (FK) |
| texto | string | Contenido de la tarea |
| completada | boolean | Estado de la tarea |
| created_at | timestamp | Fecha de creación |

---

## Comandos útiles

### Docker
```bash
docker-compose up -d        # Iniciar PostgreSQL
docker-compose down         # Detener PostgreSQL
docker start tareas_postgres  # Iniciar contenedor
docker stop tareas_postgres   # Detener contenedor
```

### Base de datos
```bash
# Ver usuarios
docker exec tareas_postgres psql -U postgres -d tareas_db -c "SELECT * FROM users;"

# Ver tareas
docker exec tareas_postgres psql -U postgres -d tareas_db -c "SELECT * FROM tasks;"

# Vaciar tablas
docker exec tareas_postgres psql -U postgres -d tareas_db -c "DELETE FROM tasks;"
docker exec tareas_postgres psql -U postgres -d tareas_db -c "DELETE FROM users;"
```

### Migraciones
```bash
node ace migration:run       # Ejecutar migraciones
node ace migration:rollback  # Revertir última migración
node ace migration:fresh     # Recrear todas las tablas
```

---

## Repositorio

**GitHub:** https://github.com/boriskb24/gestion-de-tareas-kit

**Ramas:**
- `main` - Rama principal
- `prueba` - Rama de prueba
