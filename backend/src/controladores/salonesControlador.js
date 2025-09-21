const salonesModelo = require('../modelos/salonesModelo');

const salonesControlador = {
    // Obtener todos los salones
    async obtenerTodos(req, res) {
        try {
            const salones = await salonesModelo.obtenerTodos();
            res.json({
                success: true,
                data: salones,
                message: 'Salones obtenidos correctamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener salones',
                error: error.message
            });
        }
    },

    // Obtener salón por ID
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const salon = await salonesModelo.obtenerPorId(id);
            
            if (!salon) {
                return res.status(404).json({
                    success: false,
                    message: 'Salón no encontrado'
                });
            }

            res.json({
                success: true,
                data: salon,
                message: 'Salón obtenido correctamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener el salón',
                error: error.message
            });
        }
    },

    // Crear nuevo salón
    async crear(req, res) {
        try {
            const datosSalon = req.body;
            
            // Validaciones básicas (puedes expandirlas)
            if (!datosSalon.titulo || !datosSalon.direccion || !datosSalon.importe) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios: título, dirección e importe son requeridos'
                });
            }

            const nuevoId = await salonesModelo.crear(datosSalon);
            
            res.status(201).json({
                success: true,
                data: { id: nuevoId },
                message: 'Salón creado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear el salón',
                error: error.message
            });
        }
    },

    // Actualizar salón existente
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const nuevosDatos = req.body;
            
            // Verificar que hay datos para actualizar
            if (Object.keys(nuevosDatos).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            const filasAfectadas = await salonesModelo.actualizar(id, nuevosDatos);
            
            if (filasAfectadas === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Salón no encontrado o ya está desactivado'
                });
            }

            res.json({
                success: true,
                message: 'Salón actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el salón',
                error: error.message
            });
        }
    },

    // Desactivar salón (eliminación lógica)
    async desactivar(req, res) {
        try {
            const { id } = req.params;
            const filasAfectadas = await salonesModelo.desactivar(id);
            
            if (filasAfectadas === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Salón no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Salón desactivado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al desactivar el salón',
                error: error.message
            });
        }
    }
};

module.exports = salonesControlador;