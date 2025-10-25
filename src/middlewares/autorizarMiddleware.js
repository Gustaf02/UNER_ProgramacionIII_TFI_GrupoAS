const autorizar = (rolesPermitidos) => {
    return (req, res, next) => {
        try{
            if (!req.usuario || !req.usuario.tipo) {
                return res.status(403).json({
                    exito: false,
                    mensaje: 'Acceso denegado: usuario no autenticado'
                });
            }

            if (!rolesPermitidos.includes(req.usuario.tipo)) {
                return res.status(403).json({
                    exito: false,
                    mensaje: 'Acceso denegado: no tienes permisos para esta acción'
                });
            }

            next();
    
        }catch{
            return res.status(500).json({
                exito: false,
                mensaje: 'Error en autorizacion',
                error: error.message
            })
        }
    };
};

export default autorizar;