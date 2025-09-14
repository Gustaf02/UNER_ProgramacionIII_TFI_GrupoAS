import { Router } from 'express';
import { obtenerSalones, obtenerSalonPorId } from '../controladores/salonesControlador.js'

const router = Router();

router.get('/', obtenerSalones);

router.get('/:salon_id', obtenerSalonPorId);

export default router;