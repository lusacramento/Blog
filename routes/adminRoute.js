// Requisições
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/Category");
const Category = mongoose.model("category");

require("../models/Post");
const Post = mongoose.model("post");

const { isAdmin } = require("../helpers/isAdmin");

//Rota Root
router.get("/", isAdmin, (req, res) => {
  res.render("admin/index");
});

// Rotas Postagens
router.get("/posts", isAdmin, (req, res) => {
  Post.find()
    .lean()
    .populate("category")
    .sort({ date: "desc" })
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    })
    .catch((err) => {
      req.flash(`errMessage", "Hove um erro ao listar as postagens: ${err}`);
      res.redirect("/admin");
    });
});

router.get("/posts/add", isAdmin, (req, res) => {
  Category.find()
    .sort({ name: "asc" })
    .lean()
    .then((categories) =>
      res.render("admin/addPost", { categories: categories })
    )
    .catch((err) => {
      req.flash(err.message, "Houve um erro ao carregar o formulário.");
      res.redirect("/admin");
    });
});

router.post("/posts/save", isAdmin, (req, res) => {
  let errors = [];

  if (req.body.category === "0")
    errors.push({ message: "Categoria inválida. Informe uma categoria" });

  if (errors.length > 0) res.render("admin/addPost", { errors: errors });
  else {
    const post = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category: req.body.category,
      slug: req.body.slug,
    };

    new Post(post)
      .save()
      .then(() => {
        req.flash("successMessage", "Postagem criada com sucesso!");
        res.redirect("/admin/posts");
      })
      .catch((err) => {
        req.flash(
          "errMessage",
          "Ocorreu um erro durante o salvamento da postagem"
        );
        res.redirect("/admin/posts/addPosts");
      });
  }
});

router.get("/posts/edit/:id", isAdmin, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      req.flash("errorMessage", "Esta postagem não existe!");
      res.redirect("/admin/posts");
    } else {
      Category.find()
        .lean()
        .then((categories) => {
          res.render("admin/editPost", { post: post, categories: categories });
        })
        .catch((err) => {
          req.flash("errMessage", "Houve um erro ao buscar as categorias.");
        });
    }
  }).lean();
});

router.post("/posts/alter/:id", isAdmin, (req, res) => {
  const post = {
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    category: req.body.category,
    slug: req.body.slug,
  };
  Post.findByIdAndUpdate(post._id, post, (err) => {
    if (err) {
      req.flash("errorMessage", "Não foi possível alterar a postagem");
      res.redirect("/admin/posts");
    } else {
      req.flash("successMessage", "Postagem editada com sucesso!");
      res.redirect("/admin/posts");
    }
  });
});

router.post("/posts/remove", isAdmin, (req, res) => {
  Post.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      req.flash("errorMessage", "Não foi possível apagar a postagem");
      res.redirect("/admin/posts");
    } else {
      req.flash("successMessage", "Postagem apagada com sucesso!");
      res.redirect("/admin/posts");
    }
  });
});

module.exports = router;
