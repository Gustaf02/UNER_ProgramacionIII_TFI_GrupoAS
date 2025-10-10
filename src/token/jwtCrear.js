import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;

const generarToken = (datosUsuario) => {
    return jwt.sign(
        {
            id: datosUsuario.usuario_id,
            usuario: datosUsuario.nombre_usuario,
            tipo: datosUsuario.tipo_usuario,
            nombre: datosUsuario.nombre
        },
        JWT_SECRET,
        { expiresIn: '8h' }
    );
};

const verificarToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

module.exports = {
    generarToken,
    verificarToken
};