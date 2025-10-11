import { conexion } from "./conexion.js";

export default class Servicios {

    obtenerTodos = async() => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1';
        const [servicios] = await conexion.execute(sql);
        return servicios;
    }

    obtenerPorId = async(servicio_id) => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1 AND servicio_id = ?';
        const [resultado] = await conexion.execute(sql, [servicio_id]);
        return resultado[0];
    }

    crear = async(servicioDatos) => {
        const {descripcion, importe} = servicioDatos;
        const sql = 'INSERT INTO servicios (descripcion, importe) VALUES (?,?)';
        await conexion.execute(sql, [descripcion, importe]);
    }

    modificar = async(servicioDatos) => {
        const {descripcion, importe, servicio_id} = servicioDatos;
        const sql = 'UPDATE servicios SET descripcion = ?, importe = ? WHERE servicio_id = ?';
        await conexion.execute(sql, [descripcion, importe, servicio_id]);
    }

    eliminar = async(servicio_id) => {
        const sql = 'UPDATE servicios SET activo = 0 WHERE servicio_id = ?';
        await conexion.execute(sql, [servicio_id]);
    }
}