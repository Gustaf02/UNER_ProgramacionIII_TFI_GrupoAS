import { conexion } from "../bd/conexion.js";
import { reservasModelo } from "../bd/reservas.js";

export class ReservasServicio {
  async verificarDisponibilidad(
    fecha_reserva,
    salon_id,
    turno_id,
    excluirReservaId = null
  ) {
    try {
      const results = await reservasModelo.verificarDisponibilidad(
        fecha_reserva,
        salon_id,
        turno_id,
        excluirReservaId
      );
      return results.length > 0;
    } catch (error) {
      throw error;
    }
  }

  async crear(datosReserva, servicios) {
    const { fecha_reserva, salon_id, turno_id } = datosReserva;

    const yaReservada = await this.verificarDisponibilidad(
      fecha_reserva,
      salon_id,
      turno_id
    );
    if (yaReservada) {
      throw new Error(
        `El salón ya está reservado para la fecha ${fecha_reserva} y el turno. Por favor, elige otra fecha u horario.`
      );
    }

    await conexion.beginTransaction();
    try {
      const reservaId = await reservasModelo.insertarReserva(datosReserva);

      if (servicios && servicios.length > 0) {
        await reservasModelo.insertarServicios(reservaId, servicios);
      }

      await conexion.commit();
      return reservaId;
    } catch (error) {
      await conexion.rollback();
      console.error("Error en servicio al crear reserva:", error);
      throw error;
    }
  }

  async obtenerTodos() {
    try {
      return await reservasModelo.obtenerTodas();
    } catch (error) {
      throw error;
    }
  }

  async obtenerPorId(reservaId) {
    try {
      const results = await reservasModelo.obtenerPorId(reservaId);

      if (results.length === 0) {
        return null;
      }

      const reserva = {
        ...results[0],
        servicios: [],
      };

      results.forEach((row) => {
        if (row.servicio_id) {
          reserva.servicios.push({
            servicio_id: row.servicio_id,
            descripcion: row.servicio_descripcion,
            importe: row.servicio_importe,
          });
        }
      });

      delete reserva.servicio_id;
      delete reserva.servicio_descripcion;
      delete reserva.servicio_importe;

      return reserva;
    } catch (error) {
      throw error;
    }
  }

  async modificar(reservaId, datosReserva, servicios) {
    await conexion.beginTransaction();
    try {
      const affectedRows = await reservasModelo.actualizarReserva(
        reservaId,
        datosReserva
      );

      if (affectedRows === 0) {
        await conexion.rollback();
        return false;
      }

      await reservasModelo.eliminarServicios(reservaId);

      if (servicios && servicios.length > 0) {
        await reservasModelo.insertarServicios(reservaId, servicios);
      }

      await conexion.commit();
      return true;
    } catch (error) {
      await conexion.rollback();
      console.error("Error en servicio al modificar reserva:", error);
      throw error;
    }
  }

  async eliminar(reservaId) {
    try {
      const affectedRows = await reservasModelo.eliminarReserva(reservaId);
      return affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

export const reservaServicio = new ReservasServicio();
