import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

const UsuarioContexto = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);



  // Limpiar autenticación
  const clearAuth = () => {
    localStorage.removeItem('avatar');
    localStorage.removeItem('usuarioData');
    localStorage.removeItem('compra')
    setUsuario(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Función que se ejecuta al inicio
const initializeAuth = () => {
  const userData = localStorage.getItem('usuarioData');
  if (userData) {
    setUsuario(JSON.parse(userData));
    setIsAuthenticated(true);
  }
};

// Ejecutar al montar el contexto
useEffect(() => {
  initializeAuth();
}, []);

  // Login mejorado según dummyjson API
  const login = useCallback(async (credentials) => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Validación de credenciales
    if (!credentials?.username || !credentials?.password) {
      throw new Error('usuario y password requeridos');
    }

    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Extraer mensaje de error de la respuesta
      const errorMsg = data.message || 'Authentication failed';
      throw new Error(errorMsg);
    }

    // Estructura de datos según respuesta de DummyJSON
    const usuarioData = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
    };

    // Guardar en estado y almacenamiento local
    setUsuario(usuarioData);
    setIsAuthenticated(true);
    localStorage.setItem('avatar', data.image);
    localStorage.setItem('usuarioData', JSON.stringify(usuarioData));

    return { success: true, usuario: usuarioData };
  } catch (err) {
    setError(err.message);
    console.error('Login error:', err);
    throw err; // Re-lanzar el error para manejo en el componente
  } finally {
    setIsLoading(false);
  }
}, []);

// Función de alerta modificada que devuelve una Promise
const mostrarAlertaLogout = () => {
  return Swal.fire({
    title: "¿Estás seguro de cerrar sesión?",
    text: "Serás redirigido al inicio de sesión",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    customClass: {
      popup: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700',
      title: 'text-lg font-semibold text-gray-900 dark:text-white',
      htmlContainer: 'text-gray-700 dark:text-gray-300',
      confirmButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200',
      cancelButton: 'px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 mr-3',
    },
    buttonsStyling: false
  });
};

// Función de logout principal
const logout = useCallback(async () => {
  const result = await mostrarAlertaLogout();
  
  if (result.isConfirmed) {
    try {
      // Ejecutar la limpieza de autenticación
      await clearAuth();
      
      // Mostrar confirmación
      await Swal.fire({
        title: "Sesión cerrada",
        text: "Has salido correctamente del sistema",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl',
          title: 'text-lg font-semibold text-green-600 dark:text-green-400',
        }
      });
      
      // Redirigir después de cerrar sesión
      window.location.href = '/login';
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cerrar la sesión correctamente",
        icon: "error"
      });
    }
  } else {
    // Si cancela, mostrar mensaje opcional
    await Swal.fire({
      title: "Cancelado",
      text: "Tu sesión sigue activa",
      icon: "info",
      timer: 2000,
      showConfirmButton: false
    });
  }
}, []);

  // Valor del contexto
  const value = {
    usuario,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    // Opcional: función para refrescar token
    refreshToken: async () => {
      // Implementación para refrescar token
    }
  };

  return (
    <UsuarioContexto.Provider value={value}>
      {children}
    </UsuarioContexto.Provider>
  );
};

// Hook personalizado
export const useUsuario = () => {
  const context = useContext(UsuarioContexto);
  
  if (!context) {
    throw new Error('useUsuario must be used within an UsuarioProvider');
  }
  
  return context;
};