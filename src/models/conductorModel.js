const conection = require("../config/conectabd");

async function getDrivers() {
  try {
    const [rows] = await conection.query(
      "SELECT * FROM conductor ORDER BY idConductor DESC",
    );
    console.log(
      `📋 Se obtuvieron ${rows.length} conductores de la base de datos`,
    );
    return rows;
  } catch (error) {
    console.error("❌ Error al obtener los conductores:", error.message);
    return [];
  }
}
async function createDriver(
  ci,
  nombres,
  apellidos,
  fecha_nacimiento,
  direccion,
  telefono,
) {
  try {
    const [result] = await conection.query(
      "INSERT INTO conductor (ci, nombres, apellidos, fecha_nacimiento, direccion, telefono) VALUES (? ,? ,? ,? ,? ,?)",
      [ci, nombres, apellidos, fecha_nacimiento, direccion, telefono],
    );
    console.log(`✅ Conductor registrado con ID: ${result.insertId}`);
    console.log(`✅ Conductor : ${nombres} Registrado exitosamente`);
  } catch (error) {
    console.error(
      `❌ Error al registrar al conductor ${nombres}  :`,
      error.message,
    );
  }
}
async function searchDriver(nombre) {}
async function setDriver(
  idConductor,
  ci,
  nombres,
  apellidos,
  fecha_nacimiento,
  direccion,
  telefono,
) {
  try {
    const [result] = await conection.query(
      "UPDATE conductor SET ci = ?  , nombres = ?  , apellidos = ?  , fecha_nacimiento = ?  , direccion = ?  , telefono = ? WHERE idConductor = ?  ",
      [
        ci,
        nombres,
        apellidos,
        fecha_nacimiento,
        direccion,
        telefono,
        idConductor,
      ],
    );

    if (result.affectedRows > 0) {
      console.log(`✅ Conductor ${nombres} modificado exitosamente`);
    } else {
      console.log(
        `⚠️ No se encontró un conductor con id ${idConductor} y nombre ${nombres}`,
      );
    }
  } catch (error) {
    console.error(
      `❌ Error al modificar al conductor ${nombres}:`,
      error.message,
    );
  }
}

async function getDriverForId(id) {
  try {
    const [rows] = await conection.query(
      "SELECT * FROM conductor WHERE idConductor = ?",
      [id],
    );
    // retornamos solo el primer objeto del array de filas que encontro la consulta
    return rows[0];
  } catch (error) {
    console.error(
      `❌ No se encontro al conductor de id: ${id}  `,
      error.message,
    );
    return null;
  }
}
async function deleteDriver(id) {
  try {
    const [result] = await conection.query(
      "DELETE FROM conductor WHERE idConductor = ?",
      [id],
    );
    if (result.affectedRows > 0) {
      console.log(`✅ Conductor ${id} eliminado exitosamente`);
    } else {
      console.log(`⚠️ No se encontró un conductor con id ${id}`);
    }
    // mostramos mensaje de existo
  } catch (error) {
    console.error(
      `❌ No se encontro al conductor de id: ${id}  `,
      error.message,
    );
  }
}
async function getDriverForCi(ci) {
  try {
    const [rows] = await conection.query(
      "SELECT * FROM conductor WHERE ci = ?",
      [ci],
    );
    // retornamos solo el primer objeto del array de filas que encontro la consulta
    return rows[0];
  } catch (error) {
    console.error(
      `❌ No se encontro al conductor de ci: ${ci}  `,
      error.message,
    );
    return null;
  }
}

module.exports = {
  createDriver,
  deleteDriver,
  getDrivers,
  getDriverForId,
  searchDriver,
  setDriver,
  getDriverForCi,
};
