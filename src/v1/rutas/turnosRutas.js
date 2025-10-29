import express from 'express';
import TurnosControlador from '../../controladores/turnosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizar from '../../middlewares/autorizarMiddleware.js';
import { verificarAutenticacion } from '../../middlewares/autenticacionMiddleware.js';

const turnosControlador = new TurnosControlador();

const router = express.Router();

// Rutas GET (Browse y Read) con permisos para Administrador (1), Empleado (2) y Cliente (3)
router.get('/', verificarAutenticacion, autorizar([1, 2, 3]), turnosControlador.obtenerTodos);
router.get('/:turno_id', verificarAutenticacion, autorizar([1, 2, 3]), turnosControlador.obtenerPorId);

// --- Ruta POST (Add) con permisos para Administrador (1) y Empleado (2)
router.post('/', verificarAutenticacion, autorizar([1, 2]),
    [
        check('orden', 'El orden es necesario').notEmpty().isInt().withMessage('El orden debe ser un número entero'),
        
        check('hora_desde', 'La hora de inicio es necesaria').notEmpty(),
        
        check('hora_hasta', 'La hora de fin es necesaria').notEmpty(),
        
        validarCampos // Middleware que verifica si hay errores de validación
    ],
    turnosControlador.crear
);

// Ruta PUT (Edit) con permisos para Administrador (1) y Empleado (2)
router.put('/:turno_id', verificarAutenticacion, autorizar([1, 2]),
    [
        // Campos opcionales para PUT (modificar)
        check('orden')
            .optional()
            .notEmpty().withMessage('El orden no puede estar vacio')
            .isInt().withMessage('El orden debe ser un número entero'),
        
        check('hora_desde')
            .optional()
            .notEmpty().withMessage('La hora de inicio no puede ser vacia'),
        
        check('hora_hasta')
            .optional()
            .notEmpty().withMessage('La hora de fin no puede ser vacia'),
            
        validarCampos
    ],
    turnosControlador.modificar
);

//Ruta DELETE con permisos para Administrador (1) y Empleado (2)

router.delete('/:turno_id', verificarAutenticacion, autorizar([1, 2]), turnosControlador.eliminar);

export { router };