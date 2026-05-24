const {
  getDrivers,
  createDriver,
  getDriverForId,
  setDriver,
  deleteDriver,
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
// ============================================
// LISTA DE CONDUCTORES
// ============================================

function generarListaDrivers(drivers) {
  if (drivers.length === 0) {
    return `

      <div class="alert alert-light border shadow-sm rounded-4 text-center p-4">

        <h4 class="mb-2">
          🚫 No hay conductores registrados
        </h4>

        <p class="text-muted mb-0">
          Registra un nuevo conductor para comenzar.
        </p>

      </div>
    `;
  }

  let html = `
    <div class="row g-4">
  `;

  drivers.forEach((driver) => {
    html += `

      <div class="col-12 col-md-6 col-xl-4">

        <div
          class="card h-100 border-0 shadow-lg rounded-4 overflow-hidden"
          style="
            transition: 0.3s ease;
            background: linear-gradient(to bottom, #ffffff, #f8fafc);
          "
        >

          <!-- HEADER -->
          <div
            class="p-4 text-white"
            style="
              background: linear-gradient(to right, #0d6efd, #2563eb);
            "
          >

            <div class="d-flex justify-content-between align-items-center">

              <div>

                <h4 class="mb-1 fw-bold">
                  👨‍✈️ ${driver.nombres}
                </h4>

                <h6 class="mb-0 opacity-75">
                  ${driver.apellidos}
                </h6>

              </div>

              <div
                class="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
                style="
                  width: 60px;
                  height: 60px;
                  font-size: 1.5rem;
                "
              >
                <i class="bi bi-person-fill"></i>
              </div>

            </div>

          </div>

          <!-- BODY -->
          <div class="card-body p-4">

            <div class="mb-3">

              <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
                🪪 CI: ${driver.ci}
              </span>

            </div>

            <div class="d-flex flex-column gap-3">

              <div class="d-flex align-items-start gap-3">

                <div class="text-primary">
                  <i class="bi bi-calendar-event-fill"></i>
                </div>

                <div>
                  <small class="text-muted d-block">
                    Fecha de nacimiento
                  </small>

                  <strong>
                    ${driver.fecha_nacimiento}
                  </strong>
                </div>

              </div>

              <div class="d-flex align-items-start gap-3">

                <div class="text-primary">
                  <i class="bi bi-geo-alt-fill"></i>
                </div>

                <div>
                  <small class="text-muted d-block">
                    Dirección
                  </small>

                  <strong>
                    ${driver.direccion}
                  </strong>
                </div>

              </div>

              <div class="d-flex align-items-start gap-3">

                <div class="text-primary">
                  <i class="bi bi-telephone-fill"></i>
                </div>

                <div>
                  <small class="text-muted d-block">
                    Teléfono
                  </small>

                  <strong>
                    ${driver.telefono}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          <!-- FOOTER -->
          <div class="card-footer bg-white border-0 p-4 pt-0">

            <div class="d-flex gap-2">

              <a
                href="/conductores/editar?id=${driver.idConductor}"
                class="btn btn-warning w-100 rounded-3 fw-semibold"
                style="background-color: #4a4865; color: white;"
              >
                <i class="bi bi-pencil-square"></i>
                Editar
              </a>

              <a
                href="/conductores/eliminar?id=${driver.idConductor}"
                class="btn btn-danger w-100 rounded-3 fw-semibold"
                onclick="return confirm('¿Eliminar conductor?')"
              >
                <i class="bi bi-trash-fill"></i>
                Eliminar
              </a>

            </div>

          </div>

        </div>

      </div>
    `;
  });

  html += `
    </div>
  `;

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
async function deleteDriverC(req, res, idDriver) {
  try {
    await deleteDriver(idDriver);
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
  showDrivers,
  showHome,
  AddNewDriver,
  getFormularioConductor,
  getFormularioUpdateHTML,
  updateDriver,
  deleteDriverC,
};
