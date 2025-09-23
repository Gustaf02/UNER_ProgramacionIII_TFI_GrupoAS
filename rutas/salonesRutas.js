import { Router } from "express";
import {
  obtenerSalones,
  obtenerSalonPorId,
  crearSalon,
  actualizarSalon,
  eliminarSalon,
} from "../controladores/salonesControlador.js";

const router = Router();

// BROWSE - Obtener salones
router.get("/", obtenerSalones);

// READ - Ver un salón por ID
router.get("/:salon_id", obtenerSalonPorId);

// ADD - Agregar un muevo salón
router.post("/", crearSalon);

// EDIT - Actualizar un salón por ID
router.put("/:salon_id", actualizarSalon);

// DELETE - Eliminar un salón por ID
router.delete("/:salon_id", eliminarSalon);

export default router;
