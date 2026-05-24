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

// ============================================
// LISTA DE VEHICULOS
// ============================================

function generarListaVehiculos(vehiculos) {
  if (vehiculos.length === 0) {
    return `

      <div class="alert alert-light border shadow-sm rounded-4 text-center p-4">

        <h4 class="mb-2">
          🚗 No hay vehículos registrados
        </h4>

        <p class="text-muted mb-0">
          Registra un nuevo vehículo para comenzar.
        </p>

      </div>
    `;
  }

  let html = `
    <div class="row g-4">
  `;

  vehiculos.forEach((vehiculo) => {
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
              background: linear-gradient(to right, #111827, #374151);
            "
          >

            <div class="d-flex justify-content-between align-items-center">

              <div>

                <h4 class="mb-1 fw-bold">
                  🚘 ${vehiculo.marca}
                </h4>

                <h6 class="mb-0 opacity-75">
                  ${vehiculo.modelo}
                </h6>

              </div>

              <div
                class="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center"
                style="
                  width: 60px;
                  height: 60px;
                  font-size: 1.5rem;
                "
              >
                <i class="bi bi-car-front-fill"></i>
              </div>

            </div>

          </div>

          <!-- BODY -->
          <div class="card-body p-4">

            <!-- PROPIETARIO -->
            <div class="mb-4">

              <small class="text-muted d-block mb-1">
                👤 Propietario
              </small>

              <h5 class="fw-bold mb-1">
                ${vehiculo.nombres} ${vehiculo.apellidos}
              </h5>

              <span class="badge bg-dark-subtle text-dark px-3 py-2 rounded-pill">
                🪪 CI: ${vehiculo.ci}
              </span>

            </div>

            <!-- DATOS -->
            <div class="d-flex flex-column gap-3">

              <div class="d-flex justify-content-between">

                <span class="text-muted">
                  🔖 Placa
                </span>

                <strong>
                  ${vehiculo.placa}
                </strong>

              </div>

              <div class="d-flex justify-content-between">

                <span class="text-muted">
                  📅 Año
                </span>

                <strong>
                  ${vehiculo.anio}
                </strong>

              </div>

              <div class="d-flex justify-content-between">

                <span class="text-muted">
                  🎨 Color
                </span>

                <strong>
                  ${vehiculo.color}
                </strong>

              </div>

            </div>

          </div>

          <!-- FOOTER -->
          <div class="card-footer bg-white border-0 p-4 pt-0">

            <div class="d-flex gap-2">

              <a
                href="/vehiculos/editar?placa=${vehiculo.placa}"
                class="btn btn-warning w-100 rounded-3 fw-semibold" style="background-color: #654865; color: white;"
              >
                <i class="bi bi-pencil-square"></i>
                Editar
              </a>

              <a
                href="/vehiculos/eliminar?placa=${vehiculo.placa}"
                class="btn btn-danger w-100 rounded-3 fw-semibold"
                onclick="return confirm('¿Eliminar vehículo?')"
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
