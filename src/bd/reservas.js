import { conexion } from "./conexion.js";

export class ReservasModelo {


  async obtenerPrecioSalon(salon_id) {
    const sql = `SELECT salon_id, titulo, importe 
                 FROM salones 
                 WHERE salon_id = ? AND activo = 1`;
    const [results] = await conexion.query(sql, [salon_id]);
    return results[0];
  }


  async obtenerPreciosServicios(servicios_ids) {
    if (!servicios_ids || servicios_ids.length === 0) {
      return [];
    }
    
    const placeholders = servicios_ids.map(() => '?').join(',');
    const sql = `SELECT servicio_id, descripcion, importe 
                 FROM servicios 
                 WHERE servicio_id IN (${placeholders}) AND activo = 1`;
    
    const [results] = await conexion.query(sql, servicios_ids);
    return results;
  }


  async verificarSalonActivo(salon_id) {
    const sql = `SELECT salon_id FROM salones WHERE salon_id = ? AND activo = 1`;
    const [results] = await conexion.query(sql, [salon_id]);
    return results.length > 0;
  }

  /**
   * verifica que todos los servicios existan y esten activos
   */
  async verificarServiciosActivos(servicios_ids) {
    if (!servicios_ids || servicios_ids.length === 0) {
      return true;
    }

    const placeholders = servicios_ids.map(() => '?').join(',');
    const sql = `SELECT COUNT(*) as count 
                 FROM servicios 
                 WHERE servicio_id IN (${placeholders}) AND activo = 1`;
    
    const [results] = await conexion.query(sql, servicios_ids);
    return results[0].count === servicios_ids.length;
  }


  async verificarTurnoActivo(turno_id) {
    const sql = `SELECT turno_id FROM turnos WHERE turno_id = ? AND activo = 1`;
    const [results] = await conexion.query(sql, [turno_id]);
    return results.length > 0;
  }


  async verificarDisponibilidad(fecha_reserva, salon_id, turno_id, excluirReservaId = null) {
    let sql = `SELECT reserva_id FROM reservas 
               WHERE fecha_reserva = ? AND salon_id = ? AND turno_id = ? AND activo = 1`;
    const values = [fecha_reserva, salon_id, turno_id];

    if (excluirReservaId) {
      sql += ` AND reserva_id != ?`;
      values.push(excluirReservaId);
    }

    const [results] = await conexion.query(sql, values);
    return results;
  }

  async obtenerTodas() {
    const sql = `SELECT 
                    r.reserva_id, r.fecha_reserva, r.tematica, r.importe_total,
                    s.titulo AS nombre_salon, t.hora_desde AS turno_desde,
                    u.nombre_usuario AS cliente_usuario, r.creado, r.modificado
                 FROM reservas r
                 LEFT JOIN salones s ON r.salon_id = s.salon_id
                 LEFT JOIN turnos t ON r.turno_id = t.turno_id
                 LEFT JOIN usuarios u ON r.usuario_id = u.usuario_id
                 WHERE r.activo = 1
                 ORDER BY r.fecha_reserva DESC`;

    const [reservas] = await conexion.query(sql);
    return reservas;
  }

  async obtenerPorId(reservaId) {
    const sql = `SELECT
                    r.reserva_id, r.fecha_reserva, r.salon_id, r.usuario_id, 
                    r.turno_id, r.tematica, r.importe_salon, r.importe_total, 
                    r.activo, r.creado, r.modificado, 
                    
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
                  WHERE r.reserva_id = ? AND r.activo = 1`;

    const [results] = await conexion.query(sql, [reservaId]);
    return results;
  }


  async insertarReserva(datosReserva) {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
      activo = 1,
    } = datosReserva;

    const sql = `INSERT INTO reservas 
                 (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, activo) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
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

    const [reservaResult] = await conexion.query(sql, values);
    return reservaResult.insertId;
  }

  async insertarServicios(reservaId, servicios) {
    if (!servicios || servicios.length === 0) {
      return;
    }
    
    const sql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES ?`;
    const serviciosValues = servicios.map((s) => [
      reservaId,
      s.servicio_id,
      s.importe,
    ]);
    await conexion.query(sql, [serviciosValues]);
  }

  async actualizarReserva(reservaId, datosReserva) {
    const fieldsToUpdate = [];
    const values = [];

    for (const key in datosReserva) {
      if (
        Object.hasOwnProperty.call(datosReserva, key) &&
        key !== "servicios" &&
        key !== "reserva_id"
      ) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(datosReserva[key]);
      }
    }

    if (fieldsToUpdate.length === 0) {
      return 1;
    }

    fieldsToUpdate.push(`modificado = CURRENT_TIMESTAMP()`);

    const sql = `UPDATE reservas SET ${fieldsToUpdate.join(
      ", "
    )} WHERE reserva_id = ? AND activo = 1`;
    values.push(reservaId);

    const [result] = await conexion.query(sql, values);
    return result.affectedRows;
  }

  async eliminarServicios(reservaId) {
    const sql = "DELETE FROM reservas_servicios WHERE reserva_id = ?";
    await conexion.query(sql, [reservaId]);
  }

  async eliminarReserva(reservaId) {
    const sql = `UPDATE reservas SET activo = 0, modificado = CURRENT_TIMESTAMP() WHERE reserva_id = ? AND activo = 1`;
    const [result] = await conexion.query(sql, [reservaId]);
    return result.affectedRows;
  }


  async beginTransaction() {
    return conexion.beginTransaction();
  }

  async commit() {
    return conexion.commit();
  }

  async rollback() {
    return conexion.rollback();
  }



async obtenerReservasPorUsuario(usuario_id) {
  const sql = `
    SELECT 
      r.reserva_id,
      r.fecha_reserva,
      r.importe_salon,
      r.importe_total,
      s.titulo as salon_nombre,
      t.hora_desde,
      t.hora_hasta,
      GROUP_CONCAT(DISTINCT sv.descripcion) as servicios_nombres,
      GROUP_CONCAT(DISTINCT rs.importe) as servicios_importes
    FROM reservas r
    INNER JOIN salones s ON r.salon_id = s.salon_id
    INNER JOIN turnos t ON r.turno_id = t.turno_id
    LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
    LEFT JOIN servicios sv ON rs.servicio_id = sv.servicio_id
    WHERE r.usuario_id = ? AND r.activo = 1
    GROUP BY r.reserva_id
    ORDER BY r.fecha_reserva DESC, r.creado DESC
  `;
  
  const [results] = await conexion.query(sql, [usuario_id]);
  return results;
}
}

export const reservasModelo = new ReservasModelo();