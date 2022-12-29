import express from "express";
const router = express.Router();
import mongoose from "mongoose";
require("../models/User");
const User = mongoose.model("user");

const passport = require("passport");

const bcrypt = require("bcryptjs");

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post("/register", (req, res) => {
  let errors = [];

  if (
    !req.body.name ||
    typeof req.body.name === undefined ||
    req.body.name === null
  ) {
    errors.push({ message: "Nome inválido!" });
  }

  if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    errors.push({ message: "Email inválido!" });
  }

  if (
    !req.body.password ||
    typeof req.body.password === undefined ||
    req.body.password === null ||
    req.body.password.length < 6
  ) {
    errors.push({ message: "A senha deve conter o mínimo de 6 caracteres!" });
  }

  if (req.body.password !== req.body.repeatpassword) {
    errors.push({
      message: "A senha e a repetição de senha devem ser iguais!",
    });
  }

  if (!req.body.isaccepted) {
    errors.push({
      message:
        "O usuário deve aceitar o termo de condições de uso deste serviço.",
    });
  }

  if (errors.length > 0) {
    res.render("user/register", { errors: errors });
  } else {
    User.findOne({ email: req.body.email })
      .then((email) => {
        if (email) {
          req.flash("errorMessage", "Email já cadastrado!");
          res.redirect("/users/register");
        } else {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          const saltRounds = 10;

          bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) {
                req.flash(
                  `errorMessage", "Houve um erro ao criar o hash de senha de usuário. ${err}`
                );
                res.redirect("/");
              } else {
                user.password = hash;
                user
                  .save()
                  .then(() => {
                    req.flash(
                      "successMessage",
                      "Usuário cadastrado com sucesso!"
                    ),
                      res.redirect("/");
                  })
                  .catch((err) => {
                    req.flash(
                      "errorMessage",
                      `Houve um erro ao cadastrar o usuário. Tente novamente!`
                    );
                    res.redirect("/");
                  });
              }
            });
          });
        }
      })
      .catch((err) => {
        res.flash("errorMessage", `Houve um erro ao validar o email. ${err}`);
      });
  }
});

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post("/auth", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("successMessage", "Deslogado com sucesso!");
    res.redirect("/");
  });
});

export default router;
