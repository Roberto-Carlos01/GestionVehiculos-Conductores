const http = require("http");
const url = require("url");
const querystring = require("querystring");
const path = require("path");
// pendiente
const fs = require("fs");
const { showDrivers, showHome } = require("./controllers/conductorController");
const { showVehicles } = require("./controllers/vehiculoController");

//variables globales
const PORT = 3002;
const HOST = "localhost";

// =============================================
// CREACIÓN DEL SERVIDOR HTTP
// =============================================

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`📨 ${method} ${pathname}`);

  // ===========================================
  // MOSTRAR PAGINA PRINCIPAL CON CONDUCTORES Y VEHICULOS
  // ===========================================
  if (method === "GET" && pathname === "/") {
    try {
      await showHome(req, res);
      return;
    } catch (error) {
      console.error("Error al renderizar la página:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error interno del servidor");
    }
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
  console.log("   Abre tu navegador en esa dirección");
});
