
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UsuarioProvider } from "./contexto/UsuarioContexto.jsx";
import { SalonesProvider } from "./contexto/SalonesContexto.jsx";
//import { AdminContexProvider } from "./contexto/AdminContex.jsx";
import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>

    <UsuarioProvider>
      {/* <AdminContexProvider> */}
      <SalonesProvider>
      <App />
      </SalonesProvider>
      {/* </AdminContexProvider> */}
    </UsuarioProvider>
  </StrictMode>
);