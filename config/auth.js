import { Strategy } from "passport-local";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Model
import { UserModel } from "../models/User.js";

const auth = (passport) => {
  passport.use(
    new Strategy(
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

export default auth;
