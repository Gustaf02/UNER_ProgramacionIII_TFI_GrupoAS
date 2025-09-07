const mysql = require('mysql2/promise');
require('dotenv').config();

async function salonesTodos() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE
        });

        const sqlQuery = 'SELECT * FROM salones';
        const [rows] = await connection.execute(sqlQuery);
        return rows;
        //console.log('Resultados de consulta', rows);
        
        await connection.end();
        
    } catch (err) {
        console.error('Error de conexion', err);
    }
}

module.exports = { salonesTodos };
