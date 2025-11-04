import Servicios from "../bd/servicios.js";

export class ServiciosServicio {
    constructor(){
        this.servicios = new Servicios();
    }
    obtenerTodos = () => {
        return this.servicios.obtenerTodos();
    }
    obtenerPorId = (servicio_id) => {
        return this.servicios.obtenerPorId(servicio_id);
    }
    crear = (servicioDatos) => {
        return this.servicios.crear(servicioDatos);
    }
    modificar = (servicio_id, datos) => {
        return this.servicios.modificar(servicio_id, datos);
    }
    eliminar = (servicio_id) => {
        return this.servicios.eliminar(servicio_id);
    }
}