import "./index.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSalones } from "./contexto/SalonesContexto.jsx";
import { useUsuario } from "./contexto/UsuarioContexto.jsx";
import HomePages from "./pages/HomePages.jsx";
import ListaPages from "./pages/ListaPages.jsx";
import NoFoundPages from "./pages/NoFoundPages.jsx";
import CarritoPages from "./pages/CarritoPages.jsx";
import LoginPages from "./pages/LoginPages.jsx";
import RutaProtegida from "./autenticacion/RutaProtegida.jsx";
//import AdminPages from "./pages/AdminPages.jsx";

function App() {
  const { carrito, handleAgregarCarrito, productos, loading } =
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

        <Route path="*" element={<NoFoundPages />} />
        <Route path="/login" element={<LoginPages login={login} />} />

      </Routes>
    </Router>
  );
}

export default App;