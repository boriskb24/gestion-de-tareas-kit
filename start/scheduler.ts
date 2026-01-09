
import scheduler from 'adonisjs-scheduler/services/main'

// Ejecutar el comando de recordatorios cada 3 minutos
scheduler.command("send:reminders").everyThreeMinutes();