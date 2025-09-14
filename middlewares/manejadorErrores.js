export function manejadorErrores(error,req,res,next){
    console.error('Error en la API', error);
    res.status(error.status || 500).json({
        ok: false,
        mensaje: error.message || 'Error interno del servidor',
    });
}