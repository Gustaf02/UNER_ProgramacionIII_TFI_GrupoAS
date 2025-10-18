import express from 'express';
import cors from 'cors'
import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js';
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js';
import v1AutenticacionRutas from './v1/rutas/autenticacionRutas.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import dotenv from 'dotenv';

dotenv.config(); // carga el .env 

const app = express();
app.use(express.json());    //habilita el middleware que convierte automáticamente el cuerpo de las solicitudes HTTP en formato JSON en un objeto JavaScript accesible desde req.body

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Tu URL de frontend
  credentials: true, // Permitir credenciales
  optionsSuccessStatus: 200 // Para navegadores más antiguos
};

app.use(cors(corsOptions));


//levanto server
app.listen(process.env.PUERTO, () => {
    console.log('Server corriendo');
});

//rutas
app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/servicios', v1ServiciosRutas);
app.use('/api/v1/autenticacion', v1AutenticacionRutas);

//ruta de estado
app.get('/estado', (req, res) => {
    res.json({'ok':true});
});

app.use(manejadorErrores);

/**
 * UPDATE tpintegrador_db.usuarios 
SET password = MD5('nuevaContraseña') 
WHERE email = 'oscram@correo.com';

con este comando se actualiza la contrasenia para hacer login

tipo_usuario 1 = oscram@correo.com
tipo_usuario 2 = wilcor@correo.com
tipo_usuario 3 = alblop@correo.com


 */