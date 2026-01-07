import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Tarea {
    id: number;
    texto: string;
    completada: boolean;
}

interface Props {
    tareas: Tarea[];
}

export default function Tareas({ tareas }: Props) {
    const [textoTarea, setTextoTarea] = useState<string>("")

    const agregarTarea = () => {
        if (textoTarea === "") return

        router.post('/tareas', { texto: textoTarea }, {
            onSuccess: () => {
                setTextoTarea("")
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
                <input
                    type="text"
                    placeholder="Escribe una tarea..."
                    style={{ padding: '8px', width: '250px' }}
                    value={textoTarea}
                    onChange={(e) => setTextoTarea(e.target.value)}
                />
                <button
                    onClick={agregarTarea}
                    style={{ padding: '8px 15px', marginLeft: '10px', cursor: 'pointer' }}
                >
                    Agregar
                </button>
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {tareas.map((tarea) => (
                        <li key={tarea.id} style={{
                            border: '1px solid gray',
                            padding: '10px',
                            margin: '10px auto',
                            width: '350px',
                            backgroundColor: tarea.completada ? '#d4edda' : '#f9f9f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                                <span style={{
                                    color: tarea.completada ? '#6c757d' : 'black'
                                }}>
                                    {tarea.texto}
                                </span>
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