// database/data.js
const mysql = require("mysql2");

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "app-positive",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos MySQL:", err);
    throw err;
  }
  console.log("Conexión exitosa a la base de datos MySQL.");
});

module.exports = connection;
