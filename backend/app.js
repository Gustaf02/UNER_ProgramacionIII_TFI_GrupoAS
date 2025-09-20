const express = require('express');
const cors = require('cors');
//const { salonesTodos } = require('./src/baseDeDatos/baseDeDatos');
const autenticacionRuta = require('./src/rutas/autenticacionRuta')
const salonesRuta = require('./src/rutas/salonesRuta')
const usuariosRuta = require('./src/rutas/usuariosRuta');

require('dotenv').config();

const app = express();


// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Tu URL de frontend
  credentials: true, // Permitir credenciales
  optionsSuccessStatus: 200 // Para navegadores más antiguos
};

app.use(cors(corsOptions));

app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para formularios

// Rutas
app.use('/api/autenticacion', autenticacionRuta);
app.use('/api/usuarios', usuariosRuta);
app.use('/api/salones', salonesRuta);
console.log('Ruta de autenticacion cargada:', !!autenticacionRuta);


app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Salones de Fiestas funcionando',
        endpoints: {
            crear_usuario: "/api/autenticacion/registro",
            login: "/api/autenticacion/login",
            usuarios: "/api/usuarios/",
            usuario_id: "/api/usuarios/:id",
            usuarios_tipo: "/api/usuarios/tipo/:tipo",
            salones: '/api/salones',
            salon_especifico: '/api/salones/:id',
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});