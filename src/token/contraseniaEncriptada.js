import crypto from 'crypto';


// Función para encriptar contraseña (MD5 como en tu base de datos)
const encriptarContrasenia = (contrasenia) => {
    return crypto.createHash('md5').update(contrasenia).digest('hex');
};

// Función para verificar contraseña
const verificarContrasenia = (contraseniaPlana, contraseniaEncriptada) => {
    const contraseniaEncriptadaInput = encriptarContrasenia(contraseniaPlana);
    return contraseniaEncriptadaInput === contraseniaEncriptada;
};

module.exports = {
    encriptarContrasenia,
    verificarContrasenia
};