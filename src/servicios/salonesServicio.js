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
    modificar = (salonDatos) => {
        return this.salones.modificar(salonDatos);
    }
    eliminar = (salon_id) => {
        return this.salones.eliminar(salon_id);
    }
}