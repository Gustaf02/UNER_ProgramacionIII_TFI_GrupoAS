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
            
            if (!salon){
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

            // if(!req.body.titulo || !req.body.direccion || !req.body.capacidad || !req.body.importe){
            //     return res.status(400).json({
            //         'ok':false, 
            //         mensaje: 'faltan campos requeridos'
            //     });
            // }

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
            
            if (!salon){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'salon no encontrado'
                });
            }

            const {titulo, direccion, capacidad, importe} = req.body;

            // if(!req.body.titulo || !req.body.direccion || !req.body.capacidad || !req.body.importe){
            //     return res.status(404).json({
            //         'ok':false, 
            //         mensaje: 'faltan campos requeridos'
            //     });
            // }

            // Se queda con el valor original si el nuevo es vacio o indefinido
            const salonDatos = {
                titulo: titulo ?? salon.titulo, 
                direccion: direccion ?? salon.direccion, 
                capacidad: capacidad ?? salon.capacidad, 
                importe: importe ?? salon.importe, 
                salon_id};
            await this.salonesServicio.modificar(salonDatos);
            res.status(200).json({
                estado: true,
                mensaje: 'Salon modificado'
            });

        }catch(error){
            console.log('Error en PUT /salones',error);
            next(error);
        }
    }

    eliminar = async(req, res, next) => {
        try{
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.obtenerPorId(salon_id);
            
            if (!salon){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'salon no encontrado'
                });
            }
            
            const eliminado = await this.salonesServicio.eliminar(salon_id);
            res.status(200).json({
                estado: true,
                mensaje: 'Salon eliminado'
            });

        }catch(error){
            console.log('Error en DELETE /salones/:salon_id',error);
            next(error);
        }
    }
}

