import { reservaServicio } from "../servicios/reservaServicio.js"; // El servicio manejará la lógica de negocio y la DB
import { emailServicio } from '../servicios/emailServicios.js';

import { UsuariosServicio } from '../servicios/usuariosServicio.js';

export const crearReserva = async (req, res, next) => {
  try {
    const { servicios, ...nuevaReservaData } = req.body;

    const reservaId = await reservaServicio.crear(nuevaReservaData, servicios);

    // Obtener el usuario para conseguir su email (nombre_usuario)
    const usuariosServicio = new UsuariosServicio();
    const usuario = await usuariosServicio.obtenerPorId(nuevaReservaData.usuario_id);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    const emailEnviado = await emailServicio.enviarCorreoConfirmacionReserva(
      usuario.nombre_usuario,
      {
        reserva_id: reservaId,
        ...nuevaReservaData,
        servicios: servicios
      }
    );

    if (!emailEnviado) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al enviar el email de confirmación'
      });
    }

    return res.status(201).json({
      ok: true,
      mensaje: "Reserva creada exitosamente y notificación enviada por mail.",
      data: { reserva_id: reservaId },
    });
  } catch (error) {
    console.error("Error en crearReserva (Controlador):", error);

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
      mensaje: "Error interno del servidor al crear reserva.",
    });
  }
};
/**
 * [R] READ: Obtiene todas las reservas activas (Listado).
 */
export const obtenerReservas = async (req, res) => {
  try {
    const reservas = await reservaServicio.obtenerTodos();

    return res.status(200).json({
      ok: true,
      data: reservas,
    });
  } catch (error) {
    console.error("Error en obtenerReservas (Controlador):", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor al obtener el listado de reservas.",
    });
  }
};

/**
 * [R] READ: Obtiene una reserva específica por su ID.
 */
export const obtenerReservaPorId = async (req, res) => {
  try {
    const { reserva_id } = req.params;

    const reserva = await reservaServicio.obtenerPorId(reserva_id);

    if (!reserva) {
      return res.status(404).json({
        ok: false,
        mensaje: `Reserva con ID ${reserva_id} no encontrada.`,
      });
    }

    return res.status(200).json({
      ok: true,
      data: reserva,
    });
  } catch (error) {
    console.error("Error en obtenerReservaPorId (Controlador):", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor al obtener la reserva.",
    });
  }
};

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
