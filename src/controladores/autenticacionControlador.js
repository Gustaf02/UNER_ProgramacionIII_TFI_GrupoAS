import autenticacionModelo from '../bd/autenticacion.js';
import { generarToken, generarTokenRecuperacion } from "../token/jwtCrear.js";
import { verificarContrasenia, encriptarContrasenia } from "../token/contraseniaEncriptada.js";
import { enviarEmailRecuperacion } from '../servicios/emailServicios.js';

const JWT_SECRET = process.env.JWT_SECRET;

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

            // Llamar al modelo para crear usuario
            const nuevoUsuarioId = await autenticacionModelo.crearUsuario(usuarioDatos);

            res.status(201).json({
                exito: true,
                mensaje: 'Usuario creado exitosamente',
                datos: {
                    usuario_id: nuevoUsuarioId
                }
            });

        } catch (error) {
            console.error(' Error en crearUsuario:', error);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al crear usuario',
                error: error.message
            });
        }
    },

    async recuperarContrasenia(req, res) {
    try {
        console.log('✅ Llegó al controlador de recuperación');
        const { nombre_usuario } = req.body;

        if (!nombre_usuario) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Nombre de usuario es requerido'
            });
        }

        // Buscar usuario
        const usuario = await autenticacionModelo.buscarPorUsuario(nombre_usuario);
        
        // Siempre dar misma respuesta por seguridad
        if (!usuario) {
            console.log('📧 (Simulación) Email enviado para recuperación');
            return res.json({
                exito: true,
                mensaje: 'Si el usuario existe, recibirá un email con instrucciones'
            });
        }

        // Generar token JWT para reset (expira en 1 hora)
        const tokenReset = generarTokenRecuperacion({
            usuario_id: usuario.usuario_id,
            accion: 'password_reset',
            timestamp: Date.now()
        });

        // Enviar email real con Nodemailer
        const emailEnviado = await enviarEmailRecuperacion(usuario.nombre_usuario, tokenReset);

        if (!emailEnviado) {
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al enviar el email de recuperación'
            });
        }

        // Respuesta exitosa
        res.json({
            exito: true,
            mensaje: 'Si el usuario existe, recibirá un email con instrucciones'
            // En producción, no enviar el token en la respuesta
        });

    } catch (error) {
        console.error('❌ Error en recuperarContrasenia:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error en el proceso de recuperación'
        });
    }
},
    async restablecerContrasenia(req, res) {
    try {
        console.log('✅ Llegó al controlador de restablecimiento');
        const { token, nueva_contrasenia } = req.body;

        if (!token || !nueva_contrasenia) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Token y nueva contraseña son requeridos'
            });
        }

        // TEMPORAL: Para debug, solo decodificamos el token sin verificar expiración
             // DEBUG: Solo decodificar, no verificar
let decoded = jwt.decode(token);
if (!decoded) {
    return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido'
    });
}

        // Validar que el token es para reset de contraseña
        if (decoded.accion !== 'password_reset') {
            return res.status(401).json({
                exito: false,
                mensaje: 'Token inválido'
            });
        }

        // ... resto del código
    } catch (error) {
        // ... manejo de errores
    }
}
};

export default autenticacionControlador;