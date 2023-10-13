const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routeLogin = require("./routes/login");
const routeSufragantes = require("./routes/sufragantes");
const routeAdmin = require("./routes/administrador");
const routeUsuario = require("./routes/usuario");
const passport = require("./middlewares/passport-config");

const app = express();

const hostname = "localhost";
const port = 2000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.listen(port, () => {
  console.log(`Servidor iniciado http://${hostname}:${port}/`);
});

app.use("/", routeLogin, routeSufragantes, routeAdmin, routeUsuario);
