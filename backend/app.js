const express = require('express');
const cors = require('cors');
//const { salonesTodos } = require('./src/baseDeDatos/baseDeDatos');
const autenticacionRuta = require('./src/rutas/autenticacionRuta')
const salonesRuta = require('./src/rutas/salonesRuta')

require('dotenv').config();

const app = express();
app.use(cors());

app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para formularios

// Rutas
app.use('/api/autenticacion', autenticacionRuta);
app.use('/api/salones', salonesRuta);
console.log('Ruta de autenticacion cargada:', !!autenticacionRuta);
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