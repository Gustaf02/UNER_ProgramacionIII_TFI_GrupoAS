import React, { createContext, useState, useEffect, useContext } from "react";

const API_URL = "http://localhost:3000/api/v1/salones";

/**
 * Contexto para manejar el estado global de los salones
 * Proporciona:
 * - Lista de salones disponibles
 * - Estado de carga y errores
 * - Funciones para manipular salones
 */
const SalonesContext = createContext();

/**
 * Proveedor del contexto de salones
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const SalonesProvider = ({ children }) => {
  // Estado para los salones disponibles
  const [salones, setSalones] = useState([]);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Manejo de errores
  const [error, setError] = useState(null);

  // URL para el loader de carga
  const LOADER_URL =
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif";

  /**
   * Efecto para cargar datos al montar el componente
   */
  useEffect(() => {
    const fetchSalones = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener el token del almacenamiento (localStorage, sessionStorage, etc.)
        const token = localStorage.getItem("authToken"); 

        // Configurar headers con el token
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Fetch de salones desde tu API con headers
        const response = await fetch(API_URL, {
          headers: headers,
        });

        if (!response.ok) {
          throw new Error(`Error en API de salones: ${response.status}`); 
        }

        const data = await response.json();
        const salonesArray = data.success ? data.data : data;
        const salonesConImagen = salonesArray.map((salon) => ({
          ...salon,
          imagen: "https://via.placeholder.com/300x200?text=Salón",
        }));

        setSalones(salonesConImagen);
      } catch (err) {
        console.error("Error cargando salones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalones();
  }, []);

  /**
   * Actualiza la lista de salones
   * @param {Array} nuevosSalones - Nueva lista de salones
   */
  const actualizarSalones = (nuevosSalones) => {
    setSalones(nuevosSalones);
  };

  /**
   * Agrega un nuevo salón
   * @param {Object} nuevoSalon - Salón a agregar
   */
  const agregarSalon = (nuevoSalon) => {
    setSalones((prev) => [
      ...prev,
      {
        ...nuevoSalon,
        imagen: "https://via.placeholder.com/300x200?text=Salón",
      },
    ]);
  };

  /**
   * Elimina un salón por ID
   * @param {number} salonId - ID del salón a eliminar
   */
  const eliminarSalon = (salonId) => {
    setSalones((prev) => prev.filter((salon) => salon.salon_id !== salonId));
  };

  /**
   * Actualiza un salón existente
   * @param {number} salonId - ID del salón a actualizar
   * @param {Object} datosActualizados - Nuevos datos del salón
   */
  const actualizarSalon = (salonId, datosActualizados) => {
    setSalones((prev) =>
      prev.map((salon) =>
        salon.salon_id === salonId ? { ...salon, ...datosActualizados } : salon
      )
    );
  };

  // Valor que será accesible para los componentes que consuman este contexto
  const value = {
    salones,
    loading,
    error,
    LOADER_URL,
    actualizarSalones,
    agregarSalon,
    eliminarSalon,
    actualizarSalon,
    setError,
  };

  return (
    <SalonesContext.Provider value={value}>{children}</SalonesContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de salones
 * @returns {Object} - Todos los valores del contexto
 */
export const useSalones = () => {
  const context = useContext(SalonesContext);
  if (!context) {
    throw new Error("useSalones debe ser usado dentro de un SalonesProvider");
  }
  return context;
};
