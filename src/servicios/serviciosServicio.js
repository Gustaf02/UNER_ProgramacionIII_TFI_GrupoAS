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
    modificar = (servicioDatos) => {
        return this.servicios.modificar(servicioDatos);
    }
    eliminar = (servicio_id) => {
        return this.servicios.eliminar(servicio_id);
    }
}