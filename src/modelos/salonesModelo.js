const { getConnection, releaseConnection } = require('../baseDeDatos/baseDeDatos');

const salonesModel = {
    // Obtener todos los salones activos
    async getAll() {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute(
                'SELECT * FROM salones WHERE activo = 1 ORDER BY titulo'
            );
            return rows;
        } catch (error) {
            throw new Error(`Error obteniendo salones: ${error.message}`);
        } finally {
            releaseConnection(connection);
        }
    },

    // Obtener salón por ID
    async getById(salonId) {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute(
                'SELECT * FROM salones WHERE salon_id = ? AND activo = 1',
                [salonId]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error obteniendo salón: ${error.message}`);
        } finally {
            releaseConnection(connection);
        }
    }
};

module.exports = salonesModel;