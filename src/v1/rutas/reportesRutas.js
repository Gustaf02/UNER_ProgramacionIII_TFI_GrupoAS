import { Router } from "express";
import { verificarAutenticacion } from "../../middlewares/autenticacionMiddleware.js";
import autorizar from "../../middlewares/autorizarMiddleware.js";
import { reporteReservasPDF, obtenerEstadisticas } from "../../controladores/reportesControlador.js"

const router = Router();

// =======================================================
// SWAGGER TAGS
// =======================================================
/**
 * @swagger
 * tags:
 * name: Reportes y Estadísticas
 * description: Generación de informes (PDF, CSV, etc.) y acceso a estadísticas. Acceso exclusivo para Administrador.
 */

// =======================================================
// [R] READ: Generar Reporte de Reservas en PDF
// Roles: [1]
// =======================================================
/**
 * @swagger
 * /api/v1/reportes/informe:
 * get:
 * summary: Generar Reporte de Reservas en PDF
 * description: Descarga un informe detallado de todas las reservas activas en formato PDF. Requiere rol Administrador (1).
 * tags: [Reportes y Estadísticas]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Reporte PDF generado y listo para descargar.
 * content:
 * application/pdf:
 * schema:
 * type: string
 * format: binary
 * 403:
 * description: Acceso denegado (No es Administrador)
 */
router.get("/informe", verificarAutenticacion, autorizar([1]), reporteReservasPDF);

// =======================================================
// [R] READ: Obtener Estadísticas
// Roles: [1]
// =======================================================
/**
 * @swagger
 * /api/v1/reportes/estadisticas:
 * get:
 * summary: Obtener estadísticas generales
 * description: Retorna un informe estadístico generado mediante un procedimiento almacenado. Requiere rol Administrador (1).
 * tags: [Reportes y Estadísticas]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Informe estadístico obtenido exitosamente.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * ok: { type: boolean }
 * informe: 
 * type: object
 * description: Datos estadísticos del sp_reportes.
 * properties:
 * total_usuarios_activos: { type: integer, example: 5 }
 * total_reservas: { type: integer, example: 3 }
 * salon_mas_reservado: { type: string, example: "Principal" }
 * 403:
 * description: Acceso denegado
 */
router.get("/estadisticas", verificarAutenticacion, autorizar([1]), obtenerEstadisticas);

export { router };