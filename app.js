const express = require('express');
//const { salonesTodos } = require('./src/baseDeDatos/baseDeDatos');
const autenticacionRuta = require('./src/rutas/autenticacionRuta')
const salonesRuta = require('./src/rutas/salonesRuta')

require('dotenv').config();

const app = express();
// Rutas
app.use('/api/autenticacion', autenticacionRuta);
app.use('/api/salones', salonesRuta);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Salones de Fiestas funcionando',
        endpoints: {
            salones: '/api/salones',
            salon_especifico: '/api/salones/:id'
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});