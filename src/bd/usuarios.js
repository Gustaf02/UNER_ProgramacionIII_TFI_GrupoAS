import { conexion } from "./conexion.js";
import { encriptarContrasenia } from "../token/contraseniaEncriptada.js";

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
        const contrasenia_encriptada = encriptarContrasenia(contrasenia);
        const sql = 'INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) VALUES (?,?,?,?,?,?,?)';
        await conexion.execute(sql, [nombre, apellido, nombre_usuario, contrasenia_encriptada, tipo_usuario, celular, foto]);
    }

    modificar = async(usuarioDatos) => {
        const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, usuario_id} = usuarioDatos;
        const sql = 'UPDATE usuarios SET nombre = ?, apellido = ?, nombre_usuario = ?, contrasenia = ?, tipo_usuario = ?, celular = ?, foto =? WHERE usuario_id = ?';
        await conexion.execute(sql, [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, usuario_id]);
    }

    eliminar = async(usuario_id) => {
        const sql = 'UPDATE usuarios SET activo = 0 WHERE usuario_id = ?';
        await conexion.execute(sql, [usuario_id]);
    }
}