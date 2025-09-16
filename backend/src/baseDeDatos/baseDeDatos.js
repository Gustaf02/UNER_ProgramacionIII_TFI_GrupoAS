const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password : process.env.DB_PASSWORD,
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


/**
 * UPDATE tpintegrador_db.usuarios 
SET password = MD5('nuevaContraseña') 
WHERE email = 'oscram@correo.com';

con este comando se actualiza la contrasenia para hacer login

tipo_usuario 1 = oscram@correo.com
tipo_usuario 2 = wilcor@correo.com
tipo_usuario 3 = alblop@correo.com


 */
