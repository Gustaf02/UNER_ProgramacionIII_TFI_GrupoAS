import { reservaServicio } from "../servicios/reservaServicio.js"; // El servicio manejará la lógica de negocio y la DB
import { emailServicio } from '../servicios/emailServicios.js';
import { UsuariosServicio } from '../servicios/usuariosServicio.js';
import { reservasModelo } from '../bd/reservas.js';


export const crearReserva = async (req, res) => {
  let connection;
  
  try {
    // 1. Obtener datos del body y usuario del token
    const {
      fecha_reserva,
      salon_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      servicios = []
    } = req.body;

// Obtener el usuario completo usando el servicio
const usuariosServicio = new UsuariosServicio();
const usuario = await usuariosServicio.obtenerPorId(req.usuario.id);
const usuario_id = usuario.usuario_id;

    // 2. Validaciones básicas de campos obligatorios
    if (!fecha_reserva || !salon_id || !turno_id) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan campos obligatorios: fecha_reserva, salon_id, turno_id'
      });
    }

    // 3. Iniciar transacción
    connection = await reservasModelo.beginTransaction();

    // 4. Validar que los recursos existan y estén activos
    const salonActivo = await reservasModelo.verificarSalonActivo(salon_id);
    if (!salonActivo) {
      await reservasModelo.rollback();
      return res.status(404).json({
        ok: false,
        mensaje: 'El salón no existe o no está activo'
      });
    }

    const turnoActivo = await reservasModelo.verificarTurnoActivo(turno_id);
    if (!turnoActivo) {
      await reservasModelo.rollback();
      return res.status(404).json({
        ok: false,
        mensaje: 'El turno no existe o no está activo'
      });
    }

    if (servicios.length > 0) {
      const serviciosActivos = await reservasModelo.verificarServiciosActivos(servicios);
      if (!serviciosActivos) {
        await reservasModelo.rollback();
        return res.status(404).json({
          ok: false,
          mensaje: 'Uno o más servicios no existen o no están activos'
        });
      }
    }

    // 5. Verificar disponibilidad del salón
    const reservasExistentes = await reservasModelo.verificarDisponibilidad(
      fecha_reserva,
      salon_id,
      turno_id
    );

    if (reservasExistentes.length > 0) {
      await reservasModelo.rollback();
      return res.status(409).json({
        ok: false,
        mensaje: 'El salón ya está reservado para esta fecha y turno'
      });
    }

    // 6. Obtener precios actuales
    const salonData = await reservasModelo.obtenerPrecioSalon(salon_id);
    const importeSalon = parseFloat(salonData.importe);
    
    let serviciosData = [];
    let importeTotalServicios = 0;

    if (servicios.length > 0) {
      serviciosData = await reservasModelo.obtenerPreciosServicios(servicios);
      importeTotalServicios = serviciosData.reduce((total, servicio) => {
        return total + parseFloat(servicio.importe);
      }, 0);
    }

    // 7. Calcular totales
    const importeTotal = importeSalon + importeTotalServicios;

    // 8. Preparar datos para la reserva
    const datosReserva = {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero: foto_cumpleaniero || null,
      tematica: tematica || null,
      importe_salon: importeSalon,
      importe_total: importeTotal
    };

    // 9. Crear reserva en la base de datos
    const reservaId = await reservasModelo.insertarReserva(datosReserva);

    // 10. Insertar servicios si existen
    if (serviciosData.length > 0) {
      const serviciosParaInsertar = serviciosData.map(servicio => ({
        servicio_id: servicio.servicio_id,
        importe: parseFloat(servicio.importe)
      }));
      
      await reservasModelo.insertarServicios(reservaId, serviciosParaInsertar);
    }

    // 11. Confirmar transacción
    await reservasModelo.commit();

    // 12. Preparar datos para el email
    const nuevaReservaData = {
      fecha_reserva,
      salon_titulo: salonData.titulo,
      turno: salonData.turno,
      importe_salon: importeSalon,
      importe_total: importeTotal,
      tematica: tematica || 'Sin temática específica'
    };

    // 13. Enviar email de confirmación
    console.log('Enviando email a:', usuario.nombre_usuario);
    const emailEnviado = await emailServicio.enviarCorreoConfirmacionReserva(
      usuario.nombre_usuario, // email del usuario desde el token
      {
        reserva_id: reservaId,
        ...nuevaReservaData,
        servicios: serviciosData
      }
    );

    if (!emailEnviado) {
      // Aunque el email falle, la reserva ya se creó exitosamente
      console.warn('Reserva creada pero falló el envío de email');
      return res.status(201).json({
        ok: true,
        mensaje: "Reserva creada exitosamente, pero hubo un problema al enviar la confirmación por email.",
        data: { reserva_id: reservaId },
      });
    }

    // 14. Respuesta exitosa
    return res.status(201).json({
      ok: true,
      mensaje: "Reserva creada exitosamente y notificación enviada por mail.",
      data: { reserva_id: reservaId },
    });

  } catch (error) {
    // 15. Manejo de errores
    if (connection) {
      await reservasModelo.rollback();
    }
    
    console.error('Error en crearReserva:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear la reserva',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const obtenerReservas = async (req, res) => {
  try {
    const reservas = await reservasModelo.obtenerTodas();
    
    return res.status(200).json({
      ok: true,
      data: reservas
    });
    
  } catch (error) {
    console.error('Error en obtenerReservas:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener las reservas'
    });
  }
};

export const obtenerReservaPorId = async (req, res) => {
  try {
    const { reserva_id } = req.params;
    
    if (!reserva_id || isNaN(reserva_id)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'ID de reserva inválido'
      });
    }

    const reserva = await reservasModelo.obtenerPorId(parseInt(reserva_id));
    
    if (!reserva || reserva.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Reserva no encontrada'
      });
    }

    // Estructurar los datos para una respuesta más organizada
    const reservaData = {
      ...reserva[0],
      servicios: reserva.filter(item => item.servicio_id).map(item => ({
        servicio_id: item.servicio_id,
        descripcion: item.servicio_descripcion,
        importe: item.servicio_importe
      }))
    };

    // Eliminar duplicados de servicios en el objeto principal
    delete reservaData.servicio_id;
    delete reservaData.servicio_descripcion;
    delete reservaData.servicio_importe;

    return res.status(200).json({
      ok: true,
      data: reservaData
    });
    
  } catch (error) {
    console.error('Error en obtenerReservaPorId:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener la reserva'
    });
  }
};

