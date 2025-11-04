import { conexion } from "./conexion.js";

export default class Usuarios {

    obtenerTodos = async() => {
        const sql = 'SELECT * FROM usuarios WHERE activo = 1';
        const [usuarios] = await conexion.execute(sql);
        return usuarios;
    }

    obtenerPorId = async(usuario_id) => {
        const sql = 'SELECT * FROM usuarios WHERE activo = 1 AND usuario_id = ?';
        const [resultado] = await conexion.execute(sql, [usuario_id]);
        return resultado[0];
    }

    crear = async(usuarioDatos) => {
        const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto} = usuarioDatos;
        const sql = 'INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) VALUES (?,?,?,?,?,?,?)';
        await conexion.execute(sql, [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto]);
    }


    modificar = async(usuario_id, datos) => {
        const camposEditar = Object.keys(datos);
        const valoresEditar = Object.values(datos);
        
        const setValores = camposEditar.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresEditar, usuario_id];

        const sql = `UPDATE usuarios SET ${setValores} WHERE usuario_id =?`;

        await conexion.execute(sql, parametros);
    }
    // modificar = async(usuarioDatos) => {
    //     const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, usuario_id} = usuarioDatos;
    //     let sql, valores;
    //     if (contrasenia){
    //         sql = 'UPDATE usuarios SET nombre = ?, apellido = ?, nombre_usuario = ?, contrasenia = ?, tipo_usuario = ?, celular = ?, foto =? WHERE usuario_id = ?';
    //         valores = [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, usuario_id];
    //     }else{
    //         sql = 'UPDATE usuarios SET nombre = ?, apellido = ?, nombre_usuario = ?, tipo_usuario = ?, celular = ?, foto =? WHERE usuario_id = ?';
    //         valores = [nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, usuario_id];
    //     }
        
    //     await conexion.execute(sql, valores);
    // }

    eliminar = async(usuario_id) => {
        const sql = 'UPDATE usuarios SET activo = 0 WHERE usuario_id = ?';
        await conexion.execute(sql, [usuario_id]);
    }

    existeNombreUsuario = async(nombre_usuario, id_propio = null) => {
        let sql = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
        let valores = [nombre_usuario];
        if (id_propio){
            sql += ' AND usuario_id != ?';
            valores.push(id_propio);
        }
        const [resultado] = await conexion.execute(sql, valores);
        return resultado.length > 0;
    }
}