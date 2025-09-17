import React, { useState } from 'react';
import { useUsuario } from '../contexto/UsuarioContexto'; // Ajusta la ruta según tu estructura

const RegistroUsuario = () => {
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    nombre_usuario: '',
    contrasenia: '',
    confirmar_contrasenia: '',
    celular: '',
    tipo_usuario: 3 // Por defecto cliente
  });
  
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const { crearUsuario, isLoading, error, usuario } = useUsuario();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones frontend
    if (!datosUsuario.nombre.trim() || 
        !datosUsuario.apellido.trim() || 
        !datosUsuario.nombre_usuario.trim() || 
        !datosUsuario.contrasenia.trim()) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (datosUsuario.contrasenia !== datosUsuario.confirmar_contrasenia) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (datosUsuario.contrasenia.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Preparar datos para enviar (sin confirmar_contrasenia)
      const { confirmar_contrasenia, ...datosEnvio } = datosUsuario;
      
      await crearUsuario(datosEnvio);
      
      // Limpiar formulario después de registro exitoso
      setDatosUsuario({
        nombre: '',
        apellido: '',
        nombre_usuario: '',
        contrasenia: '',
        confirmar_contrasenia: '',
        celular: '',
        tipo_usuario: 3
      });
      
    } catch (error) {
      console.error('Error en registro:', error);
      // El error ya se maneja en el contexto con SweetAlert
    }
  };

  // Determinar si el usuario actual es admin para mostrar opción de tipo_usuario
  const esAdmin = usuario && usuario.tipo_usuario === 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {esAdmin ? 'Crear Nuevo Usuario' : 'Registrarse'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre: *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={datosUsuario.nombre}
                onChange={handleChange}
                placeholder="Ingrese su nombre"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellido: *
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={datosUsuario.apellido}
                onChange={handleChange}
                placeholder="Ingrese su apellido"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="nombre_usuario" className="block text-sm font-medium text-gray-700">
              Nombre de Usuario: *
            </label>
            <input
              type="text"
              id="nombre_usuario"
              name="nombre_usuario"
              value={datosUsuario.nombre_usuario}
              onChange={handleChange}
              placeholder="Elija un nombre de usuario"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
              Celular:
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={datosUsuario.celular}
              onChange={handleChange}
              placeholder="Opcional"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {esAdmin && (
            <div className="space-y-2">
              <label htmlFor="tipo_usuario" className="block text-sm font-medium text-gray-700">
                Tipo de Usuario: *
              </label>
              <select
                id="tipo_usuario"
                name="tipo_usuario"
                value={datosUsuario.tipo_usuario}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={2}>Empleado</option>
                <option value={3}>Cliente</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700">
              Contraseña: *
            </label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="contrasenia"
                name="contrasenia"
                value={datosUsuario.contrasenia}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-green-500 hover:text-green-700"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmar_contrasenia" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña: *
            </label>
            <div className="relative">
              <input
                type={mostrarConfirmarPassword ? "text" : "password"}
                id="confirmar_contrasenia"
                name="confirmar_contrasenia"
                value={datosUsuario.confirmar_contrasenia}
                onChange={handleChange}
                placeholder="Repita su contraseña"
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-green-500 hover:text-green-700"
                onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
              >
                {mostrarConfirmarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {esAdmin ? 'Creando usuario...' : 'Registrando...'}
              </div>
            ) : esAdmin ? 'Crear Usuario' : 'Registrarse'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">
              Error: {error}
            </p>
          </div>
        )}

        {!esAdmin && (
          <p className="mt-4 text-sm text-gray-600 text-center">
            * Campos obligatorios
          </p>
        )}
      </div>
    </div>
  );
};

export default RegistroUsuario;