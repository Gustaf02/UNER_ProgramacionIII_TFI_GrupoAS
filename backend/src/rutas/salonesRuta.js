const express = require('express');
const router = express.Router();
const salonesController = require('../controladores/salonesControlador');

// Rutas públicas (acceso sin autenticación)
router.get('/', salonesController.obtenerTodos);          // Browse (Listar)
router.get('/:id', salonesController.obtenerPorId);       // Read (Leer uno)
router.post('/', salonesController.crear);                // Add (Crear)
router.put('/:id', salonesController.actualizar);         // Edit (Actualizar)
router.patch('/:id', salonesController.actualizar);       // Edit (Actualizar parcial - alternativa)
router.delete('/:id', salonesController.desactivar);      // Delete (Desactivar)

module.exports = router;