import { Link } from 'react-router-dom';
import { FaceFrownIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full mx-auto">
        <div className="md:flex">
          {/* Ilustración */}
          <div className="md:w-1/2 bg-indigo-500 p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl font-bold text-white opacity-90 mb-4">404</div>
              <FaceFrownIcon className="h-24 w-24 mx-auto text-white opacity-80" />
            </div>
          </div>

          {/* Contenido */}
          <div className="md:w-1/2 p-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">¡Oops!</h1>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-6">Página no encontrada</h2>
            
            <p className="text-gray-600 mb-8">
              La página que estás buscando no existe o ha sido movida. 
              Intenta volver al inicio.
            </p>

            <div className="space-y-4">
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver al inicio
              </Link>
{/* 
              <button className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full md:w-auto">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Buscar en el sitio
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;