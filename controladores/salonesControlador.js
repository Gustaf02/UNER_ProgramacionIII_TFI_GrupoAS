import { conexion } from "../bd/conexion.js";

export const obtenerSalones = async (req, res, next) => {
  try {
    const sql = "SELECT * FROM salones WHERE activo = 1";
    const [resultados] = await conexion.query(sql);
    res.json({ ok: true, salones: resultados });
  } catch (error) {
    next(error);
  }
};

export const obtenerSalonPorId = async (req, res, next) => {
  try {
    const salon_id = req.params.salon_id;
    const sql = "SELECT * FROM salones WHERE activo = 1 AND salon_id = ?";
    const resultados = await conexion.query(sql, salon_id);

    if (resultados.length === 0) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "salon no encontrado" });
    }
    res.json({ ok: true, salon: resultados[0] });
  } catch (error) {
    next(error);
  }
};

export const crearSalon = async (req, res, next) => {
  try {
    const { titulo, direccion, latitud, longitud, capacidad, importe } =
      req.body;
    // Validar que los campos requeridos no estén vacíos
    if (!titulo || !direccion || !importe) {
      return res.status(400).json({
        ok: false,
        mensaje: "Campos requeridos faltantes: titulo, direccion, importe",
      });
    }
    const sql =
      "INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe) VALUES (?, ?, ?, ?, ?, ?)";
    const [resultado] = await conexion.query(sql, [
      titulo,
      direccion,
      latitud,
      longitud,
      capacidad,
      importe,
    ]);
    res.status(201).json({
      ok: true,
      mensaje: "Salón creado exitosamente",
      id: resultado.insertId,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarSalon = async (req, res, next) => {
  try {
    const { salon_id } = req.params;

    const { titulo, direccion, latitud, longitud, capacidad, importe } =
      req.body;

    const sql =
      "UPDATE salones SET titulo = ?, direccion = ?, latitud = ?, longitud = ?, capacidad = ?, importe = ? WHERE salon_id = ?";

    const [resultado] = await conexion.query(sql, [
      titulo,
      direccion,
      latitud,
      longitud,
      capacidad,
      importe,
      salon_id,
    ]);

    if (resultado.affectedRows === 0) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Salón no encontrado" });
    }

    res
      .status(200)
      .json({ ok: true, mensaje: "Salón actualizado exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const eliminarSalon = async (req, res, next) => {
  try {
    const { salon_id } = req.params;

    const sql = "UPDATE salones SET activo = 0 WHERE salon_id = ?";

    const [resultado] = await conexion.query(sql, [salon_id]);

    if (resultado.affectedRows === 0) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Salón no encontrado" });
    }

    res.status(200).json({ ok: true, mensaje: "Salón eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};
