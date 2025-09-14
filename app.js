import express from 'express';
import salonesRutas from './Rutas/salonesRutas.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import dotenv from 'dotenv';

dotenv.config(); // carga el .env 

const app = express();
app.use(express.json());    //habilita el middleware que convierte automáticamente el cuerpo de las solicitudes HTTP en formato JSON en un objeto JavaScript accesible desde req.body

//levanto server
app.listen(process.env.PUERTO, () => {
    console.log('Server corriendo');
});

//rutas
app.use('/salones',salonesRutas);

//ruta de estado
app.get('/estado', (req, res) => {
    res.json({'ok':true});
});

//middleware para centralizar los errores
app.use(manejadorErrores);