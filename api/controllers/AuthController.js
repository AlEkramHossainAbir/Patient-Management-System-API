const passport = require("passport");

module.exports = {
  test: function (req, res) {
    return res.json("Check");
  },
  login: function (req, res) {
    passport.authenticate("local", function (err, user, info) {
      if (err || !user) {
        return res.send({
          message: info.message,
          user,
        });
      }

      req.logIn(user, async function (err) {
        if (err) {
          res.send(err);
        }

        var token = jwToken.issue({
          userId: user.id,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        });

        req.session.token = token;
        req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
        req.session.userId = user.id;
        req.session.justNow = true;

        const currentUser = await User.findOne({ id: user.id });

        if (currentUser.deleted) {
          info.message = "user deleted";
        }

        if (!currentUser.emailActivateStatus) {
          info.message = "email verification necessary";
        }

        return res.json({
          message: info.message,
          token: token,
          user: currentUser,
        });
      });
    })(req, res);
  },

  logout: function (req, res) {
    req.logout();
    res.redirect("/");
  },

  accountVerification: async function (req, res) {
    let decode = req.body.hasOwnProperty("id") ? req.body.id : undefined;
    var obj = Buffer.from(decode, "base64").toString();
    var jobject = JSON.parse(obj);

    let record = await User.findOne({
      emailAddress: jobject.email,
      emailVerificationCode: jobject.emailVerificationCode,
    });

    if (!record) {
      return { userInfo: "Varification url expired or invalid url!" };
    }

    var message = "here you are to activate ";

    if (record.emailActivateStatus === true) {
      message = "Your Account is already Activated";
    }

    // Store the user's new id in their session.
    if (record.emailActivateStatus === false) {
      message = "Your Account is Activated";
      let updatedUser = await User.update({ emailAddress: jobject.email }).set({
        emailActivateStatus: true,
        emailStatus: "confirmed",
      });
    }

    return res.json({
      userInfo: message,
    });
  },

  verifyToken: function (req, res) {
    res.json("token verified");
  },

  default: function (req, res) {
    res.json("Welcome to CatchTheReview Api Panel");
  },
};
