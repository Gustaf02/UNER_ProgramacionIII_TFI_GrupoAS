import express from 'express';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizar from '../../middlewares/autorizarMiddleware.js';
import { verificarAutenticacion } from '../../middlewares/autenticacionMiddleware.js';

const serviciosControlador = new ServiciosControlador();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Gestión de servicios adicionales ofrecidos (BREAD)
 */

/**
 * @swagger
 * /api/v1/servicios:
 *   get:
 *     summary: Obtener todos los servicios activos
 *     description: Retorna la lista de servicios activos. Accesible para todos los roles.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
router.get('/', verificarAutenticacion, autorizar([1, 2, 3]), serviciosControlador.obtenerTodos);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     description: Retorna el detalle de un servicio específico. Accesible para todos los roles.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a consultar
 *     responses:
 *       200:
 *         description: Servicio encontrado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/:servicio_id', verificarAutenticacion, autorizar([1, 2, 3]), serviciosControlador.obtenerPorId);

/**
 * @swagger
 * /api/v1/servicios:
 *   post:
 *     summary: Crear un nuevo servicio
 *     description: Crea un nuevo servicio. Requiere roles Administrador o Empleado.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - importe
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Descripción del servicio
 *               importe:
 *                 type: number
 *                 format: float
 *                 description: Costo del servicio
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       403:
 *         description: No autorizado
 */
router.post('/', verificarAutenticacion, autorizar([1, 2]),
    [
        check('descripcion', 'La descripcion es necesaria').notEmpty(),
        check('importe')
            .notEmpty().withMessage('El importe es necesario')
            .isNumeric().withMessage('El importe debe ser numerico')
            .custom(valor => valor > 0).withMessage('El importe debe ser mayor a 0'),
        validarCampos
    ],
    serviciosControlador.crear);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   put:
 *     summary: Modificar un servicio existente
 *     description: Actualiza la información de un servicio. Los campos son opcionales. Requiere Admin/Empleado.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del servicio
 *               importe:
 *                 type: number
 *                 format: float
 *                 description: Nuevo costo del servicio
 *     responses:
 *       200:
 *         description: Servicio modificado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/:servicio_id', verificarAutenticacion, autorizar([1, 2]),
    [
        check('descripcion')
            .optional()
            .notEmpty().withMessage('La descripcion no puede ser vacia'),

        check('importe')
            .optional()
            .notEmpty().withMessage('El importe no puede ser vacio')
            .isNumeric().withMessage('El importe debe ser numerico')
            .custom(valor => valor > 0).withMessage('El importe debe ser mayor a 0'),
        validarCampos
    ],
    serviciosControlador.modificar);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   delete:
 *     summary: Eliminar (Soft Delete) un servicio
 *     description: Realiza un borrado lógico (soft delete). Requiere Admin/Empleado.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a eliminar
 *     responses:
 *       200:
 *         description: Servicio eliminado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/:servicio_id', verificarAutenticacion, autorizar([1, 2]), serviciosControlador.eliminar);

export { router };
