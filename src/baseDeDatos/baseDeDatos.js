const mysql = require('mysql2/promise');
require('dotenv').config();

// async function salonesTodos() {
//     try {
//         const connection = await mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             database: process.env.DB_DATABASE
//         });

//         const sqlQuery = 'SELECT * FROM salones';
//         const [rows] = await connection.execute(sqlQuery);
//         return rows;
//         //console.log('Resultados de consulta', rows);
        
//         await connection.end();
        
//     } catch (err) {
//         console.error('Error de conexion', err);
//     }
// }

// module.exports = { salonesTodos };



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
    getConnection,
    releaseConnection
};

