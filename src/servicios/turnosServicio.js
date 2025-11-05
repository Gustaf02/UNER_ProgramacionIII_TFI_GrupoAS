import Turnos from "../bd/turnos.js";

export class TurnosServicio {
    constructor(){
        this.turnos = new Turnos();
    }
    
    obtenerTodos = () => {
        return this.turnos.obtenerTodos();
    }
    
    obtenerPorId = (turno_id) => {
        return this.turnos.obtenerPorId(turno_id);
    }
    
    crear = (turnoDatos) => {
        return this.turnos.crear(turnoDatos);
    }
    
    modificar = (turno_id, datos) => {
        return this.turnos.modificar(turno_id, datos);
    }
    
    eliminar = (turno_id) => {
        return this.turnos.eliminar(turno_id);
    }
}