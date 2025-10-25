import express from 'express';
import cors from 'cors';
import { router as v1SalonesRutas } from './v1/rutas/salonesRutas.js';
import { router as v1ServiciosRutas } from './v1/rutas/serviciosRutas.js';
import v1AutenticacionRutas from './v1/rutas/autenticacionRutas.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Cooperadora Escolar - Programación III',
      version: '1.0.0',
      description: 'Documentación de la API para gestión de salones y servicios',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PUERTO}`,
        description: 'Servidor de desarrollo'
      }
    ],
  },
  apis: ['./v1/rutas/*.js'], // Ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middlewares
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Swagger UI - Agregar ESTO antes de tus rutas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta para obtener la spec en JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Levanto server
app.listen(process.env.PUERTO, () => {
  console.log(`Server corriendo en puerto ${process.env.PUERTO}`);
  console.log(`Swagger docs: http://localhost:${process.env.PUERTO}/api-docs`);
});

// Rutas de la API
app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/servicios', v1ServiciosRutas);
app.use('/api/v1/autenticacion', v1AutenticacionRutas);

// Ruta de estado
app.get('/estado', (req, res) => {
  res.json({ 'ok': true });
});

app.use(manejadorErrores);