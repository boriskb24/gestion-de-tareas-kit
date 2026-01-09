import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Tarea {
    id: number;
    texto: string;
    completada: boolean;
    fechaTermino: string | null;
    prioridad: 'baja' | 'media' | 'alta';
    descripcion: string | null;
    subtasks: { texto: string; completada: boolean }[] | null;
}

interface SubTask {
    texto: string;
    completada: boolean;
}

interface Props {
    tareas: Tarea[];
}

// --- ESTILOS MODERNOS (CSS-in-JS simple) ---
const styles = {
    container: {
        backgroundColor: '#f4f6f8', // Gris muy suave
        minHeight: '100vh',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        padding: '40px 20px',
        color: '#343a40'
    },
    header: {
        maxWidth: '800px',
        margin: '0 auto 40px auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#212529',
        margin: 0
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: '#dc3545',
        border: '1px solid #dc3545',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s ease'
    },
    formCard: {
        maxWidth: '800px',
        margin: '0 auto 40px auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap' as const,
        alignItems: 'flex-end',
        border: '1px solid #eaedf0'
    },
    input: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%'
    },
    select: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: 'white',
        cursor: 'pointer'
    },
    addBtn: {
        backgroundColor: '#0d6efd',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 2px 4px rgba(13, 110, 253, 0.2)',
        transition: 'background-color 0.2s'
    },
    taskList: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: 0,
        listStyle: 'none'
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#6c757d',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    taskCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        border: '1px solid #f1f3f5',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
    },
    taskContent: {
        flex: 1
    },
    checkbox: {
        width: '24px',
        height: '24px',
        cursor: 'pointer',
        accentColor: '#198754'
    },
    tag: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        marginLeft: '8px'
    }
};

// --- HELPERS ---

// Helper para formatear fecha y hora
const formatearFecha = (fechaStr: string | null): string => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Helper para calcular días faltantes
const getDiasFaltantes = (fechaStr: string | null): string => {
    if (!fechaStr) return 'Sin fecha';
    const hoy = new Date();
    const fechaTermino = new Date(fechaStr);
    const diffMs = fechaTermino.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHoras = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffMs < 0) {
        return 'Vencida';
    } else if (diffHoras <= 24 && diffHoras > 0 && hoy.getDate() === fechaTermino.getDate()) {
        return `Hoy (${fechaTermino.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })})`;
    } else if (diffDias === 1) {
        return 'Mañana';
    } else {
        return `${diffDias} días`;
    }
};

// Helper color/emoji prioridad
const getPrioridadInfo = (prioridad: string) => {
    switch (prioridad) {
        case 'alta': return { color: '#fff5f5', text: '#e03131', label: 'Alta', border: '#ffc9c9' };
        case 'media': return { color: '#fff9db', text: '#f08c00', label: 'Media', border: '#ffe066' };
        case 'baja': return { color: '#ebfbee', text: '#2f9e44', label: 'Baja', border: '#b2f2bb' };
        default: return { color: '#f8f9fa', text: '#868e96', label: 'Normal', border: '#e9ecef' };
    }
};

const estaVencida = (fechaStr: string | null): boolean => {
    if (!fechaStr) return false;
    return new Date(fechaStr) < new Date();
};

const fechaParaInput = (fechaStr: string | null): string => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    const offset = fecha.getTimezoneOffset() * 60000;
    return (new Date(fecha.getTime() - offset)).toISOString().slice(0, 16);
};

// Ordenar tareas
const ordenarTareas = (tareas: Tarea[]): Tarea[] => {
    const pOrders = { alta: 1, media: 2, baja: 3 };
    return [...tareas].sort((a, b) => {
        if (a.completada !== b.completada) return a.completada ? 1 : -1;
        return pOrders[a.prioridad] - pOrders[b.prioridad];
    });
};

type CampoEdicion = 'texto' | 'fecha' | 'prioridad' | 'descripcion' | 'subtask' | null;

export default function Tareas({ tareas }: Props) {
    const [textoTarea, setTextoTarea] = useState<string>("")
    const [fechaTermino, setFechaTermino] = useState<string>("")
    const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>('media')

    // Estado edición
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [campoEditando, setCampoEditando] = useState<CampoEdicion>(null)
    const [editTexto, setEditTexto] = useState<string>("")
    const [editFecha, setEditFecha] = useState<string>("")
    const [editPrioridad, setEditPrioridad] = useState<'baja' | 'media' | 'alta'>('media')
    const [editDescripcion, setEditDescripcion] = useState<string>("")
    const [nuevaSubTarea, setNuevaSubTarea] = useState<string>("")

    // Estado Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const tareasPendientes = ordenarTareas(tareas.filter(t => !t.completada));
    const tareasCompletadas = tareas.filter(t => t.completada).sort((a, b) => b.id - a.id);

    const agregarTarea = () => {
        if (textoTarea === "") return;
        router.post('/tareas', { texto: textoTarea, fechaTermino: fechaTermino || null, prioridad }, {
            onSuccess: () => { setTextoTarea(""); setFechaTermino(""); setPrioridad('media'); }
        });
    }

    const toggleCompletada = (id: number, completada: boolean) => {
        router.put(`/tareas/${id}`, { completada: !completada });
    }

    // Iniciar borrado (abrir modal)
    const confirmarBorrado = (id: number) => {
        setTaskToDelete(id);
        setShowDeleteModal(true);
    }

    // Ejecutar borrado
    const ejecutarBorrado = () => {
        if (taskToDelete !== null) {
            router.delete(`/tareas/${taskToDelete}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setTaskToDelete(null);
                }
            });
        }
    }

    const cerrarModal = () => {
        setShowDeleteModal(false);
        setTaskToDelete(null);
    }

    const cerrarSesion = () => router.post('/logout');

    const iniciarEdicion = (tarea: Tarea, campo: CampoEdicion) => {
        setEditandoId(tarea.id); setCampoEditando(campo);
        setEditTexto(tarea.texto);
        setEditFecha(fechaParaInput(tarea.fechaTermino));
        setEditPrioridad(tarea.prioridad || 'media');
        setEditDescripcion(tarea.descripcion || "");
    }

    const guardarCampo = (id: number, campo: CampoEdicion) => {
        const datos: any = {};
        if (campo === 'texto') datos.texto = editTexto;
        if (campo === 'fecha') datos.fechaTermino = editFecha || null;
        if (campo === 'descripcion') datos.descripcion = editDescripcion;

        router.put(`/tareas/${id}`, datos, {
            onSuccess: () => { setEditandoId(null); setCampoEditando(null); }
        });
    }

    const guardarPrioridad = (id: number, val: any) => {
        router.put(`/tareas/${id}`, { prioridad: val }, {
            onSuccess: () => { setEditandoId(null); setCampoEditando(null); }
        });
    }

    // Subtareas
    const agregarSub = (tareaId: number, subs: SubTask[]) => {
        if (!nuevaSubTarea.trim()) return;
        const newSubs = [...(subs || []), { texto: nuevaSubTarea, completada: false }];
        router.put(`/tareas/${tareaId}`, { subtasks: newSubs } as any, { onSuccess: () => setNuevaSubTarea("") });
    }
    const toggleSub = (tareaId: number, subs: SubTask[], i: number) => {
        const newSubs = [...(subs || [])]; newSubs[i].completada = !newSubs[i].completada;
        router.put(`/tareas/${tareaId}`, { subtasks: newSubs } as any);
    }
    const delSub = (tareaId: number, subs: SubTask[], i: number) => {
        const newSubs = (subs || []).filter((_, idx) => idx !== i);
        router.put(`/tareas/${tareaId}`, { subtasks: newSubs } as any);
    }

    const handleKey = (e: any, id: number, campo: CampoEdicion) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); guardarCampo(id, campo); }
        if (e.key === 'Escape') { setEditandoId(null); setCampoEditando(null); }
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Mis Tareas</h1>
                <button onClick={cerrarSesion} style={styles.logoutBtn}>Cerrar Sesión</button>
            </div>

            {/* Formulario de creación */}
            <div style={styles.formCard}>
                <div style={{ flex: 2, minWidth: '250px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Nueva Tarea</label>
                    <input
                        type="text"
                        placeholder="Ej. Comprar leche..."
                        style={styles.input}
                        value={textoTarea}
                        onChange={e => setTextoTarea(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && agregarTarea()}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Vencimiento</label>
                    <input
                        type="datetime-local"
                        style={styles.input}
                        value={fechaTermino}
                        onChange={e => setFechaTermino(e.target.value)}
                    />
                </div>
                <div style={{ flex: 0.5, minWidth: '120px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Prioridad</label>
                    <select
                        style={{ ...styles.select, width: '100%' }}
                        value={prioridad}
                        onChange={e => setPrioridad(e.target.value as any)}
                    >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                <button onClick={agregarTarea} style={styles.addBtn}>Crear</button>
            </div>

            {/* Lista Pendientes */}
            <div style={styles.taskList}>
                <h2 style={styles.sectionTitle}>📋 Pendientes ({tareasPendientes.length})</h2>
                {tareasPendientes.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#adb5bd' }}>
                        <p style={{ fontSize: '1.2rem' }}>🎉 ¡Todo limpio por aquí!</p>
                        <p>No tienes tareas pendientes.</p>
                    </div>
                )}

                {tareasPendientes.map(tarea => {
                    const pInfo = getPrioridadInfo(tarea.prioridad);
                    const vencida = estaVencida(tarea.fechaTermino);
                    return (
                        <div key={tarea.id} style={{
                            ...styles.taskCard,
                            borderLeft: vencida ? '4px solid #dc3545' : `4px solid ${pInfo.color === '#f8f9fa' ? '#dee2e6' : pInfo.text}`
                        }}>
                            <input
                                type="checkbox"
                                checked={tarea.completada}
                                onChange={() => toggleCompletada(tarea.id, tarea.completada)}
                                style={styles.checkbox}
                            />

                            <div style={styles.taskContent}>
                                {/* Header de la tarea */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    {/* Titulo editable */}
                                    {editandoId === tarea.id && campoEditando === 'texto' ? (
                                        <input
                                            autoFocus
                                            value={editTexto}
                                            onChange={e => setEditTexto(e.target.value)}
                                            onBlur={() => guardarCampo(tarea.id, 'texto')}
                                            onKeyDown={e => handleKey(e, tarea.id, 'texto')}
                                            style={{ ...styles.input, padding: '4px 8px' }}
                                        />
                                    ) : (
                                        <span
                                            onDoubleClick={() => iniciarEdicion(tarea, 'texto')}
                                            style={{ fontSize: '1.1rem', fontWeight: '600', color: '#212529', cursor: 'text' }}
                                            title="Doble clic para editar"
                                        >
                                            {tarea.texto}
                                        </span>
                                    )}

                                    {/* Tags: Fecha y Prioridad */}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {/* Fecha */}
                                        {editandoId === tarea.id && campoEditando === 'fecha' ? (
                                            <input
                                                type="datetime-local"
                                                autoFocus
                                                value={editFecha}
                                                onChange={e => setEditFecha(e.target.value)}
                                                onBlur={() => guardarCampo(tarea.id, 'fecha')}
                                                style={{ ...styles.input, padding: '2px', fontSize: '12px', width: '130px' }}
                                            />
                                        ) : tarea.fechaTermino && (
                                            <span
                                                onDoubleClick={() => iniciarEdicion(tarea, 'fecha')}
                                                style={{
                                                    ...styles.tag,
                                                    backgroundColor: vencida ? '#fff5f5' : '#f8f9fa',
                                                    color: vencida ? '#e03131' : '#495057',
                                                    border: `1px solid ${vencida ? '#ffc9c9' : '#e9ecef'}`,
                                                    cursor: 'pointer'
                                                }}
                                                title={formatearFecha(tarea.fechaTermino)}
                                            >
                                                {vencida ? '⏰ Vencida' : `📅 ${getDiasFaltantes(tarea.fechaTermino)}`}
                                            </span>
                                        )}

                                        {/* Prioridad */}
                                        {editandoId === tarea.id && campoEditando === 'prioridad' ? (
                                            <select
                                                autoFocus
                                                value={editPrioridad}
                                                onChange={e => guardarPrioridad(tarea.id, e.target.value)}
                                                onBlur={() => { setEditandoId(null); setCampoEditando(null) }}
                                                style={{ ...styles.select, padding: '2px', fontSize: '12px', marginLeft: '8px' }}
                                            >
                                                <option value="baja">Baja</option>
                                                <option value="media">Media</option>
                                                <option value="alta">Alta</option>
                                            </select>
                                        ) : (
                                            <span
                                                onDoubleClick={() => iniciarEdicion(tarea, 'prioridad')}
                                                style={{
                                                    ...styles.tag,
                                                    backgroundColor: pInfo.color,
                                                    color: pInfo.text,
                                                    border: `1px solid ${pInfo.border}`,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {pInfo.label}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Descripción */}
                                {editandoId === tarea.id && campoEditando === 'descripcion' ? (
                                    <textarea
                                        autoFocus
                                        value={editDescripcion}
                                        onChange={e => setEditDescripcion(e.target.value)}
                                        onBlur={() => guardarCampo(tarea.id, 'descripcion')}
                                        onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) guardarCampo(tarea.id, 'descripcion'); if (e.key === 'Escape') { setEditandoId(null); setCampoEditando(null) } }}
                                        style={{ ...styles.input, minHeight: '60px', fontFamily: 'inherit', resize: 'vertical', marginBottom: '10px' }}
                                        placeholder="Descripción detallada..."
                                    />
                                ) : (
                                    <div
                                        onDoubleClick={() => iniciarEdicion(tarea, 'descripcion')}
                                        style={{
                                            fontSize: '0.95rem',
                                            color: tarea.descripcion ? '#495057' : '#adb5bd',
                                            whiteSpace: 'pre-wrap',
                                            cursor: 'text',
                                            marginBottom: '12px',
                                            fontStyle: tarea.descripcion ? 'normal' : 'italic'
                                        }}
                                    >
                                        {tarea.descripcion || "Haz doble clic para agregar una nota..."}
                                    </div>
                                )}

                                {/* Subtasks */}
                                <div style={{ marginTop: '12px' }}>
                                    {(tarea.subtasks || []).map((sub, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginLeft: '4px' }}>
                                            <input
                                                type="checkbox"
                                                checked={sub.completada}
                                                onChange={() => toggleSub(tarea.id, tarea.subtasks || [], idx)}
                                                style={{ width: '16px', height: '16px', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                            <span style={{
                                                flex: 1,
                                                fontSize: '0.9rem',
                                                color: sub.completada ? '#adb5bd' : '#495057',
                                                textDecoration: sub.completada ? 'line-through' : 'none'
                                            }}>
                                                {sub.texto}
                                            </span>
                                            <button
                                                onClick={() => delSub(tarea.id, tarea.subtasks || [], idx)}
                                                style={{ border: 'none', background: 'none', color: '#cea0a5', cursor: 'pointer', padding: '0 5px', fontSize: '16px' }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}

                                    <input
                                        placeholder="+ Agregar paso"
                                        value={editandoId === tarea.id && campoEditando === 'subtask' ? nuevaSubTarea : ""}
                                        onFocus={() => { setEditandoId(tarea.id); setCampoEditando('subtask'); }}
                                        onChange={e => setNuevaSubTarea(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && agregarSub(tarea.id, tarea.subtasks || [])}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            fontSize: '0.9rem',
                                            color: '#0d6efd',
                                            outline: 'none',
                                            padding: '4px',
                                            marginLeft: '24px',
                                            width: '150px'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Botón borrar */}
                            <button
                                onClick={() => confirmarBorrado(tarea.id)}
                                style={{
                                    border: 'none',
                                    background: 'white',
                                    color: '#dee2e6',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    padding: '4px',
                                    alignSelf: 'flex-start',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#dc3545'}
                                onMouseLeave={e => e.currentTarget.style.color = '#dee2e6'}
                                title="Eliminar tarea"
                            >
                                🗑️
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* COMPLETADAS */}
            {tareasCompletadas.length > 0 && (
                <div style={styles.taskList}>
                    <h2 style={{ ...styles.sectionTitle, color: '#198754', marginTop: '60px' }}>✅ Completadas ({tareasCompletadas.length})</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {tareasCompletadas.map(tarea => (
                            <li key={tarea.id} style={{
                                ...styles.taskCard,
                                opacity: 0.6,
                                backgroundColor: '#e9ecef',
                                boxShadow: 'none',
                                border: '1px solid #e9ecef'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={tarea.completada}
                                    onChange={() => toggleCompletada(tarea.id, tarea.completada)}
                                    style={styles.checkbox}
                                />
                                <div style={styles.taskContent}>
                                    <span style={{ textDecoration: 'line-through', color: '#495057', fontSize: '1rem' }}>
                                        {tarea.texto}
                                    </span>
                                    {/* Stats Resumen */}
                                    <div style={{ fontSize: '0.8rem', color: '#868e96', marginTop: '4px' }}>
                                        {tarea.subtasks?.length ? `${tarea.subtasks.filter(s => s.completada).length}/${tarea.subtasks.length} sub-tareas ` : ''}
                                        {tarea.prioridad !== 'media' && `• Prioridad ${tarea.prioridad}`}
                                    </div>
                                </div>
                                <button onClick={() => confirmarBorrado(tarea.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: 0.5 }}>🗑️</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN */}
            {showDeleteModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        textAlign: 'center',
                        maxWidth: '300px',
                        width: '90%'
                    }}>
                        <h3 style={{ marginTop: 0, color: '#dc3545' }}>⚠️ Confirmar Borrado</h3>
                        <p style={{ color: '#495057' }}>¿Estás seguro que deseas eliminar esta tarea permanentemente?</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
                            <button
                                onClick={cerrarModal}
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    color: '#495057',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={ejecutarBorrado}
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)'
                                }}
                            >
                                Borrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
