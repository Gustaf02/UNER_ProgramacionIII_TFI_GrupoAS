// Importaciones de Express y Router
import { Router } from "express";

// Importación de componentes de validación y middlewares
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js"; 
import autorizar from "../../middlewares/autorizarMiddleware.js"; 
import { verificarAutenticacion } from "../../middlewares/autenticacionMiddleware.js"; 

// Importación del controlador de reservas 
import {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva
} from "../../controladores/reservasControlador.js"; 

const router = Router();

// Se define los roles permitidos para las distintas operaciones:
// 1: Admin, 2: Empleado, 3: Cliente (Usuario estándar)

// =======================================================
// [C] CREATE: Crear una nueva reserva
// URL: POST /api/v1/reservas
// Roles: [1, 2, 3]
// =======================================================

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       required:
 *         - fecha_reserva
 *         - salon_id
 *         - turno_id
 *       properties:
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva en formato YYYY-MM-DD
 *           example: "2024-12-15"
 *         salon_id:
 *           type: integer
 *           description: ID del salón a reservar
 *           example: 1
 *         turno_id:
 *           type: integer
 *           description: ID del turno seleccionado
 *           example: 2
 *         foto_cumpleaniero:
 *           type: string
 *           nullable: true
 *           description: URL de la foto del cumpleañero
 *           example: "https://ejemplo.com/foto.jpg"
 *         tematica:
 *           type: string
 *           nullable: true
 *           description: Temática de la fiesta
 *           example: "Cumpleaños de 15"
 *         servicios:
 *           type: array
 *           description: Array de IDs de servicios (opcional)
 *           items:
 *             type: integer
 *             example: 1
 * 
 *     RespuestaReservaCreada:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           example: true
 *         mensaje:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             reserva_id:
 *               type: integer
 *               example: 74
 * 
 *     Error:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     description: |
 *       Crea una reserva de salón con servicios opcionales.
 *       - El usuario_id se obtiene automáticamente del token de autenticación
 *       - Los importes se calculan automáticamente con precios actuales
 *       - Se valida disponibilidad del salón
 *       - Se envía email de confirmación al usuario
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *           examples:
 *             ejemploCompleto:
 *               summary: Reserva con servicios
 *               value:
 *                 fecha_reserva: "2024-12-15"
 *                 salon_id: 1
 *                 turno_id: 2
 *                 tematica: "Cumpleaños de 15"
 *                 foto_cumpleaniero: "https://ejemplo.com/foto.jpg"
 *                 servicios: [1, 3]
 *             ejemploSinServicios:
 *               summary: Reserva básica
 *               value:
 *                 fecha_reserva: "2024-12-15"
 *                 salon_id: 1
 *                 turno_id: 2
 *                 tematica: "Fiesta simple"
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaReservaCreada'
 *             examples:
 *               exitoConEmail:
 *                 value:
 *                   ok: true
 *                   mensaje: "Reserva creada exitosamente y notificación enviada por mail."
 *                   data:
 *                     reserva_id: 74
 *               exitoSinEmail:
 *                 value:
 *                   ok: true
 *                   mensaje: "Reserva creada exitosamente, pero hubo un problema al enviar la confirmación por email."
 *                   data:
 *                     reserva_id: 75
 *       400:
 *         description: Faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               ok: false
 *               mensaje: "Faltan campos obligatorios: fecha_reserva, salon_id, turno_id"
 *       404:
 *         description: Recurso no encontrado o inactivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               salonNoEncontrado:
 *                 value:
 *                   ok: false
 *                   mensaje: "El salón no existe o no está activo"
 *               turnoNoEncontrado:
 *                 value:
 *                   ok: false
 *                   mensaje: "El turno no existe o no está activo"
 *               serviciosNoEncontrados:
 *                 value:
 *                   ok: false
 *                   mensaje: "Uno o más servicios no existen o no están activos"
 *       409:
 *         description: Conflicto - El salón ya está reservado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               ok: false
 *               mensaje: "El salón ya está reservado para esta fecha y turno"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               ok: false
 *               mensaje: "Error interno del servidor al crear la reserva"
 * 
 *   get:
 *     summary: Obtener todas las reservas
 *     description: Retorna la lista completa de reservas del sistema
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               ok: false
 *               mensaje: "Error interno del servidor al obtener las reservas"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/', verificarAutenticacion, autorizar([1, 2, 3]),
    [
        // Validación de campos principales de la reserva
        // check('fecha_reserva', 'La fecha de reserva es necesaria y debe ser válida (YYYY-MM-DD)').isISO8601().toDate(),
        // check('salon_id', 'El ID del salón es obligatorio y debe ser un número entero positivo').isInt({ gt: 0 }),
        // check('usuario_id', 'El ID del usuario es obligatorio y debe ser un número entero positivo').isInt({ gt: 0 }),
        // check('turno_id', 'El ID del turno es obligatorio y debe ser un número entero positivo').isInt({ gt: 0 }),
        
        // Campos opcionales
        // check('foto_cumpleaniero', 'El campo foto_cumpleaniero debe ser una cadena').optional({ nullable: true }).isString(),
        // check('tematica', 'La temática debe ser una cadena').optional().isString(),

        // Validación de importes
        // check('importe_salon', 'El importe del salón debe ser numérico y mayor o igual a 0').isFloat({ min: 0 }),
        // check('importe_total', 'El importe total debe ser numérico y mayor o igual a 0').isFloat({ min: 0 }),

        // Validación del array de servicios
        // check('servicios', 'Los servicios deben ser un array de objetos').optional().isArray(),
        
        // Validación de la estructura de cada servicio si se proporciona el array
        // check('servicios.*.servicio_id', 'El ID del servicio es obligatorio y debe ser numérico').if(check('servicios').exists()).isInt({ gt: 0 }),
        // check('servicios.*.importe', 'El importe del servicio debe ser numérico y mayor o igual a 0').if(check('servicios').exists()).isFloat({ min: 0 }),

        //validarCampos
    ],
    crearReserva
);

