const { obtenerConexion, liberarConexion } = require('../baseDeDatos/baseDeDatos');

const salonesModelo = {
    // Obtener todos los salones activos
    async getAll() {
        let connection;
        try {
            connection = await obtenerConexion();
            const [rows] = await connection.execute(
                'SELECT * FROM salones WHERE activo = 1 ORDER BY titulo'
            );
            return rows;
        } catch (error) {
            throw new Error(`Error obteniendo salones: ${error.message}`);
        } finally {
            liberarConexion(connection);
        }
    },

    // Obtener salón por ID
    async getById(salonId) {
        let connection;
        try {
            connection = await obtenerConexion();
            const [rows] = await connection.execute(
                'SELECT * FROM salones WHERE salon_id = ? AND activo = 1',
                [salonId]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error obteniendo salón: ${error.message}`);
        } finally {
            liberarConexion(connection);
        }
    }
};

module.exports = salonesModelo;