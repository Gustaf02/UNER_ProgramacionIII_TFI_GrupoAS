const autenticacionModelo = require('../modelos/autenticacionModelo');
const { generarToken } = require('../utilidades/jwtUtilidades');
const { verificarContrasenia } = require('../utilidades/contraseniaUtilidades');

const autenticacionControlador = {
    async iniciarSesion(req, res) {
        try {
            const { nombre_usuario, contrasenia } = req.body;

            // Validar campos obligatorios
            if (!nombre_usuario || !contrasenia) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Nombre de usuario y contraseña son requeridos'
                });
            }

            // Buscar usuario
            const usuario = await autenticacionModelo.buscarPorUsuario(nombre_usuario);
            
            if (!usuario) {
                return res.status(401).json({
                    exito: false,
                    mensaje: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const contraseniaValida = verificarContrasenia(contrasenia, usuario.contrasenia);
            
            if (!contraseniaValida) {
                return res.status(401).json({
                    exito: false,
                    mensaje: 'Credenciales inválidas'
                });
            }

            // Generar token
            const token = generarToken(usuario);

            // Responder sin la contraseña
            const usuarioRespuesta = {
                usuario_id: usuario.usuario_id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                nombre_usuario: usuario.nombre_usuario,
                tipo_usuario: usuario.tipo_usuario
            };

            res.json({
                exito: true,
                mensaje: 'Inicio de sesión exitoso',
                datos: {
                    usuario: usuarioRespuesta,
                    token: token
                }
            });

        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error en el inicio de sesión',
                error: error.message
            });
        }
    }
};

module.exports = autenticacionControlador;