import Header from "../componentes/Header";
import Footer from "../componentes/Footer"
import RecuperarContrasenia from "../componentes/RecuperarContrasenia";


const RecuperarContraseniaPages = () => {
  const { salones } = useSalones()
  return (
    <>
      <Header />
      < RecuperarContrasenia/>
      <Footer />  
    </>
  );
};

export default RecuperarContraseniaPages;
