import { useState, useEffect } from 'react';
import { ShoppingCartIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Servicios = ({ onAgregarServicios, serviciosExistentes = [] }) => {
  const [servicios, setServicios] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({});
  const [serviciosAgregados, setServiciosAgregados] = useState([]);
  const [editandoServicioId, setEditandoServicioId] = useState(null);
  const [cantidadEditada, setCantidadEditada] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar servicios agregados desde localStorage al inicializar
  useEffect(() => {
    const serviciosGuardados = localStorage.getItem('serviciosReserva');
    if (serviciosGuardados) {
      try {
        const serviciosData = JSON.parse(serviciosGuardados);
        // Validar que sea un array
        if (Array.isArray(serviciosData)) {
          setServiciosAgregados(serviciosData);
          
          // Convertir servicios agregados a formato de selección
          const seleccionados = {};
          serviciosData.forEach(servicio => {
            if (servicio && servicio.id) {
              seleccionados[servicio.id] = servicio.cantidad;
            }
          });
          setServiciosSeleccionados(seleccionados);
        }
      } catch (err) {
        console.error('Error al cargar servicios del localStorage:', err);
        localStorage.removeItem('serviciosReserva');
      }
    }
  }, []);

  // Cargar lista de servicios activo
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setError(null);
        const response = await fetch('http://localhost:3000/api/v1/servicios');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // VALIDACIÓN CRÍTICA: Asegurar que data es un array
        console.log('Respuesta de la API:', data); // Para debug
        
        if (Array.isArray(data)) {
          setServicios(data);
        } else if (data && Array.isArray(data.servicios)) {
          // Si la respuesta es un objeto que contiene un array "servicios"
          setServicios(data.servicios);
        } else if (data && Array.isArray(data.data)) {
          // Si la respuesta es un objeto que contiene un array "data"
          setServicios(data.data);
        } else {
          // Si no es un array, lo convertimos a array o usamos array vacío
          console.warn('La respuesta no es un array:', data);
          setServicios([]);
        }
      } catch (error) {
        console.error('Error fetching servicios:', error);
        setError('No se pudieron cargar los servicios. Intenta nuevamente.');
        setServicios([]); // Asegurar que siempre sea un array
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);


  // Guardar en localStorage cuando cambien los servicios agregados
  useEffect(() => {
    if (serviciosAgregados.length > 0) {
      localStorage.setItem('serviciosReserva', JSON.stringify(serviciosAgregados));
    } else {
      localStorage.removeItem('serviciosReserva');
    }
  }, [serviciosAgregados]);

  const incrementar = (servicioId) => {
    const servicio = servicios.find(s => s.id === servicioId);
    const stock = servicio?.stock || servicio?.activo || 0;
    const cantidadActual = serviciosSeleccionados[servicioId] || 0;

    if (cantidadActual < stock) {
      setServiciosSeleccionados(prev => ({
        ...prev,
        [servicioId]: cantidadActual + 1
      }));
    }
  };

  const decrementar = (servicioId) => {
    const cantidadActual = serviciosSeleccionados[servicioId] || 0;
    if (cantidadActual > 0) {
      setServiciosSeleccionados(prev => ({
        ...prev,
        [servicioId]: cantidadActual - 1
      }));
    }
  };

  const iniciarEdicion = (servicio) => {
    setEditandoServicioId(servicio.id);
    setCantidadEditada(servicio.cantidad);
  };

  const cancelarEdicion = () => {
    setEditandoServicioId(null);
    setCantidadEditada(0);
  };

  const confirmarEdicion = (servicioId) => {
    const servicio = servicios.find(s => s.id === servicioId);
    const stock = servicio?.stock || servicio?.activo || 0;
    
    if (cantidadEditada > 0 && cantidadEditada <= stock) {
      setServiciosSeleccionados(prev => ({
        ...prev,
        [servicioId]: cantidadEditada
      }));

      setServiciosAgregados(prev =>
        prev.map(serv =>
          serv.id === servicioId
            ? { ...serv, cantidad: cantidadEditada }
            : serv
        )
      );
    }
    setEditandoServicioId(null);
  };

  const eliminarServicio = (servicioId) => {
    setServiciosSeleccionados(prev => {
      const newSelection = { ...prev };
      delete newSelection[servicioId];
      return newSelection;
    });

    setServiciosAgregados(prev => prev.filter(serv => serv.id !== servicioId));
    setEditandoServicioId(null);
  };

  const agregarServicios = () => {
    const serviciosConCantidad = servicios
      .filter(servicio => serviciosSeleccionados[servicio.id] > 0)
      .map(servicio => ({
        ...servicio,
        cantidad: serviciosSeleccionados[servicio.id],
        costoTotal: servicio.importe * serviciosSeleccionados[servicio.id]
      }));

    if (serviciosConCantidad.length > 0) {
      setServiciosAgregados(serviciosConCantidad);
      
      if (onAgregarServicios) {
        onAgregarServicios(serviciosConCantidad);
      }
    }
  };

  const limpiarServicios = () => {
    setServiciosSeleccionados({});
    setServiciosAgregados([]);
    setEditandoServicioId(null);
    localStorage.removeItem('serviciosReserva');
    
    if (onAgregarServicios) {
      onAgregarServicios([]);
    }
  };

  // Cálculo de totales
  const calcularTotalServicios = () => {
    return serviciosAgregados.reduce((total, servicio) => {
      return total + (servicio.importe * servicio.cantidad);
    }, 0);
  };

  const totalServicios = calcularTotalServicios();
  const hayServiciosSeleccionados = Object.values(serviciosSeleccionados).some(cant => cant > 0);
  const hayServiciosAgregados = serviciosAgregados.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Cargando servicios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="galleryContainer">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicios Adicionales</h2>
      
      {/* Resumen de Servicios Agregados */}
      {hayServiciosAgregados && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Servicios en tu Reserva</h3>
            <button
              onClick={limpiarServicios}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Limpiar todos
            </button>
          </div>
          
          <div className="space-y-3">
            {serviciosAgregados.map((servicio) => {
              const costoTotal = servicio.importe * servicio.cantidad;
              
              return (
                <div key={servicio.id} className="flex justify-between items-center bg-white p-3 rounded border">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{servicio.nombre}</h4>
                    <p className="text-sm text-gray-600">
                      ${servicio.importe.toLocaleString()} x {servicio.cantidad} = 
                      <span className="font-semibold text-amber-600 ml-1">
                        ${costoTotal.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {editandoServicioId === servicio.id ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max={servicio.stock || servicio.activo}
                            value={cantidadEditada}
                            onChange={(e) => setCantidadEditada(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                          <button
                            onClick={() => confirmarEdicion(servicio.id)}
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => iniciarEdicion(servicio)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Editar cantidad"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => eliminarServicio(servicio.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Eliminar servicio"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total Servicios:</span>
              <span className="text-lg font-bold text-amber-600">
                ${totalServicios.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Servicios activo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map((servicio) => {
          const cantidad = serviciosSeleccionados[servicio.id] || 0;
          const costoTotal = cantidad * servicio.importe;
          const stock = servicio.stock || servicio.activo || 0;
          const puedeAgregar = stock > 0 && cantidad < stock;

          return (
            <div
              className="productCard relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
              key={servicio.id}
            >
              {/* Imagen del servicio */}
              {servicio.imagen && (
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={servicio.imagen}
                    alt={servicio.nombre}
                  />
                  <span className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    #{servicio.codigo || servicio.id}
                  </span>
                </div>
              )}

              {/* Contenido informativo */}
              <div className="p-4">
                {/* Nombre y importe */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                    {servicio.nombre}
                  </h3>
                  <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                    ${servicio.importe.toLocaleString()}
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {servicio.descripcion}
                </p>

                {/* Estado de disponibilidad */}
                <div className="mb-4">
                  <p
                    className={`text-xs font-medium py-1 px-2 rounded-full inline-flex items-center ${
                      !stock
                        ? "bg-red-100 text-red-800"
                        : stock < 3
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {!stock
                      ? "❌ No disponible"
                      : stock < 3
                      ? `⚠️ ${stock} activo`
                      : `✔️ ${stock} activo`}
                  </p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => decrementar(servicio.id)}
                      disabled={cantidad === 0}
                      className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200 focus:outline-none ${
                        cantidad === 0 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                      }`}
                    >
                      <span className="text-lg">−</span>
                    </button>

                    {cantidad > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 text-base font-bold text-gray-900">
                        {cantidad}
                      </span>
                    )}

                    <button
                      onClick={() => incrementar(servicio.id)}
                      disabled={!puedeAgregar}
                      className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200 focus:outline-none ${
                        !puedeAgregar
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                      }`}
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>

                  {costoTotal > 0 && (
                    <span className="text-sm font-semibold text-amber-600 ml-2">
                      ${costoTotal.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botones de acción */}
      <div className="mt-8 flex justify-center space-x-4">
        {hayServiciosSeleccionados && (
          <button
            onClick={agregarServicios}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {hayServiciosAgregados ? 'Actualizar Servicios' : 'Agregar a Reserva'}
            <ShoppingCartIcon className="h-5 w-5" />
          </button>
        )}

        {hayServiciosAgregados && (
          <button
            onClick={limpiarServicios}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Limpiar Todo
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Servicios;