import Usuarios from "../bd/usuarios.js";
import { encriptarContrasenia } from "../token/contraseniaEncriptada.js";

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

    crear = async (usuarioDatos) => {
        const existe = await this.usuarios.existeNombreUsuario(usuarioDatos.nombre_usuario);
        if (existe) {
            const error = new Error('El nombre de usuario esta en uso');
            error.code = 'usuario_existe';
            throw error;
        }
        usuarioDatos.contrasenia = encriptarContrasenia(usuarioDatos.contrasenia);
        return this.usuarios.crear(usuarioDatos);
    }

    modificar = async (usuario_id, datos) => {

        if (datos.nombre_usuario){
            const existe = await this.usuarios.existeNombreUsuario(datos.nombre_usuario, usuario_id);
            if (existe) {
                const error = new Error('El nombre de usuario esta en uso');
                error.code = 'usuario_existe';
                throw error;
            }
        }
        
        if (datos.contrasenia) {
            datos.contrasenia = encriptarContrasenia(datos.contrasenia);
        }
        return this.usuarios.modificar(usuario_id, datos);
    }

    eliminar = (usuario_id) => {
        return this.usuarios.eliminar(usuario_id);
    }
}