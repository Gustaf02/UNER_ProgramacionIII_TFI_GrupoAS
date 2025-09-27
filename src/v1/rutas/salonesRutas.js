import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js'

const salonesControlador = new SalonesControlador();

const router = express.Router();

router.get('/', salonesControlador.obtenerTodos);

// router.get('/:salon_id', obtenerSalonPorId);

// router.post('/', crearSalon);

// router.put('/:salon_id', modificarSalon);

// router.delete('/:salon_id', eliminarSalon);

export { router };