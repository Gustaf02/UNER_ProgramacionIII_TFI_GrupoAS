import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizar from '../../middlewares/autorizarMiddleware.js';
import { verificarAutenticacion } from '../../middlewares/autenticacionMiddleware.js';

const salonesControlador = new SalonesControlador();

const router = express.Router();

router.get('/', salonesControlador.obtenerTodos, verificarAutenticacion, autorizar([1, 2, 3]));

router.get('/:salon_id', salonesControlador.obtenerPorId);

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

router.delete('/:salon_id', salonesControlador.eliminar);

export { router };