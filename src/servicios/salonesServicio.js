import Salones from "../bd/salones.js";

export class SalonesServicio {
    constructor(){
        this.salones = new Salones();
    }
    obtenerTodos = () => {
        return this.salones.obtenerTodos();
    }
    obtenerPorId = (salon_id) => {
        return this.salones.obtenerPorId(salon_id);
    }
    crear = (salonDatos) => {
        return this.salones.crear(salonDatos);
    }
    modificar = (salon_id, datos) => {
        return this.salones.modificar(salon_id, datos);
    }
    eliminar = (salon_id) => {
        return this.salones.eliminar(salon_id);
    }
}