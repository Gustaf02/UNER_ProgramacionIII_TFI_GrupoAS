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
  eliminarReserva,
  verMisReservas
} from "../../controladores/reservasControlador.js"; 

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints para gestionar reservas de salones
 */

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
 *           description: Fecha de la reserva (YYYY-MM-DD)
 *           example: "2025-12-25"
 *         salon_id:
 *           type: integer
 *           description: ID del salón reservado
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que realiza la reserva
 *           example: 3
 *         turno_id:
 *           type: integer
 *           description: ID del turno
 *           example: 2
 *         foto_cumpleaniero:
 *           type: string
 *           nullable: true
 *           example: "https://ejemplo.com/foto.jpg"
 *         tematica:
 *           type: string
 *           nullable: true
 *           example: "Plim Plim"
 *         importe_salon:
 *           type: number
 *           format: float
 *           example: 95000.00
 *         importe_total:
 *           type: number
 *           format: float
 *           example: 155000.00
 *         servicios:
 *           type: array
 *           description: Servicios adicionales
 *           items:
 *             type: object
 *             properties:
 *               servicio_id:
 *                 type: integer
 *                 example: 1
 *               importe:
 *                 type: number
 *                 format: float
 *                 example: 15000.00
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     description: Permite crear una nueva reserva incluyendo servicios opcionales.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       401:
 *         description: Token faltante o inválido
 *       409:
 *         description: El salón ya está reservado para esa fecha y turno
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verificarAutenticacion, autorizar([1, 2, 3]),
    [
        // Validaciones desactivadas temporalmente
    ],
    crearReserva
);

/**
 * @swagger
 * /api/v1/reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     description: Devuelve la lista completa de reservas registradas en el sistema.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida exitosamente
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado — Rol no autorizado
 */
router.get('/', verificarAutenticacion, autorizar([1, 2]), obtenerReservas);

router.get('/mis-reservas', verificarAutenticacion, verMisReservas);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   get:
 *     summary: Obtener una reserva por ID
 *     description: Retorna los detalles de una reserva específica.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a consultar
 *     responses:
 *       200:
 *         description: Reserva encontrada exitosamente
 *       404:
 *         description: Reserva no encontrada
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Rol no autorizado
 */
router.get('/:reserva_id', verificarAutenticacion, autorizar([1, 2, 3]),
    [
        check('reserva_id', 'El ID de la reserva es obligatorio y debe ser numérico').isInt({ gt: 0 }),
        validarCampos
    ],
    obtenerReservaPorId
);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   put:
 *     summary: Actualizar una reserva existente
 *     description: Permite modificar una reserva existente (solo Admin o Empleado).
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       200:
 *         description: Reserva actualizada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado
 */
router.put('/:reserva_id', verificarAutenticacion, autorizar([1, 2]),
    [
        check('reserva_id', 'El ID de la reserva es obligatorio y debe ser numérico').isInt({ gt: 0 }),
        check('fecha_reserva', 'La fecha de reserva debe ser válida').optional().isISO8601().toDate(),
        check('salon_id', 'El ID del salón debe ser numérico').optional().isInt({ gt: 0 }),
        check('usuario_id', 'El ID del usuario debe ser numérico').optional().isInt({ gt: 0 }),
        check('turno_id', 'El ID del turno debe ser numérico').optional().isInt({ gt: 0 }),
        check('foto_cumpleaniero', 'El campo foto_cumpleaniero debe ser una cadena').optional({ nullable: true }).isString(),
        check('tematica', 'La temática debe ser una cadena').optional().isString(),
        check('importe_total', 'El importe total debe ser numérico y mayor o igual a 0').optional().isFloat({ min: 0 }),
        check('servicios', 'Los servicios deben ser un array de objetos').optional().isArray(),
        check('servicios.*.servicio_id', 'El ID del servicio debe ser numérico').if(check('servicios').exists()).isInt({ gt: 0 }),
        check('servicios.*.importe', 'El importe del servicio debe ser numérico y mayor o igual a 0').if(check('servicios').exists()).isFloat({ min: 0 }),
        validarCampos
    ],
    actualizarReserva
);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     description: Elimina una reserva existente (solo Admin o Empleado).
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *       404:
 *         description: Reserva no encontrada
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:reserva_id', verificarAutenticacion, autorizar([1, 2]),
    [
        check('reserva_id', 'El ID de la reserva es obligatorio y debe ser numérico').isInt({ gt: 0 }),
        validarCampos
    ],
    eliminarReserva
);

export const v1ReservaRutas = router;

