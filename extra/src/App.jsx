import "./index.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSalones } from "./contexto/SalonesContexto.jsx";
import { useUsuario } from "./contexto/UsuarioContexto.jsx";
import HomePages from "./pages/HomePages.jsx";
import ListaPages from "./pages/ListaPages.jsx";
import NoFoundPages from "./pages/NoFoundPages.jsx";
import ResgistroUsuarioPages from "./pages/RegistroUsuarioPages.jsx";
import LoginPages from "./pages/LoginPages.jsx";
import RutaProtegida from "./autenticacion/RutaProtegida.jsx";
import UsuarioPerfilPages from "./pages/UsuarioPerfilPages.jsx";
//import AdminPages from "./pages/AdminPages.jsx";

function App() {
  const { loading } =
    useSalones();
  const { login, isAuthenticated } = useUsuario();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route
          path="/salones"
          element={
            <ListaPages
            />
          }
        />
        <Route path="/registro" element={<ResgistroUsuarioPages />}/>  
        <Route path="*" element={<NoFoundPages />} />
        <Route path="/login" element={<LoginPages login={login} />} />
        <Route path="/perfil" element={<UsuarioPerfilPages/>} />

      </Routes>
    </Router>
  );
}

export default App;