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
    localStorage.removeItem('authToken');
    localStorage.removeItem('compra');
    setUsuario(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Función que se ejecuta al inicio
  const initializeAuth = () => {
    const userData = localStorage.getItem('usuarioData');
    const token = localStorage.getItem('authToken');
    
    if (userData && token) {
      try {
        const parsedData = JSON.parse(userData);
        setUsuario(parsedData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuth();
      }
    }
  };

  // Ejecutar al montar el contexto
  useEffect(() => {
    initializeAuth();
    setIsLoading(false);
  }, []);

  // Login con debugging completo
  const login = useCallback(async (credenciales) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Credenciales recibidas en contexto:', credenciales);
      
      // Validación de credenciales
      if (!credenciales?.nombre_usuario || !credenciales?.contrasenia) {
        throw new Error('Usuario y contraseña requeridos');
      }

      const requestBody = JSON.stringify({
        nombre_usuario: credenciales.nombre_usuario,
        contrasenia: credenciales.contrasenia
      });

      console.log('📤 Request body:', requestBody);

      const response = await fetch('http://localhost:3000/api/autenticacion/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para cookies/sessions
        body: requestBody
      });

      console.log('📊 Status de respuesta:', response.status);
      console.log('📊 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📦 Respuesta completa del servidor:', data);
      console.log('✅ Exito:', data.exito);
      console.log('📝 Mensaje:', data.mensaje);
      console.log('💾 Datos:', data.datos);

      if (!response.ok) {
        const errorMsg = data.mensaje || data.error || `Error ${response.status} en el servidor`;
        throw new Error(errorMsg);
      }

      if (!data.exito) {
        throw new Error(data.mensaje || 'Error en la autenticación');
      }

      // Si la respuesta es exitosa pero no tiene datos.datos, puede que la estructura sea diferente
      let userDataFromApi;
      let token;

      if (data.datos) {
        // Estructura esperada: {exito: true, mensaje: "...", datos: {usuario: {...}, token: "..."}}
        userDataFromApi = data.datos.usuario;
        token = data.datos.token;
      } else if (data.usuario) {
        // Otra posible estructura: {exito: true, mensaje: "...", usuario: {...}, token: "..."}
        userDataFromApi = data.usuario;
        token = data.token;
      } else {
        // Estructura directa: {exito: true, mensaje: "...", usuario_id: 1, nombre: "...", etc.}
        userDataFromApi = data;
        token = data.token;
      }

      console.log('👤 Datos de usuario extraídos:', userDataFromApi);
      console.log('🔑 Token extraído:', token);

      // Estructura los datos correctamente
      const usuarioData = {
        id: userDataFromApi.usuario_id || userDataFromApi.id,
        username: userDataFromApi.nombre_usuario || userDataFromApi.username,
        nombre: userDataFromApi.nombre,
        apellido: userDataFromApi.apellido,
        tipo_usuario: userDataFromApi.tipo_usuario,
        token: token
      };

      console.log('🎯 Datos de usuario finales:', usuarioData);

      // Validar datos esenciales
      if (!usuarioData.id || !usuarioData.username) {
        throw new Error('Datos de usuario incompletos en la respuesta');
      }

      // Guardar en estado y almacenamiento local
      setUsuario(usuarioData);
      setIsAuthenticated(true);
      localStorage.setItem('usuarioData', JSON.stringify(usuarioData));
      
      if (token) {
        localStorage.setItem('authToken', token);
      }

      await Swal.fire({
        title: "¡Bienvenido!",
        text: data.mensaje || "Inicio de sesión exitoso",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      return { 
        success: true, 
        usuario: usuarioData, 
        message: data.mensaje 
      };

    } catch (err) {
      const errorMessage = err.message || 'Error en el servidor';
      setError(errorMessage);
      console.error('❌ Login error completo:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
      
      await Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Entendido"
      });
      
      throw err;
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
      reverseButtons: true
    });
  };

  // Función de logout principal
  const logout = useCallback(async () => {
    const result = await mostrarAlertaLogout();
    
    if (result.isConfirmed) {
      try {
        // Ejecutar la limpieza de autenticación
        clearAuth();
        
        // Mostrar confirmación
        await Swal.fire({
          title: "Sesión cerrada",
          text: "Has salido correctamente del sistema",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
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
    clearAuth,
    // Función para actualizar datos del usuario
    actualizarUsuario: (nuevosDatos) => {
      const updatedUser = { ...usuario, ...nuevosDatos };
      setUsuario(updatedUser);
      localStorage.setItem('usuarioData', JSON.stringify(updatedUser));
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
    throw new Error('useUsuario debe ser usado dentro de un UsuarioProvider');
  }
  
  return context;
};