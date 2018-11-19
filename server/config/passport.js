const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const logger = require("../helpers/logs");

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
            logger.warn("Invalid Login Attempt");
            return done(null, false, { message: "User not Authorized" });
          }
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              logger.error(err);
              return;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Invalid user/password, try again!"
              });
            }
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    logger.info(`${user.username} logged in.`);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
};
