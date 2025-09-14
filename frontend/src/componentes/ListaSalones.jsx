import React from 'react';
import { useSalones } from '../contexto/SalonesContexto';

const ListaSalones = () => {
  const { salones, loading, error } = useSalones();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando salones disponibles...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-12 min-h-96 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className="text-red-800 text-xl font-semibold mb-2">
            Error al cargar
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {/* <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros Salones
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre los espacios perfectos para tu próximo evento. Cada salón ofrece comodidad y versatilidad para ocasiones especiales.
          </p>
        </div> */}

        {salones.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏢</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                No hay salones disponibles
              </h3>
              <p className="text-gray-600 text-lg">
                En este momento no contamos con salones disponibles. Por favor, intenta más tarde.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {salones.map(salon => (
              <div 
                key={salon.salon_id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 group"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {salon.titulo}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      salon.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {salon.activo ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 flex items-center">
                    <span className="w-5 mr-2">📍</span>
                    {salon.direccion}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Capacidad:</span>
                      <span className="text-gray-900 font-semibold">
                        {salon.capacidad} personas
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Precio:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${parseFloat(salon.importe).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                    Solicitar información
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaSalones;