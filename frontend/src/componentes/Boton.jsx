import React from "react";

const Boton = ({ 
    onClick, 
    children, 
    tipo = "" // Valor por defecto
  }) => {
    // Estilos base
    const baseStyles = "px-4 py-2 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    // Estilos según tipo
    const tipoStyles = {
      compra: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      login: "bg-gray-50 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
      // eliminar: "bg-red-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200",
      finalizarCompra: "mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200",
      seguirComprando: "mt-4 w-full bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded-md transition duration-200",
      // Agregar: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200",
      verMas:"bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      verUsuarios:"w-full bg-yellow-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200",
      agregarCarritoBoton: "w-full bg-green-500 hover:bg-green-600 text-white flex-1",
    }
  
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${tipoStyles[tipo]}`}
      >
        {children}
      </button>
    );
  };
  
  export default Boton;