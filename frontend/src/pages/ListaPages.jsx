//import React,{ useEffect, useState }from "react";
//import ListaProductos from "../componentes/ListaProductos";
import Header from "../componentes/Header";
//import Footer from "../components/Footer";
import { useSalones } from "../contexto/SalonesContexto";
//import { useAdmin } from "../contexto/AdminContex";
import ListaSalones from "../componentes/ListaSalones";


const ListaPages = () => {
  const { productos } = useAdmin()
  const { handleAgregarCarrito, LOADER_URL, loading } = useSalones()

  return (
    <>
      <Header />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <img
            src={LOADER_URL}
            alt="Cargando productos..."
            className="w-40 h-40 object-contain animate-pulse"  // Tamaño reducido para elegancia
          />
        </div>
      ) : (
        <ListaSalones
        />
      )}
    </>
  );
};

export default ListaPages;