const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const secretKey = "clave-secreta";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
  algorithms: ["HS256"],
};

const strategy = new JwtStrategy(jwtOptions, (payload, done) => {
  if (payload.id_usuario && payload.rol) {
    return done(null,{ id_usuario: payload.id_usuario, rol: payload.rol });
  } else {
    return done(null, false);
  }
});

passport.use(strategy);
module.exports = passport;
