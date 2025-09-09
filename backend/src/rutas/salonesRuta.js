const express = require('express');
const router = express.Router();
const salonesController = require('../controladores/salonesControlador');

// Rutas públicas (acceso sin autenticación)
router.get('/', salonesController.getAll);
router.get('/:id', salonesController.getById);

module.exports = router;