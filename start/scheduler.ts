
import scheduler from 'adonisjs-scheduler/services/main'

// Ejecutar el comando de recordatorios todos los días a las 8:00 AM
scheduler.command("send:reminders").dailyAt("08:00");