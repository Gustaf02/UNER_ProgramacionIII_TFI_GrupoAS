import { ServiciosServicio } from '../servicios/serviciosServicio.js'


export default class ServiciosControlador {
    
    constructor(){
        this.serviciosServicio = new ServiciosServicio();
    }
    
    obtenerTodos = async (req, res, next) => {
        
        try{
            const servicios = await this.serviciosServicio.obtenerTodos();
            res.json({
                'ok':true, 
                servicios: servicios
            });

        } catch (error){
            console.log('Error en GET /servicios', error);
            next(error);
        }
    }

    obtenerPorId = async (req, res, next) => {
        
        try{
            const servicio_id = req.params.servicio_id;
            const servicio = await this.serviciosServicio.obtenerPorId(servicio_id);
            
            if (!servicio){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'servicio no encontrado'
                });
            }
            
            res.json({
                'ok':true, 
                servicio: servicio
                });

        }catch(error){
            console.log('Error en GET /servicios/:servicio_id',error);
            next(error);
        }
    }

    crear = async(req, res, next) => {
        
        try{
            const {descripcion, importe} = req.body;

            const servicioDatos = {descripcion, importe};
            await this.serviciosServicio.crear(servicioDatos);
            res.status(201).json({
                estado: true,
                mensaje: 'Servicio creado con exito'
            });
        
        }catch(error){
            console.log('Error en POST /servicios',error);
            next(error);
        }
    }


    modificar = async(req, res, next) => {
        try{
            const servicio_id = req.params.servicio_id;
            const datos = req.body;

            const servicio = await this.serviciosServicio.obtenerPorId(servicio_id);
            
            if (!servicio){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'servicio no encontrado'
                });
            }

            await this.serviciosServicio.modificar(servicio_id, datos);
            res.status(200).json({
                estado: true,
                mensaje: 'Servicio modificado'
            });

        }catch(error){
            console.log('Error en PUT /servicio',error);
            next(error);
        }
    }

    eliminar = async(req, res, next) => {
        try{
            const servicio_id = req.params.servicio_id;
            const servicio = await this.serviciosServicio.obtenerPorId(servicio_id);
            
            if (!servicio){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'servicio no encontrado'
                });
            }
            
            await this.serviciosServicio.eliminar(servicio_id);
            res.status(200).json({
                estado: true,
                mensaje: 'Servicio eliminado'
            });

        }catch(error){
            console.log('Error en DELETE /servicios/:servicio_id',error);
            next(error);
        }
    }
}