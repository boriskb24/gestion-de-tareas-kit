import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Tarea {
    id: number;
    texto: string;
    completada: boolean;
    fechaTermino: string | null;
}

interface Props {
    tareas: Tarea[];
}

// Helper para obtener el color de fondo según la fecha
const getBackgroundColor = (tarea: Tarea): string => {
    if (tarea.completada) return '#d4edda'; // Verde - Completada
    if (!tarea.fechaTermino) return '#f9f9f9'; // Gris claro - Sin fecha

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaTermino = new Date(tarea.fechaTermino);
    fechaTermino.setHours(0, 0, 0, 0);

    const diffDias = Math.ceil((fechaTermino.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return '#f8d7da'; // Rojo claro - Vencida
    if (diffDias <= 1) return '#fff3cd'; // Amarillo - Próxima a vencer
    return '#f9f9f9'; // Normal
};

// Helper para formatear fecha
const formatearFecha = (fechaStr: string | null): string => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Tareas({ tareas }: Props) {
    const [textoTarea, setTextoTarea] = useState<string>("")
    const [fechaTermino, setFechaTermino] = useState<string>("")

    const agregarTarea = () => {
        if (textoTarea === "") return

        router.post('/tareas', {
            texto: textoTarea,
            fechaTermino: fechaTermino || null
        }, {
            onSuccess: () => {
                setTextoTarea("")
                setFechaTermino("")
            }
        })
    }

    const toggleCompletada = (id: number, completada: boolean) => {
        router.put(`/tareas/${id}`, { completada: !completada })
    }


    const borrarTarea = (id: number) => {
        router.delete(`/tareas/${id}`)
    }

    const cerrarSesion = () => {
        router.post('/logout')
    }

    return (
        <div>
            <div style={{ position: 'relative', textAlign: 'center' }}>
                <h1 style={{ padding: '10px', width: 'fit-content', margin: '0 auto' }}>
                    Mis Tareas
                </h1>
                <button
                    onClick={cerrarSesion}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        fontSize: '14px'
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Escribe una tarea..."
                        style={{ padding: '8px', width: '250px' }}
                        value={textoTarea}
                        onChange={(e) => setTextoTarea(e.target.value)}
                    />
                    <input
                        type="date"
                        style={{ padding: '8px' }}
                        value={fechaTermino}
                        onChange={(e) => setFechaTermino(e.target.value)}
                        title="Fecha de término (opcional)"
                    />
                    <button
                        onClick={agregarTarea}
                        style={{ padding: '8px 15px', cursor: 'pointer' }}
                    >
                        Agregar
                    </button>
                </div>
                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    La fecha de término es opcional. Si la seleccionas, recibirás un recordatorio por email.
                </small>
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {tareas.map((tarea) => (
                        <li key={tarea.id} style={{
                            border: '1px solid gray',
                            padding: '10px',
                            margin: '10px auto',
                            width: '400px',
                            backgroundColor: getBackgroundColor(tarea),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderRadius: '5px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                <input
                                    type="checkbox"
                                    checked={tarea.completada}
                                    onChange={() => toggleCompletada(tarea.id, tarea.completada)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span style={{
                                        color: tarea.completada ? '#6c757d' : 'black',
                                        textDecoration: tarea.completada ? 'line-through' : 'none'
                                    }}>
                                        {tarea.texto}
                                    </span>
                                    {tarea.fechaTermino && (
                                        <small style={{ color: '#666', fontSize: '12px' }}>
                                            📅 {formatearFecha(tarea.fechaTermino)}
                                        </small>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => borrarTarea(tarea.id)}
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 10px',
                                    cursor: 'pointer',
                                    borderRadius: '5px'
                                }}
                            >
                                Borrar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
