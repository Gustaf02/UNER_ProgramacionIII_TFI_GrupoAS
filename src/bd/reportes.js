import { conexion } from "./conexion.js";

export const reportesModelo = {
    obtenerInformeGeneral: async () => {
        const [resultado] = await conexion.query("CALL sp_reportes();");
        return resultado[0]; 
    }
};
