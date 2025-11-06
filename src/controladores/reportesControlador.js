import { reportesServicio } from "../servicios/reportesServicio.js";

export const reporteReservasPDF = async (req, res) => {
    try {
        const path = await reportesServicio.generarPDF();
        res.download(path, "reporte_reservas.pdf");
    } catch (error) {
        console.error("Error al generar reporte PDF:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor al generar el reporte PDF.",
        });
    }
};


export const obtenerEstadisticas = async (req, res) => {
    try {
        const datos = await reportesServicio.obtenerEstadisticas();
        res.status(200).json({
            ok: true,
            informe: datos,
        });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno al obtener estadísticas.",
        });
    }
};