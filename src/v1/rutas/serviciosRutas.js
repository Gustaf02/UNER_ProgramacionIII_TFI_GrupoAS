import express from 'express';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizar from '../../middlewares/autorizarMiddleware.js';
import { verificarAutenticacion } from '../../middlewares/autenticacionMiddleware.js';

const serviciosControlador = new ServiciosControlador();

const router = express.Router();

router.get('/', verificarAutenticacion, autorizar([1, 2, 3]), serviciosControlador.obtenerTodos);

router.get('/:servicio_id', verificarAutenticacion, autorizar([1, 2, 3]), serviciosControlador.obtenerPorId);

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

router.delete('/:servicio_id', verificarAutenticacion, autorizar([1, 2]), serviciosControlador.eliminar);

export { router };