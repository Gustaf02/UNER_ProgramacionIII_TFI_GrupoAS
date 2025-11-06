import express from 'express';
import UsuariosControlador from '../../controladores/usuariosControlador.js'; 
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizar from '../../middlewares/autorizarMiddleware.js';
import { verificarAutenticacion } from '../../middlewares/autenticacionMiddleware.js';

const usuariosControlador = new UsuariosControlador();
const router = express.Router();

// =======================================================
// SWAGGER TAGS
// =======================================================
/**
 * @swagger
 * tags:
 * name: Usuarios
 * description: Gestión de usuarios del sistema (CRUD solo para Administradores)
 */

// =======================================================
// [R] READ: Obtener todos los usuarios (BROWSE)
// Roles: [1]
// =======================================================
/**
 * @swagger
 * /api/v1/usuarios:
 * get:
 * summary: Obtener todos los usuarios activos
 * description: Retorna una lista de todos los usuarios activos. Requiere rol Administrador (1).
 * tags: [Usuarios]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de usuarios
 * 403:
 * description: Acceso denegado (Rol no autorizado)
 */
router.get('/', verificarAutenticacion, autorizar([1]), usuariosControlador.obtenerTodos);

// =======================================================
// [R] READ: Obtener un usuario por ID
// Roles: [1]
// =======================================================
/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 * get:
 * summary: Obtener un usuario por ID
 * description: Retorna la información de un usuario específico. Requiere rol Administrador (1).
 * tags: [Usuarios]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: usuario_id
 * required: true
 * schema:
 * type: integer
 * description: ID del usuario a consultar
 * responses:
 * 200:
 * description: Usuario encontrado
 * 404:
 * description: Usuario no encontrado
 * 403:
 * description: Acceso denegado
 */
router.get('/:usuario_id', verificarAutenticacion, autorizar([1]), 
    [
        check('usuario_id', 'El ID de usuario es obligatorio y debe ser numérico').isInt({ gt: 0 }),
        validarCampos
    ],
    usuariosControlador.obtenerPorId
);

// =======================================================
// [C] CREATE: Crear un nuevo usuario (ADD)
// Roles: [1]
// =======================================================
/**
 * @swagger
 * /api/v1/usuarios:
 * post:
 * summary: Crear un nuevo usuario (solo Admin)
 * description: Crea un nuevo usuario en el sistema con un rol específico. Requiere rol Administrador (1).
 * tags: [Usuarios]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - nombre
 * - apellido
 * - nombre_usuario
 * - contrasenia
 * - tipo_usuario
 * properties:
 * nombre: { type: string, description: Nombre del usuario, requerido [cite: 710] }
 * apellido: { type: string, description: Apellido del usuario, requerido [cite: 710] }
 * nombre_usuario: { type: string, description: Email/Nombre de usuario único, formato email, requerido [cite: 710] }
 * contrasenia: { type: string, format: password, description: Contraseña (mínimo 8 caracteres), requerido [cite: 710] }
 * tipo_usuario: { type: integer, description: Tipo de usuario (1:Admin, 2:Empleado, 3:Cliente), requerido [cite: 711] }
 * celular: { type: string, description: Número de celular, opcional [cite: 712] }
 * foto: { type: string, description: URL o ruta de la foto, opcional/nullable }
 * responses:
 * 201:
 * description: Usuario creado exitosamente
 * 400:
 * description: Datos de entrada inválidos
 * 409:
 * description: El nombre de usuario ya existe
 */
router.post('/', verificarAutenticacion, autorizar([1]),
    [
        check('nombre', 'El nombre es necesario').notEmpty(),
        check('apellido', 'El apellido es necesario').notEmpty(),
        check('nombre_usuario', 'El nombre de usuario es necesario').notEmpty().isEmail().withMessage('El nombre de usuario debe ser un email válido'),
        check('contrasenia', 'La contrasenia es necesaria').notEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
        check('tipo_usuario')
            .notEmpty().withMessage('El tipo de usuario es necesario')
            .isNumeric().withMessage('El tipo de usuario debe ser numerico')
            .custom(valor => Number.isInteger(Number(valor)) && (valor == '1' || valor == '2' || valor == '3')).withMessage('El tipo de usuario debe ser 1, 2 o 3'),
        check('celular')
            .optional() 
            .isNumeric().withMessage('El celular debe ser numerico'),
        check('foto').optional(),
        validarCampos
    ],
    usuariosControlador.crear);

// =======================================================
// [U] UPDATE: Modificar un usuario (EDIT)
// Roles: [1]
// =======================================================
/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 * put:
 * summary: Modificar un usuario existente
 * description: Actualiza la información de un usuario. Los campos son opcionales. Requiere rol Administrador (1).
 * tags: [Usuarios]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: usuario_id
 * required: true
 * schema:
 * type: integer
 * description: ID del usuario a modificar
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nombre: { type: string, description: Nombre del usuario, opcional }
 * apellido: { type: string, description: Apellido del usuario, opcional }
 * nombre_usuario: { type: string, description: Nuevo email único, opcional [cite: 716] }
 * contrasenia: { type: string, format: password, description: Nueva contraseña (mínimo 8 caracteres, se encripta con bcrypt), opcional [cite: 716] }
 * tipo_usuario: { type: integer, description: Nuevo tipo de usuario (1, 2 o 3), opcional [cite: 717] }
 * celular: { type: string, description: Número de celular, opcional [cite: 717] }
 * foto: { type: string, description: URL o ruta de la foto, opcional/nullable }
 * responses:
 * 200:
 * description: Usuario modificado exitosamente
 * 400:
 * description: Datos de entrada inválidos
 * 404:
 * description: Usuario no encontrado
 * 409:
 * description: El nombre de usuario ya está en uso
 */
router.put('/:usuario_id', verificarAutenticacion, autorizar([1]),
    [
        check('nombre').optional().notEmpty().withMessage('El nombre no puede ser vacío'),
        check('apellido').optional().notEmpty().withMessage('El apellido no puede ser vacío'),
        check('nombre_usuario').optional().notEmpty().withMessage('El nombre de usuario no puede ser vacío').isEmail().withMessage('Debe ser un email válido'),
        check('contrasenia').optional().notEmpty().withMessage('La contraseña no puede ser vacía').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
        check('tipo_usuario')
            .optional()
            .isNumeric().withMessage('El tipo de usuario debe ser numérico')
            .custom(valor => Number.isInteger(Number(valor)) && (valor == '1' || valor == '2' || valor == '3')).withMessage('El tipo de usuario debe ser 1, 2 o 3'),
        check('celular').optional().isNumeric().withMessage('El celular debe ser numérico'),
        check('foto').optional(),
        validarCampos
    ],
    usuariosControlador.modificar);

// =======================================================
// [D] DELETE: Eliminar un usuario (Soft Delete)
// Roles: [1]
// =======================================================
/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 * delete:
 * summary: Eliminar (Soft Delete) un usuario
 * description: Marca un usuario como inactivo (soft delete). Requiere rol Administrador (1).
 * tags: [Usuarios]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: usuario_id
 * required: true
 * schema:
 * type: integer
 * description: ID del usuario a eliminar
 * responses:
 * 200:
 * description: Usuario eliminado exitosamente
 * 404:
 * description: Usuario no encontrado
 * 403:
 * description: Acceso denegado
 */
router.delete('/:usuario_id', verificarAutenticacion, autorizar([1]), 
    [
        check('usuario_id', 'El ID de usuario es obligatorio y debe ser numérico').isInt({ gt: 0 }),
        validarCampos
    ],
    usuariosControlador.eliminar);

export { router };