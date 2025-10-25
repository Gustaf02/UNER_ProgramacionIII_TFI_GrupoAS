import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizar from '../../middlewares/autorizarMiddleware.js';
import { verificarAutenticacion } from '../../middlewares/autenticacionMiddleware.js';

const salonesControlador = new SalonesControlador();

const router = express.Router();

/**
 * @swagger
 * /api/v1/salones:
 *   get:
 *     summary: Obtener todos los salones
 *     tags: [Salones]
 *     responses:
 *       200:
 *         description: Lista de salones
 */

router.get('/', verificarAutenticacion, autorizar([1, 2, 3]), salonesControlador.obtenerTodos);

router.get('/:salon_id', verificarAutenticacion, autorizar([1, 2, 3]), salonesControlador.obtenerPorId);

router.post('/', verificarAutenticacion, autorizar([1, 2]),
    [
        check('titulo', 'El titulo es necesario').notEmpty(),
        
        check('direccion', 'La direccion es necesaria').notEmpty(),
        
        check('capacidad')
            .notEmpty().withMessage('La capacidad es necesaria')
            .isNumeric().withMessage('La capacidad debe ser numerica')
            .custom(valor => valor > 0).withMessage('La capacidad debe ser mayor a 0'),
    
        check('importe')
            .notEmpty().withMessage('El importe es necesario')
            .isNumeric().withMessage('El importe debe ser numerico')
            .custom(valor => valor > 0).withMessage('El importe debe ser mayor a 0'),
        validarCampos
    ],
    salonesControlador.crear);

router.put('/:salon_id', verificarAutenticacion, autorizar([1, 2]),
    [
        check('titulo')
            .optional()
            .notEmpty().withMessage('El titulo no puede ser vacio'),
        
        check('direccion')
            .optional()
            .notEmpty().withMessage('La direccion no puede ser vacia'),
        
        check('capacidad')
            .optional()
            .notEmpty().withMessage('La capacidad no puede ser vacia')
            .isNumeric().withMessage('La capacidad debe ser numerica')
            .custom(valor => valor > 0).withMessage('La capacidad debe ser mayor a 0'),
        
        check('importe')
            .optional()
            .notEmpty().withMessage('El importe no puede ser vacio')
            .isNumeric().withMessage('El importe debe ser numerico')
            .custom(valor => valor > 0).withMessage('El importe debe ser mayor a 0'),
        validarCampos
    ],
    salonesControlador.modificar);

router.delete('/:salon_id', verificarAutenticacion, autorizar([1, 2]), salonesControlador.eliminar);

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   get:
 *     summary: Obtener un salón por ID
 *     description: Retorna la información detallada de un salón específico
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a consultar
 *         example: 1
 *     responses:
 *       200:
 *         description: Salón encontrado exitosamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:salon_id', salonesControlador.obtenerPorId);


/**
 * @swagger
 * /api/v1/salones:
 *   post:
 *     summary: Crear un nuevo salón
 *     description: Crea un nuevo salón en el sistema. Requiere autenticación y autorización de administradores.
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - direccion
 *               - capacidad
 *               - importe
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título o nombre del salón
 *                 example: "Salón Principal"
 *               direccion:
 *                 type: string
 *                 description: Dirección física del salón
 *                 example: "Av. Siempre Viva 123"
 *               capacidad:
 *                 type: integer
 *                 description: Capacidad máxima de personas
 *                 minimum: 1
 *                 example: 100
 *               importe:
 *                 type: number
 *                 format: float
 *                 description: Importe de alquiler del salón
 *                 minimum: 0
 *                 example: 1500.50
 *     responses:
 *       201:
 *         description: Salón creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', verificarAutenticacion, autorizar([1, 2]),
    [
        check('titulo', 'El titulo es necesario').notEmpty(),
        
        check('direccion', 'La direccion es necesaria').notEmpty(),
        
        check('capacidad')
            .notEmpty().withMessage('La capacidad es necesaria')
            .isNumeric().withMessage('La capacidad debe ser numerica')
            .custom(valor => valor > 0).withMessage('La capacidad debe ser mayor a 0'),
        
        check('importe')
            .notEmpty().withMessage('El importe es necesario')
            .isNumeric().withMessage('El importe debe ser numerico')
            .custom(valor => valor > 0).withMessage('El importe debe ser mayor a 0'),
        validarCampos
    ],
    salonesControlador.crear);

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   put:
 *     summary: Modificar un salón existente
 *     description: Actualiza la información de un salón. Todos los campos son opcionales.
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a modificar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título o nombre del salón
 *                 example: "Salón Principal Renovado"
 *               direccion:
 *                 type: string
 *                 description: Dirección física del salón
 *                 example: "Av. Siempre Viva 456"
 *               capacidad:
 *                 type: integer
 *                 description: Capacidad máxima de personas
 *                 minimum: 1
 *                 example: 120
 *               importe:
 *                 type: number
 *                 format: float
 *                 description: Importe de alquiler del salón
 *                 minimum: 0
 *                 example: 1800.00
 *     responses:
 *       200:
 *         description: Salón modificado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:salon_id', 
    [
        check('titulo')
            .optional()
            .notEmpty().withMessage('El titulo no puede ser vacio'),
        
        check('direccion')
            .optional()
            .notEmpty().withMessage('La direccion no puede ser vacia'),
        
        check('capacidad')
            .optional()
            .notEmpty().withMessage('La capacidad no puede ser vacia')
            .isNumeric().withMessage('La capacidad debe ser numerica')
            .custom(valor => valor > 0).withMessage('La capacidad debe ser mayor a 0'),
        
        check('importe')
            .optional()
            .notEmpty().withMessage('El importe no puede ser vacio')
            .isNumeric().withMessage('El importe debe ser numerico')
            .custom(valor => valor > 0).withMessage('El importe debe ser mayor a 0'),
        validarCampos
    ],
    salonesControlador.modificar);

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   delete:
 *     summary: Eliminar un salón
 *     description: Elimina permanentemente un salón del sistema
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Salón eliminado exitosamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:salon_id', salonesControlador.eliminar);

export { router };