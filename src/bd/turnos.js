import { conexion } from "./conexion.js";

export default class Turnos {


    obtenerTodos = async() => {
        const sql = 'SELECT * FROM turnos WHERE activo = 1 ORDER BY orden ASC';
        const [turnos] = await conexion.execute(sql);
        return turnos;
    }


    obtenerPorId = async(turno_id) => {
        const sql = 'SELECT * FROM turnos WHERE activo = 1 AND turno_id = ?';
        const [resultado] = await conexion.execute(sql, [turno_id]);
        return resultado[0]; // Retorna el primer resultado o undefined
    }


    crear = async(turnoDatos) => {
        const {orden, hora_desde, hora_hasta} = turnoDatos;
        const sql = 'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?,?,?)';
        const [resultado] = await conexion.execute(sql, [orden, hora_desde, hora_hasta]);

        return resultado.insertId;
    }


    modificar = async(turno_id, datos) => {

        const camposEditar = Object.keys(datos);
        const valoresEditar = Object.values(datos);
        
        const setValores = camposEditar.map(campo => `${campo} = ?`).join(', ');

        const parametros = [...valoresEditar, turno_id]; 
        
        const sql = `UPDATE turnos SET ${setValores} WHERE turno_id = ?`;

        await conexion.execute(sql, parametros);
    }
    

    eliminar = async(turno_id) => {

        const sql = 'UPDATE turnos SET activo = 0 WHERE turno_id = ?';
        const [resultado] = await conexion.execute(sql, [turno_id]);
        return resultado.affectedRows;
    }
}