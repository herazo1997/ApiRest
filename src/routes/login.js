const express = require("express");
const jwt = require("jsonwebtoken");
const connection = require("../database/data");
const passport = require("../middlewares/passport-config");
const router = express.Router();

const secretKey = "clave-secreta";

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Intento de inicio de sesión:", email, password);

  connection.query(
    "SELECT usuarios.*, roles.rol_nombre AS rol, usuarios.usu_nombre AS nombre, usuarios.usu_apellido AS apellido " +
      "FROM usuarios " +
      "INNER JOIN rol_usuario ON usuarios.id_usuario = rol_usuario.id_usuario " +
      "INNER JOIN roles ON rol_usuario.id_rol = roles.id_rol " +
      "WHERE usuarios.usu_email = ? AND usuarios.usu_password = ?",
    [email, password],
    (err, filas) => {
      if (err) {
        console.error("Error al consultar la base de datos:", err);
        return res.status(500).json({ message: "Error en el servidor" });
      }

      if (filas.length === 0) {
        console.error("Credenciales inválidas:", email, password);
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      // Selecciona el primer usuario encontrado.
      const fila = filas[0];
      const usuario = {
        id_usuario: fila.id_usuario,
        nombre: fila.nombre,
        apellido: fila.apellido,
        rol: fila.rol,
      };
      // Obtén los nombres de roles en un arreglo.
      const roles = filas.map((fila) => fila.rol);

      // Agrega los roles al usuario.
      usuario.rol = roles;
      // Crea el token JWT con los datos del usuario.
      const token = jwt.sign(usuario, secretKey, {
        expiresIn: "1h",
      });
      console.log("Token generado:", token);
      console.log("Usuario:", usuario);

      if (fila.usu_token !== null) {
        // Invalidar el token anterior
        connection.query(
          "UPDATE usuarios SET usu_token = NULL WHERE id_usuario = ?",
          [usuario.id_usuario],
          (updateErr) => {
            if (updateErr) {
              console.error("Error al invalidar el token anterior:", updateErr);
              return res.status(500).json({ message: "Error en el servidor" });
            }
            guardarNuevoToken(token, usuario, res);
          }
        );
      } else {
        guardarNuevoToken(token, usuario, res);
      }
    }
  );
});

function guardarNuevoToken(token, usuario, res) {
  connection.query(
    "UPDATE usuarios SET usu_token = ? WHERE id_usuario = ?",
    [token, usuario.id_usuario],
    (updateErr) => {
      if (updateErr) {
        console.error("Error al almacenar el nuevo token:", updateErr);
        return res.status(500).json({ message: "Error en el servidor" });
      }
      res.status(200).json({ token });
    }
  );
}

router.get(
  "/protegido",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      res.status(200).json({ mensaje: "Acceso a la ruta protegida" });
    } else {
      res.status(401).json({ mensaje: "No autorizado" });
    }
  }
);

module.exports = router;
