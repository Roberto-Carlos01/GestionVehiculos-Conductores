const path = require("path");
const fs = require("fs");
const {
  getvehicles,
  getVehiclesWithDrivers,
} = require("../models/vehiculoModel");

function getHTMLFormVehicle() {
  const filePath = path.join(__dirname, "views/vehiculos", "form.html");
  return fs.readFileSync(filePath, "utf8");
}

function getHTML() {
  const filePath = path.join(__dirname, "../views", "index.html");
  return fs.readFileSync(filePath, "utf8"); // lee el archivo como texto
}

function generarListaVehiculos(vehiculos) {
  if (vehiculos.length === 0) {
    return '<p class="text-muted">No hay vehículos registrados aún.</p>';
  }

  let html = '<div class="row">';

  vehiculos.forEach((vehiculo) => {
    html += `
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
        <div class="card h-100 shadow-sm border-0">

          <div class="card-body">

            <!-- TITULO -->
            <h5 class="card-title text-primary">
              ${vehiculo.marca} ${vehiculo.modelo}
            </h5>

            <!-- DUEÑO -->
            <p class="card-text mb-2">
              <strong>Propietario:</strong><br>
              ${vehiculo.nombres} ${vehiculo.apellidos}<br>
              <small class="text-muted">CI: ${vehiculo.ci}</small>
            </p>

            <hr>

            <!-- DATOS VEHICULO -->
            <p class="card-text">
              <small>
                <strong>Placa:</strong> ${vehiculo.placa}<br>
                <strong>Año:</strong> ${vehiculo.anio}<br>
                <strong>Color:</strong> ${vehiculo.color}
              </small>
            </p>

            <!-- BOTONES -->
            <div class="mt-3">
              <a href="/vehiculos/editar?placa=${vehiculo.placa}" 
                 class="btn btn-warning btn-sm me-2">
                 Editar
              </a>

              <a href="/vehiculos/eliminar?placa=${vehiculo.placa}" 
                 class="btn btn-danger btn-sm"
                 onclick="return confirm('¿Eliminar vehículo?')">
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

async function showVehicles(req, res) {
  try {
    const template = getHTML();
    const vehiculos = await getVehiclesWithDrivers();
    const listaHTML = generarListaVehiculos(vehiculos);
    const htmlFinal = template.replace(
      '<div id="lista-vehiculos">',
      `<div id="lista-vehiculos">${listaHTML}`,
    );
    console.log("Listo para responder al cliente: ");
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
async function createVehicles() {
  try {
  } catch (errro) {}
}

module.exports = {
  showVehicles,
  generarListaVehiculos,
};
