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

        validarCampos
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
