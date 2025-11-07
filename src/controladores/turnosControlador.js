import { TurnosServicio } from '../servicios/turnosServicio.js'


export default class TurnosControlador {
    
    constructor(){
        this.turnosServicio = new TurnosServicio();
    }
    
 
    obtenerTodos = async (req, res, next) => {
        try{
            const turnos = await this.turnosServicio.obtenerTodos();
            res.json({
                'ok':true, 
                turnos: turnos
            });
        } catch (error){
            console.log('Error en GET /turnos', error);
            next(error); 
        }
    }

    
    obtenerPorId = async (req, res, next) => {
        try{
            const turno_id = req.params.turno_id;
            const turno = await this.turnosServicio.obtenerPorId(turno_id);
            
            if (!turno){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'Turno no encontrado'
                });
            }
            
            res.json({
                'ok':true, 
                turno: turno
            });
        }catch(error){
            console.log('Error en GET /turnos/:turno_id',error);
            next(error);
        }
    }

    
    crear = async(req, res, next) => {
        try{
            const {orden, hora_desde, hora_hasta} = req.body;
            const turnoDatos = {orden, hora_desde, hora_hasta};
            const nuevoTurnoId = await this.turnosServicio.crear(turnoDatos);
            
            res.status(201).json({
                estado: true,
                mensaje: 'Turno creado con exito',
                turno_id: nuevoTurnoId
            });
        }catch(error){
            console.log('Error en POST /turnos',error);
            next(error);
        }
    }

    
    modificar = async(req, res, next) => {
        try{
            const turno_id = req.params.turno_id;
            
            const turnoExistente = await this.turnosServicio.obtenerPorId(turno_id);
            
            if (!turnoExistente){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'Turno no encontrado'
                });
            }

            const {orden, hora_desde, hora_hasta} = req.body;
            
            
            const datosParaModificar = {};
            
            
            if (orden !== undefined) datosParaModificar.orden = orden;
            if (hora_desde !== undefined) datosParaModificar.hora_desde = hora_desde;
            if (hora_hasta !== undefined) datosParaModificar.hora_hasta = hora_hasta;

           
            if (Object.keys(datosParaModificar).length === 0) {
                 return res.status(400).json({
                    'ok': false,
                    mensaje: 'Debe proporcionar al menos un campo para modificar (orden, hora_desde, o hora_hasta)'
                });
            }
            
            
            await this.turnosServicio.modificar(turno_id, datosParaModificar); 
            
            res.status(200).json({
                estado: true,
                mensaje: 'Turno modificado con exito'
            });
        }catch(error){
            console.log('Error en PUT /turnos/:turno_id',error);
            next(error);
        }
    }

    
    eliminar = async(req, res, next) => {
        try{
            const turno_id = req.params.turno_id;
            
            const turno = await this.turnosServicio.obtenerPorId(turno_id);
            
            if (!turno){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'Turno no encontrado'
                });
            }
            
            await this.turnosServicio.eliminar(turno_id);
            
            res.status(200).json({
                estado: true,
                mensaje: 'Turno eliminado con exito'
            });
        
        }catch(error){
            console.log('Error en DELETE /turnos/:turno_id',error);
            next(error);
        }
    }
}