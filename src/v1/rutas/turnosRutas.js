import express from 'express';
import TurnosControlador from '../../controladores/turnosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizar from '../../middlewares/autorizarMiddleware.js';
import { verificarAutenticacion } from '../../middlewares/autenticacionMiddleware.js';

const turnosControlador = new TurnosControlador();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Turnos
 *     description: Gestión de los turnos/horarios disponibles para reservas
 */

/**
 * @swagger
 * /api/v1/turnos:
 *   get:
 *     summary: Obtener todos los turnos disponibles
 *     description: Retorna una lista de todos los turnos activos. Accesible para todos los roles.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos encontrada exitosamente
 */
router.get('/', verificarAutenticacion, autorizar([1, 2, 3]), turnosControlador.obtenerTodos);

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     description: Retorna la información de un turno específico. Accesible para todos los roles.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a consultar
 *     responses:
 *       200:
 *         description: Turno encontrado exitosamente
 *       404:
 *         description: Turno no encontrado
 */
router.get('/:turno_id', verificarAutenticacion, autorizar([1, 2, 3]), turnosControlador.obtenerPorId);

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     description: Crea un nuevo turno. Requiere roles Administrador o Empleado.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orden
 *               - hora_desde
 *               - hora_hasta
 *             properties:
 *               orden:
 *                 type: integer
 *                 description: Orden en la lista de turnos
 *               hora_desde:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio del turno
 *               hora_hasta:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin del turno
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       403:
 *         description: No autorizado
 */
router.post(
  '/',
  verificarAutenticacion,
  autorizar([1, 2]),
  [
    check('orden', 'El orden es necesario').notEmpty().isInt().withMessage('El orden debe ser un número entero'),
    check('hora_desde', 'La hora de inicio es necesaria').notEmpty(),
    check('hora_hasta', 'La hora de fin es necesaria').notEmpty(),
    validarCampos
  ],
  turnosControlador.crear
);

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   put:
 *     summary: Modificar un turno existente
 *     description: Actualiza la información de un turno. Los campos son opcionales. Requiere Admin o Empleado.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden:
 *                 type: integer
 *                 description: Nuevo orden en la lista
 *               hora_desde:
 *                 type: string
 *                 format: time
 *                 description: Nueva hora de inicio
 *               hora_hasta:
 *                 type: string
 *                 format: time
 *                 description: Nueva hora de fin
 *     responses:
 *       200:
 *         description: Turno modificado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Turno no encontrado
 */
router.put(
  '/:turno_id',
  verificarAutenticacion,
  autorizar([1, 2]),
  [
    check('orden').optional().isInt().withMessage('El orden debe ser un número entero'),
    check('hora_desde').optional().notEmpty().withMessage('La hora de inicio no puede ser vacía'),
    check('hora_hasta').optional().notEmpty().withMessage('La hora de fin no puede ser vacía'),
    validarCampos
  ],
  turnosControlador.modificar
);

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   delete:
 *     summary: Eliminar (Soft Delete) un turno
 *     description: Realiza un borrado lógico (soft delete). Requiere Admin o Empleado.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a eliminar
 *     responses:
 *       200:
 *         description: Turno eliminado exitosamente
 *       404:
 *         description: Turno no encontrado
 */
router.delete('/:turno_id', verificarAutenticacion, autorizar([1, 2]), turnosControlador.eliminar);

export { router };
