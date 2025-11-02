import express from 'express';
const router = express.Router();
import autenticacionControlador from '../../controladores/autenticacionControlador.js';

console.log('Autenticacion Controlador cargado:', !!autenticacionControlador);
console.log('Función iniciarSesion existe:', !!autenticacionControlador.iniciarSesion);
console.log('Función crearUsuario existe:', !!autenticacionControlador.crearUsuario);

/**
 * @swagger
 * /api/v1/autenticacion/registro:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - nombre_usuario
 *               - contrasenia
 *               - tipo_usuario
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario
 *                 maxLength: 50
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 description: Apellido del usuario
 *                 maxLength: 50
 *                 example: "Pérez"
 *               nombre_usuario:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 maxLength: 50
 *                 example: "juanperez"
 *               contrasenia:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *                 maxLength: 255
 *                 example: "miContraseña123"
 *               tipo_usuario:
 *                 type: integer
 *                 description: Tipo de usuario (1=Admin, 2=Usuario, 3=Invitado)
 *                 example: 2
 *               celular:
 *                 type: string
 *                 description: Número de celular
 *                 maxLength: 20
 *                 example: "+1234567890"
 *               foto:
 *                 type: string
 *                 description: URL o ruta de la foto
 *                 maxLength: 255
 *                 example: "fotos/juan.jpg"
 *               activo:
 *                 type: integer
 *                 description: Estado del usuario (0=inactivo, 1=activo)
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario creado exitosamente"
 *                 datos:
 *                   type: object
 *                   properties:
 *                     usuario_id:
 *                       type: integer
 *                       example: 123
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El nombre de usuario ya existe
 *       500:
 *         description: Error del servidor
 */
router.post('/registro', autenticacionControlador.crearUsuario);

/**
 * @swagger
 * /api/v1/autenticacion/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Autentica un usuario y genera un token JWT para acceder a los recursos protegidos
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - contrasenia
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 maxLength: 50
 *                 example: "juanperez"
 *               contrasenia:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *                 example: "miContraseña123"
 *           examples:
 *             credencialesEjemplo:
 *               summary: Ejemplo de credenciales
 *               value:
 *                 nombre_usuario: "juanperez"
 *                 contrasenia: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Inicio de sesión exitoso"
 *                 datos:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         usuario_id:
 *                           type: integer
 *                           example: 123
 *                         nombre:
 *                           type: string
 *                           example: "Juan"
 *                         apellido:
 *                           type: string
 *                           example: "Pérez"
 *                         nombre_usuario:
 *                           type: string
 *                           example: "juanperez"
 *                         tipo_usuario:
 *                           type: integer
 *                           example: 2
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Datos de entrada inválidos - faltan campos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Nombre de usuario y contraseña son requeridos"
 *       401:
 *         description: Credenciales inválidas - usuario no encontrado o contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Credenciales inválidas"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Error en el inicio de sesión"
 *                 error:
 *                   type: string
 *                   example: "Mensaje de error específico"
 */
router.post('/login', autenticacionControlador.iniciarSesion);

/**
 * @swagger
 * /api/v1/autenticacion/recuperar-contrasenia:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     description: |
 *       Inicia el proceso de recuperación de contraseña enviando un email con instrucciones.
 *       Por seguridad, siempre se devuelve el mismo mensaje independientemente de si el usuario existe o no.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: Nombre de usuario asociado a la cuenta
 *                 maxLength: 50
 *                 example: "walter@gmail.com"
 *           examples:
 *             solicitudEjemplo:
 *               summary: Ejemplo de solicitud
 *               value:
 *                 nombre_usuario: "walter@gmail.com"
 *     responses:
 *       200:
 *         description: Solicitud procesada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Si el usuario existe, recibirá un email con instrucciones"
 *       400:
 *         description: Datos de entrada inválidos - falta el nombre de usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Nombre de usuario es requerido"
 *       500:
 *         description: Error interno del servidor o al enviar el email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Error en el proceso de recuperación"
 */
router.post('/recuperar-contrasenia', autenticacionControlador.recuperarContrasenia);

/**
 * @swagger
 * /api/v1/autenticacion/restablecer-contrasenia:
 *   post:
 *     summary: Restablecer contraseña con token válido
 *     description: |
 *       Permite establecer una nueva contraseña utilizando un token de recuperación válido.
 *       El token debe ser el recibido por email y tener la acción 'password_reset'.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - nueva_contrasenia
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT recibido por email para restablecer contraseña
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               nueva_contrasenia:
 *                 type: string
 *                 format: password
 *                 description: Nueva contraseña (mínimo 8 caracteres)
 *                 minLength: 8
 *                 example: "nuevaContraseña123"
 *           examples:
 *             restablecimientoEjemplo:
 *               summary: Ejemplo de restablecimiento
 *               value:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 nueva_contrasenia: "miNuevaContraseñaSegura"
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Contraseña restablecida exitosamente"
 *       400:
 *         description: |
 *           Datos de entrada inválidos:
 *           - Faltan token o contraseña
 *           - La contraseña tiene menos de 8 caracteres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Token y nueva contraseña son requeridos"
 *       401:
 *         description: |
 *           Token inválido:
 *           - Token expirado
 *           - Token corrupto
 *           - Token no es para acción de password_reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Token inválido o expirado"
 *       500:
 *         description: Error interno del servidor o al actualizar la contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Error al actualizar la contraseña"
 */
router.post('/restablecer-contrasenia', autenticacionControlador.restablecerContrasenia);

export default router;