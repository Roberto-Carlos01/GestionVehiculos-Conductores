const {
  getDrivers,
  createDriver,
  getDriverForId,
  setDriver,
} = require("../models/conductorModel");
const { getVehiclesWithDrivers } = require("../models/vehiculoModel");
const { generarListaVehiculos } = require("../controllers/vehiculoController");

const url = require("url");
const querystring = require("querystring");
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

async function getFormularioConductor(req, res) {
  try {
    const template = getHTMLFormDriver();

    const htmlFinal = template

      // Configuración general
      .replace("{{ACTION}}", "/conductores/nuevo")
      .replace("{{BOTON}}", "Registrar Conductor")
      .replace("{{TITULO}}", "🚖 Registrar Nuevo Conductor")

      // Campos vacíos
      .replace("{{ID}}", "")
      .replace("{{CI}}", "")
      .replace("{{NOMBRES}}", "")
      .replace("{{APELLIDOS}}", "")
      .replace("{{FECHA_NACIMIENTO}}", "")
      .replace("{{DIRECCION}}", "")
      .replace("{{TELEFONO}}", "");

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
async function AddNewDriver(req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const driver = querystring.parse(body);
      await createDriver(
        driver.ci,
        driver.nombres,
        driver.apellidos,
        driver.fecha_nacimiento,
        driver.direccion,
        driver.telefono,
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

// FUNCION PARA REDIRECCIONAR LA FORMULARIO
async function getFormularioUpdateHTML(req, res, idConductor) {
  try {
    const template = getHTMLFormDriver();
    const driver = await getDriverForId(idConductor);
    const htmlFinal = template

      // Configuración general
      .replace("{{ACTION}}", `/conductores/editar`)
      .replace("{{BOTON}}", "Actualizar Conductor")
      .replace("{{TITULO}}", "🚖 Actualizar Conductor")

      // Campos vacíos
      .replace("{{ID}}", idConductor || "")
      .replace("{{CI}}", driver.ci || "")
      .replace("{{NOMBRES}}", driver.nombres || "")
      .replace("{{APELLIDOS}}", driver.apellidos || "")
      .replace("{{FECHA_NACIMIENTO}}", driver.fecha_nacimiento || "")
      .replace("{{DIRECCION}}", driver.direccion || "")
      .replace("{{TELEFONO}}", driver.telefono || "");

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
// FUNCION PARA EDITAR DATOS DE UN CONDUCTOR
async function updateDriver(req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body = body + chunk.toString();
    });

    req.on("end", async () => {
      const datos = querystring.parse(body);
      await setDriver(
        datos.id,
        datos.ci,
        datos.nombres,
        datos.apellidos,
        datos.fecha_nacimiento,
        datos.direccion,
        datos.telefono,
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

module.exports = {
  showDrivers,
  showHome,
  AddNewDriver,
  getFormularioConductor,
  getFormularioUpdateHTML,
  updateDriver,
};
