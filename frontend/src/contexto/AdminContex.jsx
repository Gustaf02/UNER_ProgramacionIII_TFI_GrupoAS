import React, { useEffect, useState, createContext, useContext } from "react";
const API_KEY = "9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125";
const MOCKAPI_URL = "https://67f5e9af913986b16fa5e489.mockapi.io/api/products"
export const AdminContex = createContext();

export const AdminContexProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [abrirEditor, setAbrirEditor] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: 0,
    cantidad: 0,
    codigo: 0,
    imagen: "",
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  // Función hash mejorada para generar un índice estable a partir de un string (ID)
  function hashId(str, max) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convierte a entero de 32 bits
    }
    return Math.abs(hash) % max;
  }

  // Fetch inicial de datos
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [imagesResponse, productosResponse] = await Promise.all([
        fetch("https://api.pexels.com/v1/search?query=sneakers+shoes&per_page=80&orientation=landscape&size=medium", {
          headers: { Authorization: API_KEY },
        }),
        fetch(MOCKAPI_URL),
      ]);

      if (!imagesResponse.ok) throw new Error("Error en API de imágenes");
      if (!productosResponse.ok) throw new Error("Error en API de productos");

      const [imagesData, productosData] = await Promise.all([
        imagesResponse.json(),
        productosResponse.json(),
      ]);

      setImagenes(imagesData.photos);

      // Combinar productos con sus imágenes usando hashId para asignación consistente
      const combinedData = productosData.map((producto) => {
        // Usamos el ID del producto para obtener siempre la misma imagen
        const imageIndex = hashId(
          producto.id.toString(),
          imagesData.photos.length
        );
        return {
          ...producto,
          imagen:
            imagesData.photos[imageIndex]?.src.medium ||
            "https://via.placeholder.com/300",
        };
      });

      setProductos(combinedData);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para agregar producto
  const agregarProducto = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://67f5e9af913986b16fa5e489.mockapi.io/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoProducto),
        }
      );

      if (!response.ok) throw new Error("Error al agregar producto");

      const productoAgregado = await response.json();

      // Asignar una imagen aleatoria del stock
      // const randomImage = imagenes[Math.floor(Math.random() * imagenes.length)]?.src.medium ||
      //                    "https://via.placeholder.com/300";

      setProductos([...productos, { ...productoAgregado }]);
      setNuevoProducto({
        nombre: "",
        precio: 0,
        cantidad: 0,
        codigo: 0,
        imagen: "",
      });
      setOpen(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para editar producto
  const editarProducto = async () => {
    if (!seleccionado) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://67f5e9af913986b16fa5e489.mockapi.io/api/products/${seleccionado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoProducto),
        }
      );

      if (!response.ok) throw new Error("Error al editar producto");

      const productoEditado = await response.json();

      setProductos(
        productos.map((p) =>
          p.id === seleccionado.id
            ? { ...productoEditado, imagen: p.imagen }
            : p
        )
      );
      setSeleccionado(null);
      setAbrirEditor(false);
      setNuevoProducto({
        nombre: "",
        precio: 0,
        cantidad: 0,
        codigo: 0,
        imagen: "",
      });
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar producto
  const eliminarProducto = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://67f5e9af913986b16fa5e489.mockapi.io/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Error al eliminar producto");

      setProductos(productos.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({
      ...nuevoProducto,
      [name]:
        name === "precio" || name === "cantidad" || name === "codigo"
          ? Number(value)
          : value,
    });
  };

  // Función para preparar la edición
  const prepararEdicion = (producto) => {
    setSeleccionado(producto);
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad,
      codigo: producto.codigo,
      imagen: producto.imagen,
    });
    setAbrirEditor(true);
  };
  const value = {
    loading,
    open,
    setOpen,
    productos,
    error,
    imagenes,
    abrirEditor,
    setAbrirEditor,
    nuevoProducto,
    setNuevoProducto,
    seleccionado,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    handleChange,
    prepararEdicion,
  };

  return <AdminContex.Provider value={value}>{children}</AdminContex.Provider>;
};

/**
 * Hook personalizado para acceder al contexto del carrito
 * @returns {Object} - Todos los valores del contexto
 */
export const useAdmin = () => {
  const context = useContext(AdminContex);
  if (!context) {
    throw new Error("useCarrito debe ser usado dentro de un CarritoProvider");
  }
  return context;
};