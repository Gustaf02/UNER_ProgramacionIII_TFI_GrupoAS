import { conexion } from "../bd/conexion.js";

export class ReservasServicio {
  async verificarDisponibilidad(
    fecha_reserva,
    salon_id,
    turno_id,
    excluirReservaId = null
  ) {
    let sql = `SELECT reserva_id FROM reservas 
             WHERE fecha_reserva = ? AND salon_id = ? AND turno_id = ? AND activo = 1`;
    const values = [fecha_reserva, salon_id, turno_id];

    if (excluirReservaId) {
      sql += ` AND reserva_id != ?`;
      values.push(excluirReservaId);
    }

    try {
      const [results] = await conexion.query(sql, values);
      return results.length > 0;
    } catch (error) {
      throw error;
    }
  }
  async crear(datosReserva, servicios) {
    const {
      fecha_reserva,
      salon_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
      usuario_id,
      activo = 1,
    } = datosReserva;

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

    try {
      await conexion.beginTransaction();

      const reservaSql = `INSERT INTO reservas 
                        (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, activo) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const reservaValues = [
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        activo,
      ];

      const [reservaResult] = await conexion.query(reservaSql, reservaValues);
      const reservaId = reservaResult.insertId;

      if (servicios && servicios.length > 0) {
        const serviciosSql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES ?`;
        const serviciosValues = servicios.map((s) => [
          reservaId,
          s.servicio_id,
          s.importe,
        ]);
        await conexion.query(serviciosSql, [serviciosValues]);
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
      const [reservas] = await conexion.query(`SELECT 
                r.reserva_id, r.fecha_reserva, r.tematica, r.importe_total,
                s.titulo AS nombre_salon, t.hora_desde AS turno_desde,
                u.nombre_usuario AS cliente_usuario, r.creado, r.modificado
              FROM reservas r
              LEFT JOIN salones s ON r.salon_id = s.salon_id
              LEFT JOIN turnos t ON r.turno_id = t.turno_id
              LEFT JOIN usuarios u ON r.usuario_id = u.usuario_id
              WHERE r.activo = 1
              ORDER BY r.fecha_reserva DESC`);
      return reservas;
    } catch (error) {
      throw error;
    }
  }

  // Obtener reserva por id
  async obtenerPorId(reservaId) {
    try {
      const [results] = await conexion.query(
        `SELECT
                -- REEMPLAZO DE r.* con la lista explícita de columnas
                r.reserva_id, r.fecha_reserva, r.salon_id, r.usuario_id, 
                r.turno_id, r.tematica, r.importe_salon, r.importe_total, 
                r.activo, r.creado, r.modificado, 
                
                -- Columnas de las tablas JOIN
                s.titulo AS nombre_salon,
                t.hora_desde AS turno_desde,
                t.hora_hasta AS turno_hasta,
                u.nombre AS cliente_nombre,
                u.apellido AS cliente_apellido,
                u.celular AS cliente_celular,
                rs.servicio_id,
                se.descripcion AS servicio_descripcion,
                rs.importe AS servicio_importe
              FROM reservas r
              LEFT JOIN salones s ON r.salon_id = s.salon_id
              LEFT JOIN turnos t ON r.turno_id = t.turno_id
              LEFT JOIN usuarios u ON r.usuario_id = u.usuario_id
              LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
              LEFT JOIN servicios se ON rs.servicio_id = se.servicio_id
              WHERE r.reserva_id = ? AND r.activo = 1`,
        [reservaId]
      );

      // Lógica de formateo de la respuesta (agrupar servicios)
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

      // Eliminar campos duplicados de servicio de la reserva principal
      delete reserva.servicio_id;
      delete reserva.servicio_descripcion;
      delete reserva.servicio_importe;

      return reserva;
    } catch (error) {
      throw error;
    }
  }

  async modificar(reservaId, datosReserva, servicios) {
    try {
      await conexion.beginTransaction();

      const updateReservaSql = `UPDATE reservas SET fecha_reserva = ?, salon_id = ?, usuario_id = ?, turno_id = ?, foto_cumpleaniero = ?, tematica = ?, importe_salon = ?, importe_total = ?, modificado = CURRENT_TIMESTAMP() WHERE reserva_id = ? AND activo = 1`;
      const updateReservaValues = [
        datosReserva.fecha_reserva,
        datosReserva.salon_id,
        datosReserva.usuario_id,
        datosReserva.turno_id,
        datosReserva.foto_cumpleaniero,
        datosReserva.tematica,
        datosReserva.importe_salon,
        datosReserva.importe_total,
        reservaId,
      ];

      const [reservaResult] = await conexion.query(
        updateReservaSql,
        updateReservaValues
      );

      if (reservaResult.affectedRows === 0) {
        await conexion.rollback();
        return false;
      }

      const deleteServiciosSql =
        "DELETE FROM reservas_servicios WHERE reserva_id = ?";
      await conexion.query(deleteServiciosSql, [reservaId]);

      if (servicios && servicios.length > 0) {
        const insertServiciosSql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES ?`;
        const serviciosValues = servicios.map((s) => [
          reservaId,
          s.servicio_id,
          s.importe,
        ]);
        await conexion.query(insertServiciosSql, [serviciosValues]);
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
    const sql = `UPDATE reservas SET activo = 0, modificado = CURRENT_TIMESTAMP() WHERE reserva_id = ? AND activo = 1`;

    try {
      const [result] = await conexion.query(sql, [reservaId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

export const reservaServicio = new ReservasServicio();
