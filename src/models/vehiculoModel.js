const conection = require("../config/conectabd");
const { getDriverForCi } = require("./conductorModel");

async function getvehicles() {
  try {
    const [rows] = await conection.query(
      "SELECT * FROM vehiculo ORDER BY placa DESC",
    );
    console.log(
      `📋 Se obtuvieron ${rows.length} vehiculos de la base de datos`,
    );
    return rows;
  } catch (error) {
    console.error("❌ Error al obtener los vehiculos:", error.message);
    return [];
  }
}

//OBTENER A LOS VEHICULOS CON EL NOMBRE Y CI DEL DUENIO
async function getVehiclesWithDrivers() {
  try {
    const [rows] = await conection.query(
      "SELECT v.marca , v.modelo , c.nombres , c.apellidos , c.ci , v.placa , v.anio , v.color FROM vehiculo v JOIN conductor c ON c.idConductor = v.idConductor",
    );
    console.log(
      `📋 Se obtuvieron ${rows.length} vehiculos con sus Conductores de la base de datos`,
    );
    return rows;
  } catch (error) {
    console.error(
      "❌ Error al obtener los vehiculos con sus duenios:",
      error.message,
    );
    return [];
  }
}
//---------------------------------------------------------
// OBTENER AL CONDUCTOR MEDIANTE CI x
//---------------------------------------------------------
//para esto usamos la funcion getDriverForCi del modulo de conductor

async function createVehicle(placa, marca, modelo, anio, color, ci) {
  try {
    const driver = await getDriverForCi(ci);
    if (driver) {
      const [result] = await conection.query(
        "INSERT INTO vehiculo (placa, marca, modelo, anio, color, idConductor) VALUES (? ,? ,? ,? ,? ,?)",
        [placa, marca, modelo, anio, color, driver.idConductor],
      );
      console.log(`✅ Vehiculo : ${marca} ${modelo} Registrado exitosamente`);
    } else {
      console.error(
        `❌ Error al buscar conductor con ci ${ci}:`,
        error.message,
      );
    }
  } catch (error) {
    console.error(
      `❌ Error al registrar al vehiculo ${marca} ${modelo}  :`,
      error.message,
    );
  }
}
async function searchVehicle(marca) {}
async function setVehicle(
  placa,
  marca,
  modelo,
  anio,
  color,
  ci
) {

  try {

    const driver = await getDriverForCi(ci);

    console.log(
      "DATOS DEL VEHICULO EN MODELO Y CONDUCTOR:",
      driver
    );

    if (!driver) {

      console.error(
        `❌ No se encontró conductor con CI ${ci}`
      );

      return;
    }

    const [result] = await conection.query(

      `UPDATE vehiculo
       SET
         placa = ?,
         marca = ?,
         modelo = ?,
         anio = ?,
         color = ?,
         idConductor = ?
       WHERE placa = ?`,

      [
        placa,
        marca,
        modelo,
        anio,
        color,
        driver.idConductor,
        placa,
      ]
    );

    if (result.affectedRows > 0) {

      console.log(
        `✅ Vehiculo ${marca} ${modelo} modificado exitosamente`
      );

    } else {

      console.log(
        `⚠️ No se encontró un Vehiculo con placa ${placa}`
      );
    }

  } catch (error) {

    console.error(
      `❌ Error al modificar al vehiculo ${placa}:`,
      error.message
    );
  }
}
async function getVehicleForId(placa) {
  try {
    const [rows] = await conection.query(
      "SELECT * FROM vehiculo WHERE placa = ?",
      [placa],
    );
    // retornamos solo el primer objeto del array de filas que encontro la consulta
    return rows[0];
  } catch (error) {
    console.error(
      `❌ No se encontro al vehiculo de placa: ${placa}  `,
      error.message,
    );
    return null;
  }
}
async function deleteVehicle(placa) {
  try {
    const [result] = await conection.query(
      "DELETE FROM vehiculo WHERE placa = ?",
      [placa],
    );
    if (result.affectedRows > 0) {
      console.log(`✅ Vehiculo ${placa} eliminado exitosamente`);
    } else {
      console.log(`⚠️ No se encontró un vehiculo con placa ${placa}`);
    }
    // mostramos mensaje de existo
  } catch (error) {
    console.error(
      `❌ No se encontro al vehiculo de placa: ${placa}  `,
      error.message,
    );
  }
}

module.exports = {
  createVehicle,
  deleteVehicle,
  getvehicles,
  getVehicleForId,
  searchVehicle,
  setVehicle,
  getVehiclesWithDrivers,
};
