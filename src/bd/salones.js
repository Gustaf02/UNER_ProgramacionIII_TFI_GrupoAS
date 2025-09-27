import { conexion } from "./conexion.js";

export default class Salones {

    obtenerTodos = async() => {
        const sql = 'SELECT * FROM salones WHERE activo = 1';
        const [salones] = await conexion.execute(sql);
        return salones;
    }

    obtenerPorId = async(salon_id) => {
        const sql = 'SELECT * FROM salones WHERE activo = 1 AND salon_id = ?';
        const [resultado] = await conexion.execute(sql, [salon_id]);
        return resultado;
    }
}
