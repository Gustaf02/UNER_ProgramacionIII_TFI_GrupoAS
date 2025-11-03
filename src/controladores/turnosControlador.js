import { TurnosServicio } from '../servicios/turnosServicio.js'


export default class TurnosControlador {
    
    constructor(){
        this.turnosServicio = new TurnosServicio();
    }
    
    // BROWSE: Obtiene todos los turnos
    obtenerTodos = async (req, res, next) => {
        try{
            const turnos = await this.turnosServicio.obtenerTodos();
            res.json({
                'ok':true, 
                turnos: turnos
            });
        } catch (error){
            console.log('Error en GET /turnos', error);
            next(error); // Pasa el error al manejador de errores 
        }
    }

    // READ: Obtiene un turno por ID
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

    // ADD: Crea un nuevo turno
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

    // EDIT: Modifica un turno existente
    modificar = async(req, res, next) => {
        try{
            const turno_id = req.params.turno_id;
            // Valida que el turno exista
            const turnoExistente = await this.turnosServicio.obtenerPorId(turno_id);
            
            if (!turnoExistente){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'Turno no encontrado'
                });
            }

            const {orden, hora_desde, hora_hasta} = req.body;
            
            // Construye los datos a modificar, usando el valor existente si no se proporciona uno nuevo
            const turnoDatos = {
                orden: orden ?? turnoExistente.orden, 
                hora_desde: hora_desde ?? turnoExistente.hora_desde, 
                hora_hasta: hora_hasta ?? turnoExistente.hora_hasta, 
                turno_id
            };
            
            await this.turnosServicio.modificar(turnoDatos);
            
            res.status(200).json({
                estado: true,
                mensaje: 'Turno modificado con exito'
            });
        }catch(error){
            console.log('Error en PUT /turnos/:turno_id',error);
            next(error);
        }
    }

    // DELETE: Elimina un turno
    eliminar = async(req, res, next) => {
        try{
            const turno_id = req.params.turno_id;
            // Verifica que el turno existe
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

            if (!error.status) {
                error.status = 500;
            }

            next(error);
        }
    }
}