import Usuarios from "../bd/usuarios.js";

export class UsuariosServicio {
    constructor(){
        this.usuarios = new Usuarios();
    }
    obtenerTodos = () => {
        return this.usuarios.obtenerTodos();
    }
    obtenerPorId = (usuario_id) => {
        return this.usuarios.obtenerPorId(usuario_id);
    }
    crear = (usuarioDatos) => {
        return this.usuarios.crear(usuarioDatos);
    }
    modificar = (usuarioDatos) => {
        return this.usuarios.modificar(usuarioDatos);
    }
    eliminar = (usuario_id) => {
        return this.usuarios.eliminar(usuario_id);
    }
}