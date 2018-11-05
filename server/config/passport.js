const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const winston = require("winston");
const LogzioWinstonTransport = require("winston-logzio");
const logzioWinstonTransport = new LogzioWinstonTransport({
  level: "info",
  name: "custom-proofs",
  token: "rmcJlRvMcLYYBkfkKwQlHzvsnDtUtWLO"
});

const logger = winston.createLogger({
  transports: [logzioWinstonTransport]
});

// Load user Model
const User = mongoose.model("users");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        // Match username
        User.findOne({
          username: username
        }).then(user => {
          if (!user) {
            logger.log("info", `${username} login attempt failed`);
            return done(null, false, { message: "User not Authorized" });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              logger.log("info", `${User.username} failed password attempt`);
            }
            if (isMatch) {
              logger.log("info", `${User.username} authorized.`);
              return done(null, user);
            } else {
              logger.log("info", `${User.username} not authorized.`);
              return done(null, false, {
                message: "User Not Authorized"
              });
            }
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
