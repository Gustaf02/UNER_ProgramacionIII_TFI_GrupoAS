import { useState } from "react";
import { useUsuario } from "../contexto/UsuarioContexto";
import { useNavigate, NavLink } from "react-router-dom";
import Logo from "./Logo";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, logout, isAuthenticated } = useUsuario();

  // Función para renderizar la navegación según el tipo de usuario
  const renderNavigation = () => {
    if (!isAuthenticated || !usuario) return null;

    switch (usuario.tipo_usuario) {
      case 1: // Admin - Acceso completo
        return (
          <>
            <NavLink 
              to="/salones" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              Salones
            </NavLink>
            <NavLink 
              to="/servicios" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              Servicios
            </NavLink>
            <NavLink 
              to="/reservas" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              Reservas
            </NavLink>
            <NavLink 
              to="/usuarios" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              Usuarios
            </NavLink>
          </>
        );
      
      case 2: // Usuario con acceso a salones y usuarios
        return (
          <>
            <NavLink 
              to="/salones" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              Salones
            </NavLink>
            <NavLink 
              to="/usuarios" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              Usuarios
            </NavLink>
          </>
        );
      
      case 3: // Usuario con acceso solo a salones y reservas
        return (
          <>
            <NavLink 
              to="/salones" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              Salones
            </NavLink>
            <NavLink 
              to="/reservas" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              Reservas
            </NavLink>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <Logo/>
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
              <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Programación III
              </h1>
         
            </div>
                 {/* <p className="text-xs text-gray-400 mt-4">
            © {new Date().getFullYear()}
          </p> */}
          </div>

          {/* Navegación - Solo se muestra si hay usuario autenticado */}
          {isAuthenticated && usuario && (
            <nav className="hidden md:flex space-x-4">
              {renderNavigation()}
            </nav>
          )}

          {/* Área de usuario */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                {/* Botón del usuario */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  {usuario?.image ? (
                    <img
                      src={usuario.image}
                      alt={usuario.username}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/32';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-500">
                      <span className="text-sm text-white font-medium">
                        {usuario?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-200">
                    {usuario.username}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menú desplegable */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={() => {
                        navigate("/perfil");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      👤 Perfil
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 transform hover:-translate-y-0.5"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el dropdown al hacer click fuera */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;