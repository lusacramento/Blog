import repository from "../repository/Repository.js";
import validation from "../utils/Validation.js";

import mongoose from "mongoose";
require("../models/User");
const User = mongoose.model("user");

import passport from "passport";

module.exports = {
  register: (req, res, isJson) => {
    if (!isJson) {
      res.render("user/register");
    }
  },
  save: async (req, res, isJson) => {
    let errors = [];

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    if (validation.isEmpty(user.name))
      errors.push({ message: "Nome inválido!" });
    if (validation.isEmpty(user.email))
      errors.push({ message: "Email inválido!" });
    if (
      validation.isEmpty(user.password) &&
      validation.isInvalidPasswordLength(user.password)
    )
      errors.push({ message: "Nome inválido!" });

    if (!validation.isEmpty(user.password, req.body.repeatpassword))
      errors.push({ message: "A senha deve conter pelo menos 6 caracteres!" });

    if (!req.body.isaccepted) {
      errors.push({
        message:
          "O usuário deve aceitar o termo de condições de uso deste serviço.",
      });
    }

    if (errors.length > 0) {
      res.render("user/register", { errors: errors });
    } else {
      const query = { email: user.email };
      const result = await repository.findOne(User, query);
      if (result) {
        req.flash("errorMessage", "Email já cadastrado!");
        res.redirect("/users/register");
      } else {
        const result = await validation.getHash(password);
        if (result.err) {
          eq.flash(
            `errorMessage", "Houve um erro ao criar o hash de senha de usuário. ${err}`
          );
          res.redirect("/");
        } else {
          user.password = result.hash;
          const result = await repository.save(User, user);
          if (result.doc) {
            req.flash("successMessage", "Usuário cadastrado com sucesso!"),
              res.redirect("/");
          } else {
            req.flash(
              "errorMessage",
              `Houve um erro ao cadastrar o usuário. Tente novamente!`
            );
            res.redirect("/");
          }
        }
      }
    }
  },

  login: (req, res, isJson) => {
    res.render("user/login");
  },

  auth: (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true,
      successFlash: true,
    })(req, res, next);
  },

  logout: (req, res, isJson) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("successMessage", "Deslogado com sucesso!");
      res.redirect("/");
    });
  },
};
