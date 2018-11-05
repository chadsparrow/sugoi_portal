const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
            console.log(user.username + "login attempt");
            return done(null, false, { message: "User not Authorized" });
          }
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
              return;
            }
            if (isMatch) {
              return done(null, user);
            } else {
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
