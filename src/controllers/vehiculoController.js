const url = require("url");
const querystring = require("querystring");
const path = require("path");
const fs = require("fs");

const {
  getvehicles,
  getVehiclesWithDrivers,
  createVehicle,
  setVehicle,
  getVehicleForId,
  deleteVehicle,
} = require("../models/vehiculoModel");

const { getDriverForId, getDriverForCi } = require("../models/conductorModel");

function getHTMLFormVehicle() {
  const filePath = path.join(__dirname, "../views/vehiculos", "form.html");
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

async function getFormularioVehiculo(req, res) {
  try {
    const template = getHTMLFormVehicle();

    const htmlFinal = template

      // Configuración general
      .replace("{{ACTION}}", "/vehiculos/nuevo")
      .replace("{{BOTON}}", "Registrar Vehículo")
      .replace("{{TITULO}}", "🚗 Registrar Nuevo Vehículo")

      // Campos vacíos
      .replace("{{ID}}", "")
      .replace("{{CI}}", "")
      .replace("{{PLACA}}", "")
      .replace("{{MARCA}}", "")
      .replace("{{MODELO}}", "")
      .replace("{{ANIO}}", "")
      .replace("{{COLOR}}", "");

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });

    return res.end(htmlFinal);
  } catch (error) {
    console.error("Error al obtener el formulario:", error);

    res.writeHead(500, {
      "Content-Type": "text/plain",
    });

    return res.end("Error interno del servidor");
  }
}
async function createVehicles(req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const Vehiculo = querystring.parse(body);
      await createVehicle(
        Vehiculo.placa,
        Vehiculo.marca,
        Vehiculo.modelo,
        Vehiculo.anio,
        Vehiculo.color,
        Vehiculo.ci,
      );
      res.writeHead(302, {
        Location: "/",
      });
      res.end();
    });
    return;
  } catch (error) {
    console.error("Error al renderizar la página:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error interno del servidor");
  }
}

//FORMULARIO PARA EDITAR DATOS
async function getFormularioUpdateVehiculo(req, res, placa) {
  try {
    const template = getHTMLFormVehicle();
    const vehiculo = await getVehicleForId(placa);
    const driver = await getDriverForId(vehiculo.idConductor);

    if (vehiculo) {
      const htmlFinal = template

        // Configuración general
        .replace("{{ACTION}}", "/vehiculos/editar")
        .replace("{{BOTON}}", "Actualizar Datos")
        .replace("{{TITULO}}", "🚗 Actualizar Datos del Vehículo")

        // Campos vacíos
        .replace("{{PLACA}}", vehiculo.placa || "")
        .replace("{{MARCA}}", vehiculo.marca || "")
        .replace("{{MODELO}}", vehiculo.modelo || "")
        .replace("{{ANIO}}", vehiculo.anio || "")
        .replace("{{COLOR}}", vehiculo.color || "")
        .replace("{{CI}}", driver.ci || "");

      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });
      res.end(htmlFinal);
      return;
    } else {
      console.log("Vehiculo no encontrado : ", placa);
      res.writeHead(404, {
        "Content-Type": "text/plain",
      });

      res.end("Vehiculo no encontrado");
      return;
    }
  } catch (error) {
    console.error("Error al obtener el formulario:", error);

    res.writeHead(500, {
      "Content-Type": "text/plain",
    });
    return res.end("Error interno del servidor");
  }
}

async function updateVehicle(req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const Vehiculo = querystring.parse(body);
      await setVehicle(
        Vehiculo.placa,
        Vehiculo.marca,
        Vehiculo.modelo,
        Vehiculo.anio,
        Vehiculo.color,
        Vehiculo.ci,
      );
      res.writeHead(302, {
        Location: "/",
      });
      res.end();
    });
    return;
  } catch (error) {
    console.error("Error al renderizar la página:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error interno del servidor");
  }
}
async function deleteVehicleC(req, res, placa) {
  try {
    await deleteVehicle(placa);
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
    return;
  } catch (error) {
    console.error("Error al renderizar la página:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error interno del servidor");
  }
}

module.exports = {
  showVehicles,
  generarListaVehiculos,
  createVehicles,
  getFormularioVehiculo,
  getFormularioUpdateVehiculo,
  updateVehicle,
  deleteVehicleC,
};
