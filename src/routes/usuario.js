const express = require("express");
const router = express.Router();
const passport = require("../middlewares/passport-config");

router.get(
  "/usuario-section",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    
    if (req.user && req.user.rol.includes("Usuario")) {

      res.json({ message: "Bienvenido al apartado de los Usuarios" });
    } else {
      res.status(403).json({ message: "Acceso denegado" });
    }
  }
);

module.exports = router;
