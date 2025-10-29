import { UsuariosServicio } from '../servicios/usuariosServicio.js'


export default class UsuariosControlador {
    
    constructor(){
        this.usuariosServicio = new UsuariosServicio();
    }
    
    obtenerTodos = async (req, res, next) => {
        
        try{
            const usuarios = await this.usuariosServicio.obtenerTodos();
            res.json({
                'ok':true, 
                usuarios: usuarios
            });

        } catch (error){
            console.log('Error en GET /usuarios', error);
            next(error);
        }
    }

    obtenerPorId = async (req, res, next) => {
        
        try{
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosServicio.obtenerPorId(usuario_id);
            
            if (!usuario){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'usuario no encontrado'
                });
            }
            
            res.json({
                'ok':true, 
                usuario: usuario
                });

        }catch(error){
            console.log('Error en GET /usuarios/:usuario_id',error);
            next(error);
        }
    }

    crear = async(req, res, next) => {
        
        try{
            const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto} = req.body;

            const usuarioDatos = {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto};
            const usuarioCreado = await this.usuariosServicio.crear(usuarioDatos);
            res.status(201).json({
                estado: true,
                mensaje: 'Usuario creado con exito'
            });
        
        }catch(error){
            console.log('Error en POST /usuarios',error);
            next(error);
        }
    }

    modificar = async(req, res, next) => {
        try{
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosServicio.obtenerPorId(usuario_id);
            
            if (!usuario){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'usuario no encontrado'
                });
            }

            const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto} = req.body;

            // Se queda con el valor original si no se define uno nuevo
            const usuarioDatos = {
                nombre: nombre ?? usuario.nombre, 
                apellido: apellido ?? usuario.apellido, 
                nombre_usuario: nombre_usuario ?? usuario.nombre_usuario, 
                contrasenia: contrasenia ?? usuario.contrasenia,
                tipo_usuario: tipo_usuario ?? usuario.tipo_usuario,
                celular: celular ?? usuario.celular,
                foto: foto ?? usuario.foto,
                usuario_id};
            await this.usuariosServicio.modificar(usuarioDatos);
            res.status(200).json({
                estado: true,
                mensaje: 'Usuario modificado'
            });

        }catch(error){
            console.log('Error en PUT /usuarios',error);
            next(error);
        }
    }

    eliminar = async(req, res, next) => {
        try{
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosServicio.obtenerPorId(usuario_id);
            
            if (!usuario){
                return res.status(404).json({
                    'ok':false, 
                    mensaje: 'usuario no encontrado'
                });
            }
            
            const eliminado = await this.usuariosServicio.eliminar(usuario_id);
            res.status(200).json({
                estado: true,
                mensaje: 'Usuario eliminado'
            });

        }catch(error){
            console.log('Error en DELETE /usuarios/:usuario_id',error);
            next(error);
        }
    }
}