// =======================================================
// [R] READ: Obtener todas las reservas activas (Listado)
// URL: GET /api/v1/reservas
// Roles: [1, 2]
// =======================================================
router.get('/', verificarAutenticacion, autorizar([1, 2]), obtenerReservas);

// =======================================================
// [R] READ: Obtener una reserva por su ID
// URL: GET /api/v1/reservas/:reserva_id
// Roles: [1, 2, 3]
// =======================================================
router.get('/:reserva_id', verificarAutenticacion, autorizar([1, 2, 3]),
    [
        check('reserva_id', 'El ID de la reserva es obligatorio y debe ser numérico').isInt({ gt: 0 }),
        validarCampos
    ],
    obtenerReservaPorId
);

// =======================================================
// [U] UPDATE: Actualizar una reserva existente
// URL: PUT /api/v1/reservas/:reserva_id
// Roles: [1, 2]
// =======================================================
router.put('/:reserva_id', verificarAutenticacion, autorizar([1, 2]),
    [
        // Validación del parámetro de ruta
        check('reserva_id', 'El ID de la reserva es obligatorio y debe ser numérico').isInt({ gt: 0 }),
        
        // Validación de campos del body 
        check('fecha_reserva', 'La fecha de reserva debe ser válida').optional().isISO8601().toDate(),
        check('salon_id', 'El ID del salón debe ser numérico').optional().isInt({ gt: 0 }),
        check('usuario_id', 'El ID del usuario debe ser numérico').optional().isInt({ gt: 0 }),
        check('turno_id', 'El ID del turno debe ser numérico').optional().isInt({ gt: 0 }),
        check('foto_cumpleaniero', 'El campo foto_cumpleaniero debe ser una cadena').optional({ nullable: true }).isString(),
        check('tematica', 'La temática debe ser una cadena').optional().isString(),
        check('importe_total', 'El importe total debe ser numérico y mayor o igual a 0').optional().isFloat({ min: 0 }),

        // Validación del array de servicios para el PUT 
        check('servicios', 'Los servicios deben ser un array de objetos').optional().isArray(),
       
        check('servicios.*.servicio_id', 'El ID del servicio es obligatorio y debe ser numérico').if(check('servicios').exists()).isInt({ gt: 0 }),
        check('servicios.*.importe', 'El importe del servicio debe ser numérico y mayor o igual a 0').if(check('servicios').exists()).isFloat({ min: 0 }),

        validarCampos
    ],
    actualizarReserva
);

// =======================================================
// [D] DELETE: Eliminar una reserva (Borrado Lógico)
// URL: DELETE /api/v1/reservas/:reserva_id
// Roles: [1, 2]
// =======================================================
router.delete('/:reserva_id', verificarAutenticacion, autorizar([1, 2]),
    [
        check('reserva_id', 'El ID de la reserva es obligatorio y debe ser numérico').isInt({ gt: 0 }),
        validarCampos
    ],
    eliminarReserva
);

export const v1ReservaRutas = router;
