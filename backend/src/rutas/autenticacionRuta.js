const express = require('express');
const router = express.Router();
const autenticacionControlador = require('../controladores/autenticacionControlador');


console.log('Autenticacion Controlador cargado:', !!autenticacionControlador);
console.log('Función iniciarSesion existe:', !!autenticacionControlador.iniciarSesion);
console.log('Función crearUsuario existe:', !!autenticacionControlador.crearUsuario);


router.post('/registro', autenticacionControlador.crearUsuario);
// Ruta pública para inicio de sesión
router.post('/login', autenticacionControlador.iniciarSesion);


module.exports = router;