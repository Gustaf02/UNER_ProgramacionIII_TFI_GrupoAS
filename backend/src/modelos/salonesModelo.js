const { obtenerConexion, liberarConexion } = require('../baseDeDatos/baseDeDatos');

const salonesModelo = {
    // Obtener todos los salones activos
    async obtenerTodos() {
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
    async obtenerPorId(salonId) {
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
    },

    // Crear nuevo salón
    async crear(datosSalon) {
        let connection;
        try {
            connection = await obtenerConexion();
            const { titulo, direccion, latitud, longitud, capacidad, importe } = datosSalon;
            
            const [resultado] = await connection.execute(
                `INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [titulo, direccion, latitud, longitud, capacidad, importe]
            );
            
            return resultado.insertId; // Devuelve el ID del nuevo salón
        } catch (error) {
            throw new Error(`Error creando salón: ${error.message}`);
        } finally {
            liberarConexion(connection);
        }
    },

    // Actualizar salón existente
    async actualizar(idSalon, nuevosDatos) {
        let connection;
        try {
            connection = await obtenerConexion();
            
            // Construir la parte SET de la consulta dinámicamente
            const campos = Object.keys(nuevosDatos);
            const valores = Object.values(nuevosDatos);
            
            if (campos.length === 0) {
                throw new Error('No se proporcionaron campos para actualizar');
            }
            
            const setClause = campos.map(campo => `${campo} = ?`).join(', ');
            const query = `UPDATE salones 
                           SET ${setClause}, modificado = CURRENT_TIMESTAMP 
                           WHERE salon_id = ? AND activo = 1`;
            
            const [resultado] = await connection.execute(
                query,
                [...valores, idSalon]
            );
            
            return resultado.affectedRows; // Número de filas afectadas
        } catch (error) {
            throw new Error(`Error actualizando salón: ${error.message}`);
        } finally {
            liberarConexion(connection);
        }
    },

    // Desactivar salón (eliminación lógica)
    async desactivar(idSalon) {
        let connection;
        try {
            connection = await obtenerConexion();
            const [resultado] = await connection.execute(
                'UPDATE salones SET activo = 0, modificado = CURRENT_TIMESTAMP WHERE salon_id = ?',
                [idSalon]
            );
            
            return resultado.affectedRows; // Número de filas afectadas
        } catch (error) {
            throw new Error(`Error desactivando salón: ${error.message}`);
        } finally {
            liberarConexion(connection);
        }
    }
};

module.exports = salonesModelo;