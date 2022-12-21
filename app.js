// Carregando módulos
import express from "express";
const handlebars = require("express-handlebars");
import path from "path";

import mongoose from "mongoose";
import "./config/db";
import { CategoryModel } from "./models/Category";
import { PostModel } from "./models/Post";

import session from "express-session";
import flash from "connect-flash";

import categoryRestController from "./controller/rest/CategoryRestController";
import postNodeController from "./controller/node/PostNodeController";
import userNodeController from "./controller/node/UserNodeController";

import categoryNodeController from "./controller/node/CategoryNodeController";
import postRestController from "./controller/rest/PostRestController";
// const userRestController from "./controller/rest/UserRestController";

const app = express();
const port = process.env.APP_PORT;

import passport from "passport";
require("./config/auth")(passport);

// Configurações
// BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

// Session
app.use(
  session({
    name: "cursodenode",
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("successMessage");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.user = req.user || null;
  next();
});

// Rotas
// Node Routes
app.use("/admin/categories", categoryNodeController);
app.use("/admin/posts", postNodeController);
app.use("/users", userNodeController);

// Rest Routes
app.use("/api/categories", categoryRestController);
app.use("/api/posts", postRestController);

// app.use("/users", userRoute);

app.use("/post/:slug", (req, res) => {
  PostModel.findOne({ slug: req.params.slug })
    .populate("category")
    .lean()
    .then((post) => {
      if (post) {
        CategoryModel.findById(post.category, (err, category) => {
          if (category) {
            res.render("post/index", { post: post });
          } else {
            req.flash(
              `Houve um erro interno. Categoria não encontrada: ${err}`
            );
          }
        }).lean();
      } else {
        req.flash("errorMessage", "Esta postagem não existe");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("errorMessage", "Houve um ero interno.");
      res.redirect("/");
    });
});

app.use("/categories", (req, res) => {
  CategoryModel.find()
    .lean()
    .then((categories) => {
      res.render("category/index", { categories: categories });
    })
    .catch((err) => {
      req.flash(
        "errorMensage",
        "Houve um erro interno ao listar as categorias"
      );
    });
});

app.use("/category/:slug", (req, res) => {
  CategoryModel.findOne({ slug: req.params.slug })
    .then((category) => {
      if (category) {
        PostModel.find({ category: category._id })
          .lean()
          .then((posts) => {
            res.render("category/posts", { posts: posts });
          })
          .catch((err) => {
            req.flash(
              `errorMessage", "Houve um erro ao listar as postagens! ${err}`
            );
            res.redirect("/");
          });
      } else {
        req.flash("errorMessage", "Esta categoria não existe!");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("errorMessage", `Houve um erro ao buscar a categoria: ${err}`);
      res.redirect("/");
    });
});

app.get("/", (req, res) => {
  console.log("//");
  PostModel.find()
    .lean()
    .populate("category")
    .sort({ date: "desc" })
    .then((posts) => {
      res.render("index", { posts: posts });
    })
    .catch((err) => {
      req.flash("errMessage", "Houve um erro interno");
      res.redirect("/404");
    });
});

app.get("*", (req, res) => {
  res
    .status(404)
    .send("<h1>Erro 404</h1><p>A página solicitada não foi encontrada!</p>");
});
// Outros
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
