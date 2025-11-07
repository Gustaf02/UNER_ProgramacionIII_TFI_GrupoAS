import crypto from 'crypto';


export const encriptarContrasenia = (contrasenia) => {
    return crypto.createHash('md5').update(contrasenia).digest('hex');
};


export const verificarContrasenia = (contraseniaPlana, contraseniaEncriptada) => {
    const contraseniaEncriptadaInput = encriptarContrasenia(contraseniaPlana);
    return contraseniaEncriptadaInput === contraseniaEncriptada;
};