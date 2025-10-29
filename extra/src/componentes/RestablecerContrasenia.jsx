import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RestablecerContrasenia = () => {
  const [token, setToken] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Extraer el token de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token no proporcionado. Por favor, utiliza el enlace que se te envió por correo.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    // Validaciones
    if (!token) {
      setError('Token no válido.');
      return;
    }

    if (nuevaContrasenia !== confirmarContrasenia) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (nuevaContrasenia.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);

    try {
      // Realizar la solicitud al backend
      const response = await fetch('http://localhost:3000/api/v1/autenticacion/restablecer-contrasenia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          nuevaContrasenia
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Contraseña restablecida correctamente. Redirigiendo...');
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.mensaje || 'Error al restablecer la contraseña.');
      }
    } catch (error) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Restablecer Contraseña
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        
        {mensaje && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm text-center">{mensaje}</p>
          </div>
        )}

        {token ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nuevaContrasenia" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="nuevaContrasenia"
                value={nuevaContrasenia}
                onChange={(e) => setNuevaContrasenia(e.target.value)}
                required
                minLength="6"
                placeholder="Ingresa tu nueva contraseña"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmarContrasenia" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmarContrasenia"
                value={confirmarContrasenia}
                onChange={(e) => setConfirmarContrasenia(e.target.value)}
                required
                minLength="6"
                placeholder="Confirma tu nueva contraseña"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cargando}
            >
              {cargando ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              No se ha proporcionado un token válido. Por favor, utiliza el enlace que se te envió por correo.
            </p>
            <a 
              href="/recuperar-contrasenia" 
              className="text-blue-500 hover:text-blue-700 text-sm font-medium transition duration-200"
            >
              Solicitar nuevo enlace
            </a>
          </div>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition duration-200"
          >
            Volver al Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasenia;