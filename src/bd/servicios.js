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

    modificar = async(servicio_id, datos) => {
        const camposEditar = Object.keys(datos);
        const valoresEditar = Object.values(datos);
        
        const setValores = camposEditar.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresEditar, servicio_id];

        const sql = `UPDATE servicios SET ${setValores} WHERE servicio_id =?`;

        await conexion.execute(sql, parametros);
    }


    eliminar = async(servicio_id) => {
        const sql = 'UPDATE servicios SET activo = 0 WHERE servicio_id = ?';
        await conexion.execute(sql, [servicio_id]);
    }
}