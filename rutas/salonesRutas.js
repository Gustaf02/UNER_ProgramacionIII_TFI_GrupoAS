import { Router } from "express";
import {
  obtenerSalones,
  obtenerSalonPorId,
  crearSalon,
  actualizarSalon,
  eliminarSalon,
} from "../controladores/salonesControlador.js";

const router = Router();

// BROWSE - Salones
router.get("/", obtenerSalones);

// READ - Un salón por ID
router.get("/:salon_id", obtenerSalonPorId);

// ADD - Nuevo salón
router.post("/", crearSalon);

// EDIT - Actualizar un salón por ID
router.put("/:salon_id", actualizarSalon);

// DELETE - Eliminar un salón por ID
router.delete("/:salon_id", eliminarSalon);

export default router;
