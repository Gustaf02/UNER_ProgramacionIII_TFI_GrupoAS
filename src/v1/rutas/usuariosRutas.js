import express from 'express';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizar from '../../middlewares/autorizarMiddleware.js';
import { verificarAutenticacion } from '../../middlewares/autenticacionMiddleware.js';

const usuariosControlador = new UsuariosControlador();

const router = express.Router();

router.get('/', verificarAutenticacion, autorizar([1]), usuariosControlador.obtenerTodos);


router.get('/:usuario_id', verificarAutenticacion, autorizar([1]), usuariosControlador.obtenerPorId);


router.post('/', verificarAutenticacion, autorizar([1]),
    [
        check('nombre', 'El nombre es necesario').notEmpty(),
        
        check('apellido', 'El apellido es necesario').notEmpty(),

        check('nombre_usuario', 'El nombre de usuario es necesario').notEmpty(),

        check('contrasenia', 'La contrasenia es necesaria').notEmpty(),

        check('tipo_usuario')
            .notEmpty().withMessage('El tipo de usuario es necesario')
            .isNumeric().withMessage('El tipo de usuario debe ser numerico')
            .custom(valor => 
                    Number.isInteger(Number(valor)) && (valor == '1' || valor == '2' || valor == '3'))
                    .withMessage('El tipo de usuario debe ser 1, 2 o 3'),
        
        check('celular')
            .notEmpty().withMessage('El celular es necesario')
            .isNumeric().withMessage('El celular debe ser numerico'),
    
        check('foto')
            .optional(),
        
        validarCampos
    ],
    usuariosControlador.crear);


router.put('/:usuario_id', verificarAutenticacion, autorizar([1]),
    [
        check('nombre', 'El nombre es necesario')
            .optional()
            .notEmpty(),
        
        check('apellido', 'El apellido es necesario')
            .optional()
            .notEmpty(),

        check('nombre_usuario', 'El nombre de usuario es necesario')
            .optional()
            .notEmpty(),

        check('contrasenia', 'La contrasenia es necesaria')
            .optional()
            .notEmpty(),

        check('tipo_usuario')
            .optional()
            .notEmpty().withMessage('El tipo de usuario es necesario')
            .isNumeric().withMessage('El tipo de usuario debe ser numerico')
            .custom(valor => 
                    Number.isInteger(Number(valor)) && (valor == '1' || valor == '2' || valor == '3'))
                    .withMessage('El tipo de usuario debe ser 1, 2 o 3'),
        
        check('celular')
            .optional()
            .notEmpty().withMessage('El celular es necesario')
            .isNumeric().withMessage('El celular debe ser numerico'),
    
        check('foto')
            .optional(),
        validarCampos
    ],
    usuariosControlador.modificar);


router.delete('/:usuario_id', verificarAutenticacion, autorizar([1]), usuariosControlador.eliminar);


export { router };