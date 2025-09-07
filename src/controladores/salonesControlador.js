const salonesModelo = require('../modelos/salonesModelo');

const salonesControlador = {
    // Obtener todos los salones
    async getAll(req, res) {
        try {
            const salones = await salonesModelo.getAll();
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
    async getById(req, res) {
        try {
            const { id } = req.params;
            const salon = await salonesModelo.getById(id);
            
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
    }
};

module.exports = salonesControlador;