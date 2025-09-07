const mysql = require('mysql2/promise');
require('dotenv').config();




const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para obtener conexión
const getConnection = async () => {
    return await pool.getConnection();
};

// Función para liberar conexión
const releaseConnection = (connection) => {
    if (connection) connection.release();
};

module.exports = {
    pool,
    obtenerConexion: getConnection,
    liberarConexion: releaseConnection
};



