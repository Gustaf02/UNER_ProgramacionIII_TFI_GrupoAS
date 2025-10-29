import { conexion } from "./conexion.js";

export default class Turnos {

    // Método que trae todos los turnos 
    obtenerTodos = async() => {
        // Selecciona activo = 1  y ordena
        const sql = 'SELECT * FROM turnos WHERE activo = 1 ORDER BY orden ASC';
        const [turnos] = await conexion.execute(sql);
        return turnos;
    }

    // Método para obtener un turno por su ID
    obtenerPorId = async(turno_id) => {
        const sql = 'SELECT * FROM turnos WHERE activo = 1 AND turno_id = ?';
        const [resultado] = await conexion.execute(sql, [turno_id]);
        return resultado[0]; // Retorna el primer resultado o undefined
    }

    // Método para crear un nuevo turno
    crear = async(turnoDatos) => {
        const {orden, hora_desde, hora_hasta} = turnoDatos;
        const sql = 'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?,?,?)';
        const [resultado] = await conexion.execute(sql, [orden, hora_desde, hora_hasta]);
        // Retorna el ID del turno insertado
        return resultado.insertId;
    }

    // Método para modificar un turno existente
    modificar = async(turnoDatos) => {
        const {orden, hora_desde, hora_hasta, turno_id} = turnoDatos;
        const sql = `UPDATE turnos 
                     SET orden = ?, hora_desde = ?, hora_hasta = ? 
                     WHERE turno_id = ?`;
        const [resultado] = await conexion.execute(sql, [orden, hora_desde, hora_hasta, turno_id]);

        return resultado.affectedRows;
    }

    // Método para eliminar un turno con soft delete
    eliminar = async(turno_id) => {
        // UPDATE cambia 'activo' a 0
        const sql = 'UPDATE turnos SET activo = 0 WHERE turno_id = ?';
        const [resultado] = await conexion.execute(sql, [turno_id]);
        return resultado.affectedRows;
    }
}