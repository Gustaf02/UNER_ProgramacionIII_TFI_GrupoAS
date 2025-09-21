const express = require('express');
const router = express.Router();
const salonesControlador = require('../controladores/salonesControlador');
const autorizar = require('../middlewares/autorizarMiddleware')
const { verificarAutenticacion } = require('../middlewares/autenticacionMiddleware')

// Rutas públicas (acceso sin autenticación)
router.get('/', verificarAutenticacion, autorizar([1, 2, 3]), salonesControlador.obtenerTodos);          
router.get('/:id', verificarAutenticacion, autorizar([1, 2, 3]), salonesControlador.obtenerPorId);       
router.post('/', verificarAutenticacion, autorizar([1, 2]) ,salonesControlador.crear);               
router.put('/:id', verificarAutenticacion, autorizar([1, 2]), salonesControlador.actualizar);         
router.patch('/:id', verificarAutenticacion, autorizar([1, 2]), salonesControlador.actualizar);       
router.delete('/:id', verificarAutenticacion, autorizar([1]), salonesControlador.desactivar);      

module.exports = router;