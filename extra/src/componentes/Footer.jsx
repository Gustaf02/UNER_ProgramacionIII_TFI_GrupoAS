import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h3 className="text-lg font-medium text-gray-300"></h3>
          
          <a
            href="https://github.com/Gustaf02/UNER_ProgramacionIII_TFI_GrupoAS.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 transform hover:-translate-y-0.5"
          >
            <FaGithub className="w-6 h-6" />
            <span className="text-sm font-medium">Ver en GitHub</span>
          </a>
          
          <p className="text-xs text-gray-400 mt-4">
            © {new Date().getFullYear()} Salones Programación III
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;