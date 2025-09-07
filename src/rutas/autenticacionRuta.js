const express = require('express');
const router = express.Router();
const autenticacionControlador = require('../controladores/autenticacionControlador');
//const autenticacionControlador = require('./../controladores/autenticacionControlador');

// Ruta pública para inicio de sesión
router.post('/login', autenticacionControlador.iniciarSesion);

module.exports = router;