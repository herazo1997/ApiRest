// const passport = require("passport");
// const passportJWT = require("passport-jwt");
// const ExtractJwt = passportJWT.ExtractJwt;
// const JwtStrategy = passportJWT.Strategy;
// const secretKey = "clave-secreta"; // Reemplaza con tu clave secreta

// // Configura la estrategia de autenticación JWT de Passport.js
// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: secretKey,
//   algorithms: ['HS256']
// };

// const strategy = new JwtStrategy(jwtOptions, (payload, done) => {
//   if (payload.id_usuario) {

//     return done(null, payload.id_usuario);
//   } else {
//     return done(null, false);
//   }
// });

// passport.use(strategy);

// const verificarToken = passport.authenticate("jwt", { session: false });

// module.exports = verificarToken;
