const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Model
require("../models/User");
const User = mongoose.model("user");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
          if (!user) {
            // done(dadosDaContaAutenticada, OcorreuAutenticacaoComSucesso, menssagem)
            return done(null, false, { message: "Esta conta não existe!" });
          }

          bcrypt.compare(password, user.password, (err, success) => {
            if (success) {
              return done(null, user, { message: "Login com sucesso!" });
            } else {
              return done(null, false, { message: "Senha incorreta!" });
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
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
