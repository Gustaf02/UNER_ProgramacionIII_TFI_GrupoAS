import Salones from "../bd/salones.js";

export class SalonesServicio {
    constructor(){
        this.salones = new Salones();
    }
    obtenerTodos = () => {
        return this.salones.obtenerTodos();
    }
}