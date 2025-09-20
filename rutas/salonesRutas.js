import { Router } from 'express';
import { obtenerSalones, obtenerSalonPorId, crearSalon, modificarSalon, eliminarSalon } from '../controladores/salonesControlador.js'

const router = Router();

router.get('/', obtenerSalones);

router.get('/:salon_id', obtenerSalonPorId);

router.post('/', crearSalon);

router.put('/:salon_id', modificarSalon);

router.delete('/:salon_id', eliminarSalon);

export default router;