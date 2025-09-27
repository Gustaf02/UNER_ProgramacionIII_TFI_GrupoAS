import { SalonesServicio } from '../servicios/salonesServicio.js'


export default class SalonesControlador {
    
    constructor(){
        this.salonesServicio = new SalonesServicio();
    }
    
    obtenerTodos = async (req, res, next) => {
        
        try{
            const salones = await this.salonesServicio.obtenerTodos();
            res.json({
                'ok':true, 
                salones: salones
            });

        } catch (error){
            console.log('Error en GET /salones', error);
            next(error);
        }
    }

    obtenerPorId = async (req, res, next) => {
        
        try{
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.obtenerPorId(salon_id);
            
            if (salon.length === 0){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'salon no encontrado'
                });
            }
            
            res.json({
                'ok':true, 
                salon: salon
                });

        }catch(error){
            console.log('Error en GET /salones/:salon_id',error);
            next(error);
        }
    }

    crear = async(req, res, next) => {
        
        try{
            const {titulo, direccion, capacidad, importe} = req.body;

            if(!req.body.titulo || !req.body.direccion || !req.body.capacidad || !req.body.importe){
                return res.status(400).json({
                    'ok':false, 
                    mensaje: 'faltan campos requeridos'
                });
            }
        
        
            const salonDatos = {titulo, direccion, capacidad, importe};
            const salonCreado = await this.salonesServicio.crear(salonDatos);
            res.status(201).json({
                estado: true,
                mensaje: 'Salon creado con exito'
            });
        
        }catch(error){
            console.log('Error en POST /salones',error);
            next(error);
        }
    }

    modificar = async(req, res, next) => {
        try{
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.obtenerPorId(salon_id);
            
            if (salon.length === 0){
                return res.status(400).json({
                    'ok':false, 
                    mensaje: 'salon no encontrado'
                });
            }

            const {titulo, direccion, capacidad, importe} = req.body;

            if(!req.body.titulo || !req.body.direccion || !req.body.capacidad || !req.body.importe){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'faltan campos requeridos'
                });
            }
            const salonDatos = {titulo, direccion, capacidad, importe, salon_id};
            const salonModificado = await this.salonesServicio.modificar(salonDatos);
            res.status(200).json({
                estado: true,
                mensaje: 'Salon modificado'
            });

        }catch(error){
            console.log('Error en PUT /salones',error);
            next(error);
        }
    }
}

export const eliminarSalon = async (req, res, next) => {
    try{
        const salon_id = req.params.salon_id;
        const sql = 'SELECT * FROM salones WHERE activo = 1 AND salon_id = ?';
        const [resultado] = await conexion.execute(sql, [salon_id]);

        if (resultado.length === 0){
            return res.status(404).json({
                'ok':false, 
                mensaje: 'salon no existe'
            });
        }

        const sql2 = 'UPDATE salones SET activo = 0 WHERE salon_id = ?';

        const [resultados] = await conexion.execute(sql2, [salon_id]);
        console.log(resultados);

        res.status(200).json({
            estado: true,
            mensaje: 'Salon eliminado'
        })

    } catch(error){
        console.log('Error en DELETE /salones/:salon_id',error);
        next(error);
    }
}
