const mysql = require("mysql2/promise");

//conexion a la base de datos
const conection = mysql.createPool({
  host: 3002,
  user: "root", // ← usuario de MySQL (normalmente root)
  password: "", // ← contraseña de MySQL
  database: "bdlicencia", // ← Nombre exacto la base de datos
  waitForConnections: true,
  maxIdle: 10, // recomendado (mysql2)
  idleTimeout: 60000, // 60 segundos (recomendado)
  queueLimit: 0, // 0 = sin límite de cola
  connectionLimit: 10, // Máximo de conexiones simultáneas
  queueLimit: 0,
});

// =============================================
// PRUEBA DE CONEXIÓN A LA BASE DE DATOS
// =============================================
async function testConnection() {
  try {
    const [rows] = await conection.query("SELECT 1 AS conexion_exitosa");
    console.log("✅ Conexión a MySQL exitosa!", rows);

    // Opcional: ver si la tabla existe
    const [tables] = await conection.query('SHOW TABLES LIKE "conductor"');
    if (tables.length > 0) {
      console.log('✅ La tabla "conductor" existe en la base de datos');
    } else {
      console.log('⚠️  La tabla "conductor" NO existe. Créala primero.');
    }
  } catch (error) {
    console.error("❌ Error al conectar con MySQL:");
    console.error(error.message);
    console.error("\nPosibles causas:");
    console.error("- XAMPP no está encendido");
    console.error("- MySQL no está corriendo");
    console.error('- La base de datos "bdcontacto" no existe');
    console.error("- Usuario o contraseña incorrectos");
    process.exit(1); // Detener la app si no hay conexión
  }
}

// Ejecutamos la prueba
testConnection();

module.exports = conection;
