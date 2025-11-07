// src/v1/rutas/reportesRutas.js
import { Router } from "express";
import { reporteReservasPDF, obtenerEstadisticas } from "../../controladores/reportesControlador.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reportes
 *     description: Endpoints para la generación de reportes y estadísticas del sistema
 */

/**
 * @swagger
 * /api/v1/reportes/pdf:
 *   get:
 *     summary: Generar y descargar reporte PDF de reservas
 *     tags: [Reportes]
 *     description: Genera un archivo PDF con el listado de reservas registradas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado correctamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error interno del servidor al generar el reporte PDF.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno del servidor al generar el reporte PDF."
 */
router.get("/pdf", reporteReservasPDF);

/**
 * @swagger
 * /api/v1/reportes/estadisticas:
 *   get:
 *     summary: Obtener estadísticas generales del sistema
 *     tags: [Reportes]
 *     description: Retorna estadísticas globales como reservas totales, salones más utilizados y servicios más contratados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 informe:
 *                   type: object
 *                   properties:
 *                     reservasTotales:
 *                       type: integer
 *                       example: 120
 *                     salonMasReservado:
 *                       type: string
 *                       example: "Salón Principal"
 *                     servicioMasContratado:
 *                       type: string
 *                       example: "Catering Premium"
 *                     ingresosTotales:
 *                       type: number
 *                       format: float
 *                       example: 1250000.50
 *       500:
 *         description: Error interno del servidor al obtener estadísticas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno al obtener estadísticas."
 */
router.get("/estadisticas", obtenerEstadisticas);

export { router };

