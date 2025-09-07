const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario.usuario_id,
            usuario: usuario.nombre_usuario,
            tipo: usuario.tipo_usuario
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );
};

const verificarToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido');
    }
};

module.exports = {
    generarToken,
    verificarToken
};