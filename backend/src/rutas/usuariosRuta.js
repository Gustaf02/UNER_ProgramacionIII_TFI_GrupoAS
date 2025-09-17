const express = require('express');
const router = express.Router();
const usuariosControlador = require('../controladores/usuariosControlador');

/**
 * @route GET /api/usuarios
 * @description Obtiene todos los usuarios
 * @access Privado (solo admin)
 */
router.get('/', usuariosControlador.obtenerTodos);

/**
 * @route GET /api/usuarios/:id
 * @description Obtiene un usuario por su ID
 * @access Privado (admin o propio usuario)
 */
router.get('/:id', usuariosControlador.obtenerPorId);

/**
 * @route GET /api/usuarios/tipo/:tipo
 * @description Obtiene usuarios por tipo de usuario
 * @access Privado (solo admin)
 */
router.get('/tipo/:tipo', usuariosControlador.obtenerPorTipo);

module.exports = router;