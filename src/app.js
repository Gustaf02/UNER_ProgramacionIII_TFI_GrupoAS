import express from "express";
import cors from "cors";
import { router as v1SalonesRutas } from "./v1/rutas/salonesRutas.js";
import { router as v1ServiciosRutas } from "./v1/rutas/serviciosRutas.js";
import { v1ReservaRutas } from "./v1/rutas/reservasRutas.js";
import v1AutenticacionRutas from "./v1/rutas/autenticacionRutas.js";
import { manejadorErrores } from "./middlewares/manejadorErrores.js";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Programación III",
      version: "1.0.0",
      description:
        "Documentación de la API para gestión de salones y servicios",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PUERTO}`,
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: [
    "./src/v1/rutas/salonesRutas.js",
    "./src/v1/rutas/serviciosRutas.js",
    "./src/v1/rutas/reservasRutas.js",
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middlewares
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Swagger UI - Agregar ESTO antes de tus rutas
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta para obtener la spec en JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Levanto server
app.listen(process.env.PUERTO, () => {
  console.log(`Server corriendo en puerto ${process.env.PUERTO}`);
  console.log(`Swagger docs: http://localhost:${process.env.PUERTO}/api-docs`);
});

// Rutas de la API
app.use("/api/v1/salones", v1SalonesRutas);
app.use("/api/v1/servicios", v1ServiciosRutas);
app.use("/api/v1/autenticacion", v1AutenticacionRutas);
app.use("/api/v1/reservas", v1ReservaRutas);
// Ruta de estado
app.get("/estado", (req, res) => {
  res.json({ ok: true });
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
