const usuariosModelo = require("../modelos/usuariosModelo");

const usuariosControlador = {
    /**
     * Obtiene todos los usuarios
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async obtenerTodos(req, res) {
        try {
            console.log('📋 Obteniendo todos los usuarios');
            
            const usuarios = await usuariosModelo.obtenerTodos();
            
            res.json({
                exito: true,
                mensaje: 'Usuarios obtenidos exitosamente',
                datos: usuarios,
                total: usuarios.length
            });

        } catch (error) {
            console.error('❌ Error en obtenerTodos:', error);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener los usuarios',
                error: error.message
            });
        }
    },

    /**
     * Obtiene un usuario por su ID
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            console.log(`📋 Obteniendo usuario con ID: ${id}`);
            
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'ID de usuario inválido'
                });
            }

            const usuario = await usuariosModelo.obtenerPorId(parseInt(id));
            
            if (!usuario) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Usuario no encontrado'
                });
            }

            res.json({
                exito: true,
                mensaje: 'Usuario obtenido exitosamente',
                datos: usuario
            });

        } catch (error) {
            console.error('❌ Error en obtenerPorId:', error);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener el usuario',
                error: error.message
            });
        }
    },

    /**
     * Obtiene usuarios por tipo de usuario
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async obtenerPorTipo(req, res) {
        try {
            const { tipo } = req.params;
            console.log(`📋 Obteniendo usuarios con tipo: ${tipo}`);
            
            if (!tipo || isNaN(tipo)) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Tipo de usuario inválido'
                });
            }

            const tipoUsuario = parseInt(tipo);
            
            // Validar que el tipo sea 1, 2 o 3
            if (tipoUsuario < 1 || tipoUsuario > 3) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Tipo de usuario debe ser 1 (admin), 2 (empleado) o 3 (cliente)'
                });
            }

            const usuarios = await usuariosModelo.obtenerPorTipo(tipoUsuario);
            
            res.json({
                exito: true,
                mensaje: `Usuarios tipo ${tipoUsuario} obtenidos exitosamente`,
                datos: usuarios,
                total: usuarios.length
            });

        } catch (error) {
            console.error('❌ Error en obtenerPorTipo:', error);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener usuarios por tipo',
                error: error.message
            });
        }
    }
};

module.exports = usuariosControlador;