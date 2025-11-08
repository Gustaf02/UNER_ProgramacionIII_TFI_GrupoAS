<div align="center">
  <h1>Trabajo Final Integrador</h3>
  <h1>Grupo "AS"</h3>
</div>

# Proyecto Backend modular para la gestión integral de salones, servicios, turnos y transacciones de reserva.

---

## Descripción :

Este proyecto es la capa backend (API REST) diseñada para centralizar la lógica de negocio y la gestión de la base de datos de un sistema de reservas. Su objetivo es exponer endpoints seguros y bien definidos para que una aplicación frontend pueda:

- Gestionar la disponibilidad de recursos (salones y turnos).

- Administrar usuarios mediante un sistema de autenticación (JWT).

- Registrar y consultar transacciones de reserva.

- Generar reportes de negocio.

El enfoque está centrado en la robustez de Express.js y en la claridad de la documentación interactiva provista por Swagger.

---

## Integrantes del Equipo: 

* ✅ [**Santiago Carro**](https://github.com/santiago9513)
* ✅ [**Walter Frías**](https://github.com/xtsulyts)
* ✅ [**Israel Leonardo Montiel**](https://github.com/leonardo-montiel2)
* ✅ [**Carlos Gustavo Ortiz**](https://github.com/Gustaf02)
* ✅ [**Azucena Prieto**](https://github.com/AzuP777)
  
---

## Estructura del Proyecto: 

###  Componentes de la Arquitectura

- index.js:  Punto de Entrada. Inicializa Express, configura Swagger, middlewares y define las rutas principales. Ejemplo de Contenido: app.use('/api/v1/reservas', v1ReservaRutas)

- v1/rutas: Define los endpoints (URL) y dirige la solicitud al controlador apropiado. Ejemplo de Contenido: salonesRutas.js, reservasRutas.js

- v1/controladores: Contiene la lógica que maneja las solicitudes HTTP y llama a la capa de servicios. Ejemplo de Contenido: controladorSalones.js

- v1/servicios: Contiene la lógica de acceso a datos y la interacción directa con la Base de Datos. Ejemplo de Contenido: servicioSalones.js

- middlewares: Funciones intermedias (ej. validación JWT, manejo centralizado de errores). Ejemplo de Contenido: manejadorErrores.js

- src/bd: Base de Datos. Contiene scripts SQL y definiciones de procedimientos. Ejemplo de Contenido: sp_reportes.sql (Procedimiento Almacenado)

---

## Tecnologías Utilizadas: 

- Backend: Node.js / Express.js.: Desarrollo rápido de APIs escalables.

- Base de Datos: SQL (Relacional) Razón de Uso: Soporte para transacciones y procedimientos almacenados (sp_reportes.sql).

- Documentación: Swagger JSDoc / Swagger UI: Documentación interactiva disponible en el endpoint /api-docs.

- Seguridad: CORS: Permite el acceso seguro desde el frontend (http://localhost:5173).

- Configuración: dotenv: Gestión segura de variables de entorno (puerto, credenciales de DB).

---

## Mapa de Endpoints (/api/v1): 

- /autenticacion: Acceso y Seguridad. Login y registro de usuarios (emisión de JWT).

- /usuarios: Gestión de Perfiles. Administración de perfiles de usuario.

- /salones: Gestión de Recursos. Operaciones Principales: CRUD de salones o espacios rentables.

- /servicios: Gestión de Extras. CRUD de servicios adicionales (ej. equipo, catering).

- /turnoslidad: Gestión de Horarios. CRUD de los bloques de tiempo disponibles para reserva.

- /reservas: Transacciones: Creación, consulta, modificación y cancelación de reservas.

- /reportes: Inteligencia de Negocio. Generación de informes mediante consultas complejas a la DB (usando sp_reportes.sql).

---

## Instrucciones de Puesta en Marcha: 

### Sigue estos pasos para levantar el servidor backend (API) y la aplicación frontend (Cliente).

- Inicializar el Servidor Backend (API)

### Ejecuta estos comandos desde la carpeta raíz del proyecto:

- npm install

- npm run dev

---

## Inicializar el Frontend (Cliente): 

El cliente se encuentra en un subdirectorio.

- cd extra

- npm install

- npm run dev

##
