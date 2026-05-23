const { getDrivers } = require("../models/conductorModel");
const { getVehiclesWithDrivers } = require("../models/vehiculoModel");
const { generarListaVehiculos } = require("../controllers/vehiculoController");
const path = require("path");
const fs = require("fs");

function getHTML() {
  const filePath = path.join(__dirname, "../views", "index.html");
  return fs.readFileSync(filePath, "utf8"); // lee el archivo como texto
}

function getHTMLFormDriver() {
  const filePath = path.join(__dirname, "../views/conductores", "form.html");
  return fs.readFileSync(filePath, "utf8");
}
function generarListaDrivers(drivers) {
  if (drivers.length === 0) {
    return '<p class="text-muted">No hay conductores registrados aún.</p>';
  }

  let html = '<div class="row">';

  drivers.forEach((driver) => {
    html += `
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
        <div class="card h-100">
          <div class="card-body">

            <h5 class="card-title">
              ${driver.nombres} ${driver.apellidos}
            </h5>

            <p class="card-text">
              <strong>CI:</strong> ${driver.ci}<br>
              <strong>Fecha Nacimiento:</strong> ${driver.fecha_nacimiento}<br>
              <strong>Dirección:</strong> ${driver.direccion}<br>
              <strong>Teléfono:</strong> ${driver.telefono}
            </p>

            <div class="mt-3">
              <a href="/conductores/editar?id=${driver.idConductor}" 
                 class="btn btn-warning btn-sm me-2">
                 Editar
              </a>

              <a href="/conductores/eliminar?id=${driver.idConductor}" 
                 class="btn btn-danger btn-sm"
                 onclick="return confirm('¿Eliminar conductor?')">
                 Eliminar
              </a>
            </div>

          </div>
        </div>
      </div>
    `;
  });

  html += "</div>";

  return html;
}
async function showDrivers(req, res) {
  try {
    const template = getHTML();
    const drivers = await getDrivers();
    const listaHTML = generarListaDrivers(drivers);
    const htmlFinal = template.replace(
      '<div id="lista-conductores">',
      `<div id="lista-conductores">${listaHTML}`,
    );

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });
    res.end(htmlFinal);
    return;
  } catch (error) {
    res.writeHead(500);
    res.end("error");
    return;
  }
}

async function showHome(req, res) {
  try {
    const drivers = await getDrivers();
    const vehicles = await getVehiclesWithDrivers();
    const template = getHTML();
    const listaHTML = generarListaDrivers(drivers);
    const listaVehiculosHTML = generarListaVehiculos(vehicles);
    const htmlFinal = template
      .replace(
        '<div id="lista-conductores">',
        `<div id="lista-conductores">${listaHTML}`,
      )
      .replace(
        '<div id="lista-vehiculos">',
        `<div id="lista-vehiculos">${listaVehiculosHTML}`,
      );
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });
    res.end(htmlFinal);
    return;
  } catch (error) {
    res.writeHead(500);
    res.end("error");
    return;
  }
}

module.exports = {
  showDrivers,
  showHome,
};
