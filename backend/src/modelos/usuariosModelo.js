const { obtenerConexion, liberarConexion } = require('../baseDeDatos/baseDeDatos');

const usuariosModelo = {
    /**
     * Obtiene todos los usuarios de la base de datos
     * @returns {Promise<Array>} Lista de usuarios
     */
    async obtenerTodos() {
        let conexion;
        try {
            conexion = await obtenerConexion();
            const [usuarios] = await conexion.execute(
                `SELECT 
                    usuario_id,
                    nombre,
                    apellido,
                    nombre_usuario,
                    contrasenia,
                    tipo_usuario,
                    celular,
                    foto,
                    activo,
                    creado,
                    modificado
                 FROM usuarios 
                 ORDER BY creado DESC`
            );
            return usuarios;
        } catch (error) {
            console.error('Error en obtenerTodos:', error);
            throw new Error('Error al obtener los usuarios de la base de datos');
        } finally {
            if (conexion) liberarConexion(conexion);
        }
    },

    /**
     * Obtiene un usuario por su ID
     * @param {number} id - ID del usuario a buscar
     * @returns {Promise<Object|null>} Usuario encontrado o null
     */
    async obtenerPorId(id) {
        let conexion;
        try {
            conexion = await obtenerConexion();
            const [usuarios] = await conexion.execute(
                `SELECT 
                    usuario_id,
                    nombre,
                    apellido,
                    nombre_usuario,
                    contrasenia,
                    tipo_usuario,
                    celular,
                    foto,
                    activo,
                    creado,
                    modificado
                 FROM usuarios 
                 WHERE usuario_id = ?`,
                [id]
            );
            return usuarios[0] || null;
        } catch (error) {
            console.error('Error en obtenerPorId:', error);
            throw new Error('Error al obtener el usuario por ID');
        } finally {
            if (conexion) liberarConexion(conexion);
        }
    },

    /**
     * Obtiene usuarios por tipo de usuario
     * @param {number} tipoUsuario - Tipo de usuario a filtrar
     * @returns {Promise<Array>} Lista de usuarios filtrados por tipo
     */
    async obtenerPorTipo(tipoUsuario) {
        let conexion;
        try {
            conexion = await obtenerConexion();
            const [usuarios] = await conexion.execute(
                `SELECT 
                    usuario_id,
                    nombre,
                    apellido,
                    nombre_usuario,
                    contrasenia,
                    tipo_usuario,
                    celular,
                    foto,
                    activo,
                    creado,
                    modificado
                 FROM usuarios 
                 WHERE tipo_usuario = ?
                 ORDER BY nombre, apellido`,
                [tipoUsuario]
            );
            return usuarios;
        } catch (error) {
            console.error('Error en obtenerPorTipo:', error);
            throw new Error('Error al obtener usuarios por tipo');
        } finally {
            if (conexion) liberarConexion(conexion);
        }
    }
};

module.exports = usuariosModelo;