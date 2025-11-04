import { useState, useEffect } from 'react';
import { useUsuario } from '../contexto/UsuarioContexto'; // Ajusta la ruta según tu estructura

const Reservas = () => {
  const { usuario, isAuthenticated } = useUsuario();
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);

  // Estados para filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      obtenerReservas();
    }
  }, [isAuthenticated]);

  const obtenerReservas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = usuario.token;
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('http://localhost:3000/api/v1/reservas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener las reservas`);
      }

      const data = await response.json();
      
      if (data.ok) {
        setReservas(data.data || []);
      } else {
        throw new Error(data.mensaje || 'Error al obtener reservas');
      }
    } catch (err) {
      console.error('Error obteniendo reservas:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarReserva = async (reservaId) => {
    try {
      const token = usuario?.token;
      
      const response = await fetch(`http://localhost:3000/api/v1/reservas/${reservaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al eliminar reserva`);
      }

      const data = await response.json();
      
      if (data.ok) {
        // Actualizar lista localmente
        setReservas(reservas.filter(reserva => reserva.reserva_id !== reservaId));
        
        // Mostrar mensaje de éxito
        alert('Reserva eliminada exitosamente');
      } else {
        throw new Error(data.mensaje || 'Error al eliminar reserva');
      }
    } catch (err) {
      console.error('Error eliminando reserva:', err);
      setError(err.message);
    }
  };

  const puedeEditar = () => {
    return usuario?.tipo_usuario === 1 || usuario?.tipo_usuario === 2;
  };

  const puedeEliminar = () => {
    return usuario?.tipo_usuario === 1 || usuario?.tipo_usuario === 2;
  };

  const formatearFecha = (fechaString) => {
    return new Date(fechaString).toLocaleDateString('es-ES');
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  // Filtrar reservas
  const reservasFiltradas = reservas.filter(reserva => {
    const coincideFecha = !filtroFecha || reserva.fecha_reserva === filtroFecha;
    const coincideEstado = !filtroEstado || reserva.activo === (filtroEstado === 'activas');
    return coincideFecha && coincideEstado;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para ver las reservas.</p>
          <a 
            href="/login" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 inline-block"
          >
            Ir al Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestión de Reservas
              </h1>
              <p className="text-gray-600">
                Bienvenido, {usuario?.nombre} {usuario?.apellido}
              </p>
            </div>
            
            {puedeEditar() && (
              <button 
                onClick={() => setMostrarModal(true)}
                className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Nueva Reserva
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Filtrar por fecha:
              </label>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Filtrar por estado:
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="activas">Activas</option>
                <option value="inactivas">Inactivas</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Acciones:
              </label>
              <button
                onClick={() => {
                  setFiltroFecha('');
                  setFiltroEstado('');
                }}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700 text-lg">Cargando reservas...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-center">
                Error: {error}
              </p>
              <button
                onClick={obtenerReservas}
                className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Reservas */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {reservasFiltradas.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 text-lg">
                  {reservas.length === 0 ? 'No hay reservas registradas.' : 'No se encontraron reservas con los filtros aplicados.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salón
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservasFiltradas.map((reserva) => (
                      <tr key={reserva.reserva_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{reserva.reserva_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatearFecha(reserva.fecha_reserva)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Salón {reserva.salon_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatearMoneda(reserva.importe_total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            reserva.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reserva.activo ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setReservaEditando(reserva)}
                              className="text-blue-500 hover:text-blue-700 transition duration-200"
                            >
                              Ver
                            </button>
                            {puedeEditar() && (
                              <button
                                onClick={() => {
                                  setReservaEditando(reserva);
                                  setMostrarModal(true);
                                }}
                                className="text-green-500 hover:text-green-700 transition duration-200"
                              >
                                Editar
                              </button>
                            )}
                            {puedeEliminar() && reserva.activo && (
                              <button
                                onClick={() => {
                                  if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
                                    eliminarReserva(reserva.reserva_id);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal para crear/editar reserva */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {reservaEditando ? 'Editar Reserva' : 'Nueva Reserva'}
              </h2>
              
              {/* Aquí iría el formulario de reserva */}
              <div className="space-y-4">
                <p className="text-gray-600">
                  Formulario para {reservaEditando ? 'editar' : 'crear'} reserva...
                </p>
                {/* Implementar formulario completo aquí */}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    setReservaEditando(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Lógica para guardar reserva
                    setMostrarModal(false);
                    setReservaEditando(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                  {reservaEditando ? 'Actualizar' : 'Crear'} Reserva
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservas;