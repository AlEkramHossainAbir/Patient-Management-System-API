"use strict";
// const passport = require("passport");

// module.exports = passport.authenticate("jwt", { session: false });

module.exports = (req, res, proceed) => {
  let token;
  // console.log("isAuthorized headers", req.headers);
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization;
    if (token.length <= 0) {
      return res.json(401, {
        err: "Format is Authorization: Bearer [token]",
      });
    }

    jwToken.verify(token, function (err, token) {
      if (err) {
        //console.log("verify err", err);
        return res.json(401, {
          err: "Invalid Token!",
        });
      }
      sails.log.info("Token verified. response :" + token.userId);

      req.session.userId = token.userId;

      return proceed();
    });
    // return proceed();
  } else if (req.param("token")) {
    token = req.param("token");
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    // return res.json(401, {err: 'No Authorization header was found'});
    if (req.me) {
      return proceed();
    } else {
      // Otherwise, this request did not come from a logged-in user.
      return res.unauthorized();
    }
  }
};
