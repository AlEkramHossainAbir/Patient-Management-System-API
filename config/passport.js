const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
  User.findOne({ id }, function (err, users) {
    cb(err, users);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "emailAddress",
      passwordField: "password",
    },
    function (email, password, cb) {
      User.findOne({ emailAddress: email }, function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false, { message: "Username not found" });
        }
        bcrypt.compare(password, user.password, function (err, res) {
          if (!res) {
            return cb(null, false, { message: "Invalid Password" });
          }
          let userDetails = {
            id: user.id,
            emailAddress: user.emailAddress,
            emailStatus: user.emailStatus,
            fullName: user.fullName,
            role: user.role,
            isSuperAdmin: user.isSuperAdmin,
            hasBillingCard: user.hasBillingCard,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            filename: user.filename,
            filepath: user.filepath,
            emailActivateStatus: user.emailActivateStatus,
          };

          return cb(null, userDetails, { message: "Login Succesful" });
        });
      });
    }
  )
);

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secretissecret",
};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = "secret";
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("jwt_payload", jwt_payload);
    User.findOne({ id: jwt_payload.id }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);
