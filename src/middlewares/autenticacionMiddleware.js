import { verificarToken } from '../token/jwtCrear.js'

const verificarAutenticacion = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Token de autenticación requerido'
            });
        }

        const usuarioDecodificado = verificarToken(token);
        req.usuario = usuarioDecodificado;
        next();
    } catch (error) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Token inválido o expirado'
        });
    }
};

export {
    verificarAutenticacion
};