import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api/v1/servicios"; // Misma estructura que salones

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken"); 
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, { headers });

        if (!response.ok) {
          throw new Error(`Error en API de servicios: ${response.status}`); 
        }

        const data = await response.json();
        
        // MISMA VALIDACIÓN QUE SALONES
        const serviciosArray = Array.isArray(data) 
          ? data 
          : Array.isArray(data?.data) 
          ? data.data 
          : Array.isArray(data?.servicios) 
          ? data.servicios 
          : Array.isArray(data?.result) 
          ? data.result 
          : [];

        if (serviciosArray.length === 0) {
          console.warn("No se encontraron servicios en la respuesta:", data);
        }

        const serviciosConImagen = serviciosArray.map((servicio) => ({
          ...servicio,
          imagen: servicio.imagen || "https://via.placeholder.com/300x200?text=Servicio",
        }));

        setServicios(serviciosConImagen);
      } catch (err) {
        console.error("Error cargando servicios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="text-lg text-gray-600">Cargando servicios...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center py-8">
      <div className="text-red-600">Error: {error}</div>
    </div>
  );

  return (
    <div className="galleryContainer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {servicios.map(servicio => (
        <div
          className="productCard relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
          key={servicio.id}
        >
          {/* Imagen del servicio */}
          <div className="h-48 w-full overflow-hidden relative">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={servicio.imagen}
              alt={servicio.nombre}
            />
            <span className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              #{servicio.id}
            </span>
          </div>

          {/* Contenido informativo */}
          <div className="p-4">
            {/* Nombre y precio */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                {servicio.nombre}
              </h3>
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                ${servicio.precio ? servicio.precio.toLocaleString() : '0'}
              </span>
            </div>

            {/* Descripción */}
            {servicio.descripcion && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {servicio.descripcion}
              </p>
            )}

            {/* Categoría */}
            {servicio.categoria && (
              <div className="mb-4">
                <span className="text-xs font-medium py-1 px-2 rounded-full bg-blue-100 text-blue-800">
                  {servicio.categoria}
                </span>
              </div>
            )}

            {/* Estado de disponibilidad */}
            <div className="mb-4">
              <p className="text-xs font-medium py-1 px-2 rounded-full inline-flex items-center bg-emerald-100 text-emerald-800">
                ✅ Disponible
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Servicios;