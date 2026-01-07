import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

interface PageProps {
    [key: string]: unknown;
    flash?: {
        error?: string;
    };
}

export default function Registrarse() {
    const { props } = usePage<PageProps>();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (props.flash?.error) {
            setError(props.flash.error);
        }
    }, [props.flash]);

    const handleRegistro = () => {
        if (!nombre || nombre.length < 2) {
            setError('El nombre debe tener al menos 2 caracteres');
            return;
        }

        if (!email.includes('@gmail.com')) {
            setError('El email debe ser de Gmail (ejemplo: usuario@gmail.com)');
            return;
        }

        if (password.length < 4) {
            setError('La contraseña debe tener al menos 4 caracteres');
            return;
        }

        setError('');
        router.post('/registrar', { fullName: nombre, email, password });
    };

    return (
        <>
            <div>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ padding: '10px', width: 'fit-content', margin: '0 auto' }}>
                        Registrarse
                    </h1>
                </div>

                {/* Mostrar error si existe */}
                {error && (
                    <div style={{
                        textAlign: 'center',
                        color: 'red',
                        marginTop: '10px',
                        padding: '10px',
                        backgroundColor: '#ffe0e0',
                        borderRadius: '5px',
                        maxWidth: '300px',
                        margin: '10px auto'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Nombre completo..."
                        style={{ padding: '8px', width: '250px' }}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <input
                        type="email"
                        placeholder="Escribe correo..."
                        style={{ padding: '8px', width: '250px' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <input
                        type="password"
                        placeholder="Escribe contraseña..."
                        style={{ padding: '8px', width: '250px' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        onClick={handleRegistro}
                        style={{
                            padding: '8px 15px',
                            cursor: 'pointer',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        Registrarse
                    </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link
                        href="/"
                        style={{ padding: '8px 15px', cursor: 'pointer', textDecoration: 'none' }}
                    >
                        Volver
                    </Link>
                </div>
            </div>
        </>
    )
}