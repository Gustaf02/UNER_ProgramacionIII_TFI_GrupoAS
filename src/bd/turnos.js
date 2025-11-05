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
    modificar = async(turno_id, datos) => {
        // Lógica que acepta campos dinámicos
        const camposEditar = Object.keys(datos);
        const valoresEditar = Object.values(datos);
        
        const setValores = camposEditar.map(campo => `${campo} = ?`).join(', ');
        // Los parámetros son los valores a editar, seguidos del ID
        const parametros = [...valoresEditar, turno_id]; 
        
        const sql = `UPDATE turnos SET ${setValores} WHERE turno_id = ?`;

        await conexion.execute(sql, parametros);
    }
    
    // Método para eliminar un turno con soft delete
    eliminar = async(turno_id) => {
        // UPDATE cambia 'activo' a 0
        const sql = 'UPDATE turnos SET activo = 0 WHERE turno_id = ?';
        const [resultado] = await conexion.execute(sql, [turno_id]);
        return resultado.affectedRows;
    }
}