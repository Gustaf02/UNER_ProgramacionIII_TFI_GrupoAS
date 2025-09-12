import Header from "../componentes/Header";
//import ListaProductos from "../componentes/ListaProductos";
import Footer from "../componentes/Footer";
import { useSalones } from "../contexto/SalonesContexto";
import LoginForm from "../componentes/Login";
import ListaSalones from "../componentes/ListaSalones";





const HomePages = () => {
  const { salones } = useSalones()
  

  return (
    <>
      <Header />
      <ListaSalones/>
    </>  
  );
};

export default HomePages;
//productos, handleAgregarCarrito