const { obtenerConexion, liberarConexion } = require('../baseDeDatos/baseDeDatos');

const autenticacionModelo = {
    async buscarPorUsuario(nombreUsuario) {
        let conexion;
        try {
            conexion = await obtenerConexion();
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
        } finally {
            if (conexion) liberarConexion(conexion);
        }
    }
};

module.exports = autenticacionModelo;