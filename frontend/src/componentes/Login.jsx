import React, { useState } from 'react';
import { useUsuario } from '../contexto/UsuarioContexto'; // Ajusta la ruta según tu estructura

const Login = () => {
  const [credenciales, setCredenciales] = useState({
    nombre_usuario: '',
    contrasenia: ''
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const { login, isLoading, error } = useUsuario();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica en el frontend
    if (!credenciales.nombre_usuario.trim() || !credenciales.contrasenia.trim()) {
      alert('Por favor, complete todos los campos');
      return;
    }

    try {
      // Pasar las credenciales como objeto completo
      await login(credenciales);
      // Redirección después de login exitoso
    } catch (error) {
      console.error('Error en login:', error);
      // El error ya se maneja en el contexto con SweetAlert
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nombre_usuario" className="block text-sm font-medium text-gray-700">
              Usuario:
            </label>
            <input
              type="text"
              id="nombre_usuario"
              name="nombre_usuario"
              value={credenciales.nombre_usuario}
              onChange={handleChange}
              placeholder="Ingrese su nombre de usuario"
              required
              autoComplete="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700">
              Contraseña:
            </label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="contrasenia"
                name="contrasenia"
                value={credenciales.contrasenia}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:text-blue-700"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </div>
            ) : "Iniciar Sesión"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">
              Error: {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;