import { reservaServicio } from "../servicios/reservaServicio.js"; // El servicio manejará la lógica de negocio y la DB
import { emailServicio } from '../servicios/emailServicios.js';
import { UsuariosServicio } from '../servicios/usuariosServicio.js';
import { reservasModelo } from '../bd/reservas.js';


export const crearReserva = async (req, res) => {
  let connection;
  
  try {
    
    const {
      fecha_reserva,
      salon_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      servicios = []
    } = req.body;


const usuariosServicio = new UsuariosServicio();
const usuario = await usuariosServicio.obtenerPorId(req.usuario.id);
const usuario_id = usuario.usuario_id;

    
    if (!fecha_reserva || !salon_id || !turno_id) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan campos obligatorios: fecha_reserva, salon_id, turno_id'
      });
    }

    
    connection = await reservasModelo.beginTransaction();

    
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

    
    const importeTotal = importeSalon + importeTotalServicios;

    
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

    
    const reservaId = await reservasModelo.insertarReserva(datosReserva);

    
    if (serviciosData.length > 0) {
      const serviciosParaInsertar = serviciosData.map(servicio => ({
        servicio_id: servicio.servicio_id,
        importe: parseFloat(servicio.importe)
      }));
      
      await reservasModelo.insertarServicios(reservaId, serviciosParaInsertar);
    }

    
    await reservasModelo.commit();

    
    const nuevaReservaData = {
      fecha_reserva,
      salon_titulo: salonData.titulo,
      salon_id: salon_id,  
      turno_id: turno_id, 
      importe_salon: importeSalon,
      importe_total: importeTotal,
      tematica: tematica || 'Sin temática específica'
    };

    
    console.log('Enviando email a:', usuario.nombre_usuario);
    const emailEnviado = await emailServicio.enviarCorreoConfirmacionReserva(
      usuario.nombre_usuario, 
      {
        reserva_id: reservaId,
        ...nuevaReservaData,
        servicios: serviciosData
      }
    );

    if (!emailEnviado) {
      
      console.warn('Reserva creada pero falló el envío de email');
      return res.status(201).json({
        ok: true,
        mensaje: "Reserva creada exitosamente, pero hubo un problema al enviar la confirmación por email.",
        data: { reserva_id: reservaId },
      });
    }

    
    return res.status(201).json({
      ok: true,
      mensaje: "Reserva creada exitosamente y notificación enviada por mail.",
      data: { reserva_id: reservaId },
    });

  } catch (error) {
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

    
    const reservaData = {
      ...reserva[0],
      servicios: reserva.filter(item => item.servicio_id).map(item => ({
        servicio_id: item.servicio_id,
        descripcion: item.servicio_descripcion,
        importe: item.servicio_importe
      }))
    };

    
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

export const verMisReservas = async (req, res) => {
  try {
    
    const usuariosServicio = new UsuariosServicio();
    const usuario = await usuariosServicio.obtenerPorId(req.usuario.id);
    const usuario_id = usuario.usuario_id;

    
    const reservas = await reservasModelo.obtenerReservasPorUsuario(usuario_id);

    if (!reservas || reservas.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontraron reservas para este usuario'
      });
    }

    
    const reservasFormateadas = reservas.map(reserva => ({
      fecha: reserva.fecha_reserva,
      turno: `${reserva.hora_desde} - ${reserva.hora_hasta}`,
      nombre_salon: reserva.salon_nombre,
      precio_salon: reserva.importe_salon,
      servicios: reserva.servicios_nombres ? 
        reserva.servicios_nombres.split(',').map((nombre, index) => ({
          nombre: nombre.trim(),
          precio: parseFloat(reserva.servicios_importes.split(',')[index])
        })) : [],
      importe_total: reserva.importe_total
    }));

    
    return res.status(200).json({
      ok: true,
      data: reservasFormateadas
    });

  } catch (error) {
    console.error('Error en verMisReservas:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener las reservas'
    });
  }
};


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
