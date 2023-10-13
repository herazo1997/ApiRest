const express = require("express");
const router = express.Router();
const passport = require("../middlewares/passport-config");

router.get(
  "/admin-section",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Verificar si el usuario tiene el rol de administrador
    if (req.user && req.user.rol.includes("Administrador")) {
      // Usuario autenticado y con rol de administrador
      // Realiza las operaciones correspondientes al apartado de administrador
      res.json({ message: "Bienvenido al apartado de administrador" });
    } else {
      res.status(403).json({ message: "Acceso denegado" });
    }
  }
);

module.exports = router;
