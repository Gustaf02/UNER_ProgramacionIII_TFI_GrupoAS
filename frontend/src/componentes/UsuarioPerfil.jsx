import React from 'react';
import { useUsuario } from '../contexto/UsuarioContexto'; // Ajusta la ruta según tu estructura

const UsuarioPerfil = () => {
  const { usuario, isAuthenticated, logout } = useUsuario();

  if (!isAuthenticated || !usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            No hay usuario autenticado
          </h2>
          <p className="text-gray-600 mt-2">
            Por favor inicia sesión para ver tu perfil
          </p>
        </div>
      </div>
    );
  }

  // Función para obtener el texto del tipo de usuario
  const obtenerTipoUsuario = (tipo) => {
    switch (tipo) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuario Empleado';
      case 3:
        return 'Usuario Cliente';
      default:
        return 'Tipo desconocido';
    }
  };

  // Función para formatear el token (mostrar solo parte)
  const formatearToken = (token) => {
    if (!token) return 'No disponible';
    return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
          <p className="opacity-90">Información detallada de tu cuenta</p>
        </div>

        {/* Información del usuario */}
        <div className="p-6 space-y-6">
          {/* Badge de tipo de usuario */}
          <div className="flex justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              usuario.tipo_usuario === 1 
                ? 'bg-red-100 text-red-800' 
                : usuario.tipo_usuario === 2 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
            }`}>
              {obtenerTipoUsuario(usuario.tipo_usuario)}
            </span>
          </div>

          {/* Información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">
                Nombre
              </label>
              <p className="text-lg font-semibold text-gray-800">
                {usuario.nombre || 'No especificado'}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">
                Apellido
              </label>
              <p className="text-lg font-semibold text-gray-800">
                {usuario.apellido || 'No especificado'}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">
                Nombre de Usuario
              </label>
              <p className="text-lg font-semibold text-gray-800">
                {usuario.username || usuario.nombre_usuario}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">
                ID de Usuario
              </label>
              <p className="text-lg font-semibold text-gray-800">
                {usuario.id || usuario.usuario_id}
              </p>
            </div>
          </div>

          {/* Token JWT */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Token JWT (parcial)
            </label>
            <div className="bg-gray-50 p-3 rounded-md">
              <code className="text-sm text-gray-700 break-all">
                {formatearToken(usuario.token)}
              </code>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Por seguridad, solo se muestra una parte del token
            </p>
          </div>

          {/* Información de permisos */}
          {usuario.tipo_usuario === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                Permisos de Administrador
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Crear y gestionar usuarios empleados</li>
                <li>• Acceso total al sistema</li>
                <li>• Permisos administrativos completos</li>
              </ul>
            </div>
          )}

          {usuario.tipo_usuario === 2 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                Permisos de Empleado
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Acceso a funciones específicas de empleado</li>
                <li>• Permisos limitados según su rol</li>
              </ul>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={logout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Cerrar Sesión
            </button>
            
            <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Última actualización: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsuarioPerfil;