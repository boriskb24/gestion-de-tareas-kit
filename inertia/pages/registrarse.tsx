import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Registrarse() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Función para validar y enviar el formulario
    const handleRegistro = () => {
        // Validación: email debe contener @ y .gmail
        if (!email.includes('@gmail.com')) {
            setError('El email debe ser de Gmail (ejemplo: usuario@gmail.com)');
            return;
        }

        // Validación: contraseña no vacía y mínimo 4 caracteres
        if (password.length < 4) {
            setError('La contraseña debe tener al menos 4 caracteres');
            return;
        }

        // Limpiar error y enviar datos al servidor
        setError('');
        router.post('/registrar', { email, password });
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