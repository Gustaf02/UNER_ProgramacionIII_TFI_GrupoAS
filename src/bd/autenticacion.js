import { conexion } from './conexion.js'

const autenticacionModelo = {
    async buscarPorUsuario(nombreUsuario) {
        try {
            const [filas] = await conexion.execute(
                `SELECT usuario_id, nombre, apellido, nombre_usuario, 
                 contrasenia, tipo_usuario, activo 
                 FROM usuarios 
                 WHERE nombre_usuario = ? AND activo = 1`,
                [nombreUsuario]
            );
            return filas[0] || null;
        } catch (error) {
            console.error('Error en buscarPorUsuario:', error);
            throw new Error('Error al buscar usuario en la base de datos');
        }
    },

    async crearUsuario(usuarioDatos) {
        try {
            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo } = usuarioDatos;

            const [resultado] = await conexion.execute(
                `INSERT INTO usuarios 
                 (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo]
            );

            return resultado.insertId;
        } catch (error) {
            console.error('Error en crearUsuario:', error);
            throw new Error('Error al crear usuario en la base de datos');
        }
    },

    async actualizarContrasenia(usuarioId, nuevaContraseniaHash) {
        try {
            const [resultado] = await conexion.execute(
                `UPDATE usuarios SET contrasenia = ? WHERE usuario_id = ?`,
                [nuevaContraseniaHash, usuarioId]
            );
            return resultado.affectedRows > 0;
        } catch (error) {
            console.error('Error en actualizarContrasenia:', error);
            throw new Error('Error al actualizar contraseña en la base de datos');
        }
    }
};


export default autenticacionModelo;