const express = require("express");
const connection = require("../database/data");
const router = express.Router();
const { DateTime } = require("luxon");
const passport = require('../middlewares/passport-config');

router.use(express.json());

// Ruta para obtener todos los elementos
router.get("/sufragantes-todo", passport.authenticate('jwt', { session: false }),(req, res) => {
  const page = parseInt(req.query.page) || 1; // Página por defecto es 1
  const itemsPerPage = 10; // Número de sufragantes por página

  const startIndex = (page - 1) * itemsPerPage;

  connection.query(
    "SELECT COUNT(*) AS total FROM sufragantes",
    (err, countResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        const totalItems = countResult[0].total;

        connection.query(
          "SELECT * FROM sufragantes LIMIT ?, ?",
          [startIndex, itemsPerPage],
          (err, results) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.json({
                currentPage: page,
                totalPages: Math.ceil(totalItems / itemsPerPage),
                totalItems,
                sufragantes: results,
              });
            }
          }
        );
      }
    }
  );
});

// Ruta para obtener un elemento por ID
router.get("/sufragante/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  const obtenerId = req.params.id;
  connection.query(
    "SELECT * FROM sufragantes WHERE id_sufragante = ?",
    [obtenerId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        res.status(404).json({ message: "Elemento no encontrado" });
      } else {
        res.json(results[0]);
      }
    }
  );
});

// Ruta para crear un elemento
router.post("/sufragante-agregar", passport.authenticate('jwt', { session: false }), (req, res) => {
  const { Idusuario, Idcomando, nombres, apellidos, cedula, email, celular } = req.body;
  // Obtencion de hora local
  const horaActual = DateTime.now()
    .setZone("America/Bogota")
    .toFormat("yyyy-MM-dd HH:mm:ss");

  // Primero, verifica si la cédula ya existe en la base de datos
  connection.query(
    "SELECT * FROM sufragantes WHERE sufra_cedula = ?",
    [cedula],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.length > 0) {
        const mensajeError = `Ya existe un sufragante con la cédula: ${cedula}`;
        res.status(400).json({ error: mensajeError });
      } else {
        // Si no existe, realiza la inserción
        connection.query(
          "INSERT INTO sufragantes (id_usuario, id_comando, sufra_nombres, sufra_apellidos, sufra_cedula, sufra_email, sufra_fecha_registro, sufra_celular) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [Idusuario, Idcomando, nombres, apellidos, cedula, email, horaActual, celular],
          (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).json({
                message: "Sufragante agregado exitosamente",
                data: {
                  id: result.insertId,
                  Idusuario, 
                  Idcomando,
                  nombres,
                  apellidos,
                  cedula,
                  email,
                  fecha_registro: horaActual,
                  celular,
                },
              });
            }
          }
        );
      }
    }
  );
});

// Ruta para actualizar un elemento por ID
router.put("/sufragante-actualizar/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  const actualizarId = req.params.id;
  const { nombres, apellidos, cedula, email, fecha_registro, celular } =
    req.body;

  // Primero, obtén la cédula actual antes de la actualización
  connection.query(
    "SELECT sufra_cedula FROM sufragantes WHERE id_sufragante = ?",
    [actualizarId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        res.status(404).json({ message: "Elemento no encontrado" });
      } else {
        const cedulaActual = results[0].sufra_cedula;

        // Si la cédula es diferente, realiza la actualización
        if (cedula !== cedulaActual) {
          connection.query(
            "UPDATE sufragantes SET sufra_nombres = ?, sufra_apellidos = ?, sufra_cedula = ?, sufra_email = ?, sufra_fecha_registro = ?, sufra_celular = ? WHERE id_sufragante = ?",
            [
              nombres,
              apellidos,
              cedula,
              email,
              fecha_registro,
              celular,
              actualizarId,
            ],
            (err, result) => {
              if (err) {
                res.status(500).json({ error: err.message });
              } else if (result.affectedRows === 0) {
                res.status(404).json({ message: "Elemento no encontrado" });
              } else {
                res.json({
                  message: "Sufragante actualizado satisfactoriamente",
                  data: {
                    nombres,
                    apellidos,
                    cedula,
                    email,
                    fecha_registro,
                    celular,
                  },
                });
              }
            }
          );
        } else {
          // Si la cédula es igual, actualiza solo los demás campos
          connection.query(
            "UPDATE sufragantes SET sufra_nombres = ?, sufra_apellidos = ?, sufra_email = ?, sufra_fecha_registro = ?, sufra_celular = ? WHERE id_sufragante = ?",
            [nombres, apellidos, email, fecha_registro, celular, actualizarId],
            (err, result) => {
              if (err) {
                res.status(500).json({ error: err.message });
              } else if (result.affectedRows === 0) {
                res.status(404).json({ message: "Elemento no encontrado" });
              } else {
                res.json({
                  message: "Sufragante actualizado satisfactoriamente",
                  data: {
                    nombres,
                    apellidos,
                    cedula: cedulaActual, // Mantén la cédula original
                    email,
                    fecha_registro,
                    celular,
                  },
                });
              }
            }
          );
        }
      }
    }
  );
});

// Ruta para eliminar un elemento por ID
router.delete("/sufragante-eliminar/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  const eliminarId = req.params.id;
  connection.query(
    "DELETE FROM sufragantes WHERE id_sufragante = ?",
    [eliminarId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Elemento no encontrado" });
      } else {
        res.json({ message: "Sufragante Eliminado Exitosamente" });
      }
    }
  );
});

module.exports = router;
