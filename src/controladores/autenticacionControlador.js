import autenticacionModelo from '../bd/autenticacion.js';
import { generarToken, generarTokenRecuperacion } from "../token/jwtCrear.js";
import { verificarContrasenia, encriptarContrasenia } from "../token/contraseniaEncriptada.js";
import { enviarEmailRecuperacion } from '../servicios/emailServicios.js';
import jwt from 'jsonwebtoken';




const JWT_SECRET = process.env.JWT_SECRET;

const autenticacionControlador = {
    async iniciarSesion(req, res) {
        try {

            const { nombre_usuario, contrasenia } = req.body;


            if (!nombre_usuario || !contrasenia) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Nombre de usuario y contraseña son requeridos'
                });
            }

            const usuario = await autenticacionModelo.buscarPorUsuario(nombre_usuario);

            if (!usuario) {
                return res.status(401).json({
                    exito: false,
                    mensaje: 'Credenciales inválidas'
                });
            }



            const contraseniaValida = verificarContrasenia(contrasenia, usuario.contrasenia);


            if (!contraseniaValida) {
                return res.status(401).json({
                    exito: false,
                    mensaje: 'Credenciales inválidas'
                });
            }


            const token = generarToken(usuario);


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


    async crearUsuario(req, res) {
        try {

            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario } = req.body;

            if (!nombre || !apellido || !nombre_usuario || !contrasenia) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Todos los campos son obligatorios'
                });
            }

            const usuarioExistente = await autenticacionModelo.buscarPorUsuario(nombre_usuario);
            if (usuarioExistente) {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'El nombre de usuario ya existe'
                });
            }

            
            const tipoUsuarioFinal = tipo_usuario || 3;

            
            const contraseniaEncriptada = encriptarContrasenia(contrasenia);

            
            const usuarioDatos = {
                nombre,
                apellido,
                nombre_usuario,
                contrasenia: contraseniaEncriptada,
                tipo_usuario: tipoUsuarioFinal,
                activo: 1
            };

            
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
            const { nombre_usuario } = req.body;

            if (!nombre_usuario) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Nombre de usuario es requerido'
                });
            }

            
            const usuario = await autenticacionModelo.buscarPorUsuario(nombre_usuario);

            
            if (!usuario) {
                return res.json({
                    exito: true,
                    mensaje: 'Si el usuario existe, recibirá un email con instrucciones'
                });
            }

            
            const tokenReset = generarTokenRecuperacion({
                usuario_id: usuario.usuario_id,
                accion: 'password_reset',
                timestamp: Date.now()
            });

           
            const emailEnviado = await enviarEmailRecuperacion(usuario.nombre_usuario, tokenReset);

            if (!emailEnviado) {
                return res.status(500).json({
                    exito: false,
                    mensaje: 'Error al enviar el email de recuperación'
                });
            }

            
            res.json({
                exito: true,
                mensaje: 'Si el usuario existe, recibirá un email con instrucciones'
            });

        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error en el proceso de recuperación'
            });
        }
    },

    async restablecerContrasenia(req, res) {
        try {
            const { token, nueva_contrasenia } = req.body;

            if (!token || !nueva_contrasenia) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Token y nueva contraseña son requeridos'
                });
            }

            
            if (nueva_contrasenia.length < 8) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La contraseña debe tener al menos 8 caracteres'
                });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {

    return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido o expirado'
    });
}

            
            if (decoded.accion !== 'password_reset') {
                return res.status(401).json({
                    exito: false,
                    mensaje: 'Token inválido para esta acción'
                });
            }

            
            const nuevaContraseniaHash = encriptarContrasenia(nueva_contrasenia);
            const actualizado = await autenticacionModelo.actualizarContrasenia(decoded.usuario_id, nuevaContraseniaHash);
            
            if (!actualizado) {
                return res.status(500).json({
                    exito: false,
                    mensaje: 'Error al actualizar la contraseña'
                });
            }

            return res.json({
                exito: true,
                mensaje: 'Contraseña restablecida exitosamente'
            });

        } catch (error) {
            console.error('Error en restablecerContrasenia:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }
};

export default autenticacionControlador;