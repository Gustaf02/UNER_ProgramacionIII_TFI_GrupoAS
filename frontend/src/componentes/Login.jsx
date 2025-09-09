import { useState, useEffect } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useUsuario } from '../contex/UsuarioContexto';
import Boton from './Boton';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: 'Nombre', // Valor de prueba por defecto
    password: '12345678'    // Valor de prueba por defecto
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { login, isAuthenticated } = useUsuario();

  // Redirigir si ya está autenticado (con protección contra bucles)
  useEffect(() => {
    if (isAuthenticated && window.location.pathname !== '/administracion') {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Valida los campos del formulario
   * @returns {boolean} True si el formulario es válido
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!credentials.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja cambios en los inputs
   * @param {React.ChangeEvent<HTMLInputElement>} e 
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (loginError) setLoginError(null);
  };

  /**
   * Maneja el envío del formulario
   * @param {React.FormEvent} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;  
    
    try {
      setIsSubmitting(true);
      await login(credentials);
      alertaLoginExito()

      navigate('/contacto'); // Cambiado para que coincida con el efecto
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const alertaLoginExito = ()=>{
    
  Swal.fire({
    title: "Bienvenida/o!",
    icon: "success",
    //draggable: true
    timer: "2000"
  });
    }
  

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-1"
        noValidate
      >
<div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
  <p className="font-medium mb-1">Credenciales de prueba (click para copiar):</p>
  <div className="space-y-1">
    <div 
      className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
      onClick={() => {
        navigator.clipboard.writeText('emilys');
       
      }}
    >
      <span className="font-semibold mr-2">Usuario:</span>
      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">emilys</span>
      <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
      </svg>
    </div>
    <div 
      className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
      onClick={() => {
        navigator.clipboard.writeText('emilyspass');
       
      }}
    >
      <span className="font-semibold mr-2">Password:</span>
      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">emilyspass</span>
      <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
      </svg>
    </div>
  </div>
</div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
        
        {loginError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {loginError}
          </div>
        )}

        {/* Campo Username */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Nombre de Usuario
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-500" />
            </div>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Nombre"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none ${
                errors.username ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="username"
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Campo Contraseña */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-500" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none ${
                errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="current-password"
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Botón de Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : 'Ingresar'}
        </button>

        {/* <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Usuarios de prueba</h2>
          <div className="flex justify-center">
            <Boton
              tipo='verUsuarios'
              onClick={() => navigate("/usuarios")}
            >
              Ver usuarios de prueba
            </Boton>
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default LoginForm;