DELIMITER //

CREATE PROCEDURE sp_reportes()
BEGIN
    DECLARE total_usuarios_activos INT;
    DECLARE total_admins INT;
    DECLARE total_clientes INT;
    DECLARE total_empleados INT;
    DECLARE total_reservas INT;
    DECLARE reservas_con_servicios INT;
    DECLARE salon_mas_reservado VARCHAR(100);
    DECLARE servicio_mas_reservado VARCHAR(100);

    SELECT COUNT(*) INTO total_usuarios_activos FROM usuarios WHERE activo = 1;
    SELECT COUNT(*) INTO total_admins FROM usuarios WHERE tipo_usuario = 1 AND activo = 1;
    SELECT COUNT(*) INTO total_clientes FROM usuarios WHERE tipo_usuario = 2 AND activo = 1;
    SELECT COUNT(*) INTO total_empleados FROM usuarios WHERE tipo_usuario = 3 AND activo = 1;

    SELECT COUNT(*) INTO total_reservas FROM reservas WHERE activo = 1;

    SELECT COUNT(DISTINCT reserva_id) INTO reservas_con_servicios FROM reservas_servicios;

    SELECT s.titulo
    INTO salon_mas_reservado
    FROM reservas r
    JOIN salones s ON r.salon_id = s.salon_id
    WHERE r.activo = 1
    GROUP BY s.salon_id
    ORDER BY COUNT(r.reserva_id) DESC
    LIMIT 1;

    SELECT sv.descripcion
    INTO servicio_mas_reservado
    FROM reservas_servicios rs
    JOIN servicios sv ON rs.servicio_id = sv.servicio_id
    GROUP BY sv.servicio_id
    ORDER BY COUNT(rs.reserva_servicio_id) DESC
    LIMIT 1;

    SELECT 
        total_usuarios_activos,
        total_admins,
        total_clientes,
        total_empleados,
        total_reservas,
        reservas_con_servicios,
        salon_mas_reservado,
        servicio_mas_reservado;
END //

DELIMITER ;