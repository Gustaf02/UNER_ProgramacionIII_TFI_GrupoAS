import { conexion } from '../bd/conexion.js'

export const obtenerSalones = async (req, res, next) => {
    try{
        const sql = 'SELECT * FROM salones WHERE activo = 1';
        const [resultados] = await conexion.query(sql);
        res.json({'ok':true, salones: resultados});
    } catch (error){
        next(error);
    }
};

export const obtenerSalonPorId = async (req, res, next) => {
    try {
        const salon_id = req.params.salon_id;
        const sql = 'SELECT * FROM salones WHERE activo = 1 AND salon_id = ?';
        const resultados = await conexion.query(sql, salon_id);

        if (resultados.length === 0){
            return res.status(404).json({'ok':false, mensaje: 'salon no encontrado'});
        }
        res.json({'ok':true,salon: resultados[0]});
    } catch(error){
        next(error);
    }
};