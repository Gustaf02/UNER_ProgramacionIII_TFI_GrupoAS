import { reportesModelo } from "../bd/reportes.js";
import { reservasModelo } from "../bd/reservas.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

class ReportesServicio {
    async generarPDF() {
        const reservas = await reservasModelo.obtenerTodas();

        const doc = new PDFDocument({ margin: 30 });
        fs.mkdirSync("./reportes", { recursive: true });

        const pdfPath = path.resolve("reportes", "reporte_reservas.pdf");
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        doc.fontSize(18).text("Reporte de Reservas", { align: "center" });
        doc.moveDown();

        reservas.forEach((r) => {
            doc
                .fontSize(12)
                .text(
                    `Reserva #${r.reserva_id} - ${r.fecha_reserva}
                    
Cliente: ${r.cliente_usuario}

Salón: ${r.nombre_salon}

Turno: ${r.turno_desde}

Temática: ${r.tematica}

Importe Total: $${r.importe_total}

--------------------------------------`);
        });

        doc.end();

        await new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });

        return pdfPath;
    }


    async obtenerEstadisticas() {
        const resultado = await reportesModelo.obtenerInformeGeneral();
        return resultado;
    }
}

export const reportesServicio = new ReportesServicio();