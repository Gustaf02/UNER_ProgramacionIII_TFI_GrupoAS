const crypto = require('crypto');

const encriptarContrasenia = (contrasenia) => {
    return crypto.createHash('md5').update(contrasenia).digest('hex');
};

const verificarContrasenia = (contraseniaPlana, contraseniaEncriptada) => {
    return encriptarContrasenia(contraseniaPlana) === contraseniaEncriptada;
};

module.exports = {
    encriptarContrasenia,
    verificarContrasenia
};