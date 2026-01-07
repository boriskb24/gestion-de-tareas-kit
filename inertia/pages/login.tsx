import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'

interface PageProps {
  [key: string]: unknown;
  flash?: {
    error?: string;
  };
}

export default function Login() {
  const { props } = usePage<PageProps>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Mostrar error del servidor si existe
  useEffect(() => {
    if (props.flash?.error) {
      setError(props.flash.error);
    }
  }, [props.flash]);

  const handleLogin = () => {
    if (!email.includes('@gmail.com')) {
      setError('El email debe ser de Gmail (ejemplo: usuario@gmail.com)');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setError('');
    router.post('/login', { email, password });
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ padding: '10px', width: 'fit-content', margin: '0 auto' }}>
            Login
          </h1>
        </div>

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
            onClick={handleLogin}
            style={{
              padding: '8px 15px',
              cursor: 'pointer',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Iniciar sesión
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            href="/registrarse"
            style={{ padding: '8px 15px', cursor: 'pointer', textDecoration: 'none' }}
          >
            Registrarse
          </Link>
        </div>
      </div>
    </>
  )
}