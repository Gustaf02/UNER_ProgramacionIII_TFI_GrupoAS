import Header from "../componentes/Header";
import Footer from "../componentes/Footer"
import { useSalones } from "../contexto/SalonesContexto"
import Home from "../componentes/Home";


const HomePages = () => {
  const { salones } = useSalones()
  return (
    <>
      <Header />
      <Home />
      <Footer />  
    </>
  );
};

export default HomePages;
