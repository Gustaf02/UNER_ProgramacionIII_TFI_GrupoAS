const autenticacionModelo = require('../modelos/autenticacionModelo');
const { generarToken } = require('../utilidades/jwtUtilidades');
const { verificarContrasenia, encriptarContrasenia } = require('../utilidades/contraseniaUtilidades');

const autenticacionControlador = {
    async iniciarSesion(req, res) {
        try {
            console.log('✅ Llegó al controlador de login');
            console.log('📦 Body recibido:', req.body);
            console.log('🔑 Headers:', req.headers['content-type']);

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
            console.log('🔐 Contraseña recibida:', contrasenia);
            console.log('🔐 Contraseña en BD:', usuario.contrasenia);
            //console.log('🔐 Contraseña encriptada input:', encriptarContrasenia(contrasenia));
            

            // Verificar contraseña
            const contraseniaValida = verificarContrasenia(contrasenia, usuario.contrasenia);
            console.log('✅ Contraseña válida:', contraseniaValida);
            
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
    },

    // MÉTODO PARA CREAR USUARIOS
    async crearUsuario(req, res) {
        try {
            console.log('✅ Llegó al controlador de creación de usuario');
            console.log('📦 Body recibido:', req.body);

            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario } = req.body;

            // Validar campos obligatorios
            if (!nombre || !apellido || !nombre_usuario || !contrasenia) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Todos los campos son obligatorios'
                });
            }

            // Verificar si el usuario ya existe
            const usuarioExistente = await autenticacionModelo.buscarPorUsuario(nombre_usuario);
            if (usuarioExistente) {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'El nombre de usuario ya existe'
                });
            }

            // Determinar el tipo de usuario (si no se especifica, es cliente = 3)
            const tipoUsuarioFinal = tipo_usuario || 3;

            // Encriptar contraseña
            const contraseniaEncriptada = encriptarContrasenia(contrasenia);

            // Crear objeto de usuario
            const usuarioDatos = {
                nombre,
                apellido,
                nombre_usuario,
                contrasenia: contraseniaEncriptada,
                tipo_usuario: tipoUsuarioFinal,
                activo: 1
            };

            // Llamar al modelo para crear usuario (necesitarás implementar este método)
            const nuevoUsuarioId = await autenticacionModelo.crearUsuario(usuarioDatos);

            res.status(201).json({
                exito: true,
                mensaje: 'Usuario creado exitosamente',
                datos: {
                    usuario_id: nuevoUsuarioId
                }
            });

        } catch (error) {
            console.error('❌ Error en crearUsuario:', error);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al crear usuario',
                error: error.message
            });
        }
    }
};

module.exports = autenticacionControlador;