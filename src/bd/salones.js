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
        return resultado[0];
    }

    crear = async(salonDatos) => {
        const {titulo, direccion, capacidad, importe} = salonDatos;
        const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?,?,?,?)';
        const [resultado] = await conexion.execute(sql, [titulo, direccion, capacidad, importe]);
    }


    modificar = async(salon_id, datos) => {
        const camposEditar = Object.keys(datos);
        const valoresEditar = Object.values(datos);
        
        const setValores = camposEditar.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresEditar, salon_id];

        const sql = `UPDATE salones SET ${setValores} WHERE salon_id =?`;

        await conexion.execute(sql, parametros);
    }


    eliminar = async(salon_id) => {
        const sql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?';
        const [resultado] = await conexion.execute(sql, [salon_id]);
    }
}
