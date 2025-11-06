import { Router } from "express";
import { verificarAutenticacion } from "../../middlewares/autenticacionMiddleware.js";
import autorizar from "../../middlewares/autorizarMiddleware.js";
import {reporteReservasPDF, obtenerEstadisticas } from "../../controladores/reportesControlador.js"

const router = Router();

router.get("/informe", verificarAutenticacion, autorizar([1]), reporteReservasPDF);
router.get("/estadisticas", verificarAutenticacion, autorizar([1]), obtenerEstadisticas);

export {router};