/**
 * [R] READ: Obtiene una reserva específica por su ID.
 */


/**
 * [U] UPDATE: Actualiza una reserva existente.
 */
export const actualizarReserva = async (req, res) => {
  try {
    const { reserva_id } = req.params;

    const { servicios, ...datosActualizacion } = req.body;

    const actualizacionExitosa = await reservaServicio.modificar(
      reserva_id,
      datosActualizacion,
      servicios
    );

    if (!actualizacionExitosa) {
      return res.status(404).json({
        ok: false,
        mensaje: `No se encontró la reserva con ID ${reserva_id} para actualizar.`,
      });
    }

    const reservaActualizada = await reservaServicio.obtenerPorId(reserva_id);

    return res.status(200).json({
      ok: true,
      mensaje: "Reserva actualizada exitosamente.",
      data: reservaActualizada,
    });
  } catch (error) {
    console.error("Error en actualizarReserva (Controlador):", error);

    if (
      error.message.includes("reservado para la fecha") ||
      error.message.includes("ya está reservada")
    ) {
      return res.status(409).json({
        ok: false,
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor al actualizar la reserva.",
    });
  }
};

/**
 * [D] DELETE: Elimina lógicamente una reserva (la marca como inactiva).
 */
export const eliminarReserva = async (req, res) => {
  try {
    const { reserva_id } = req.params;

    const result = await reservaServicio.eliminar(reserva_id);

    if (!result) {
      return res.status(404).json({
        ok: false,
        mensaje: `No se encontró la reserva con ID ${reserva_id} para eliminar.`,
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: `Reserva con ID ${reserva_id} eliminada lógicamente.`,
    });
  } catch (error) {
    console.error("Error en eliminarReserva (Controlador):", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor al eliminar la reserva.",
    });
  }
};
