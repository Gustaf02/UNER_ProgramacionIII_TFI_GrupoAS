import express from 'express';
const router = express.Router();
import autenticacionControlador from '../../controladores/autenticacionControlador.js';

console.log('Autenticacion Controlador cargado:', !!autenticacionControlador);
console.log('Función iniciarSesion existe:', !!autenticacionControlador.iniciarSesion);
console.log('Función crearUsuario existe:', !!autenticacionControlador.crearUsuario);

router.post('/registro', autenticacionControlador.crearUsuario);
router.post('/login', autenticacionControlador.iniciarSesion);
router.post('/recuperar-contrasenia', autenticacionControlador.recuperarContrasenia);
router.post('/restablecer-contrasenia', autenticacionControlador.restablecerContrasenia);

export default router;