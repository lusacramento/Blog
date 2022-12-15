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

// Rotas Categorias
router.get("/categories", isAdmin, (req, res) => {
  Category.find()
    .sort({ date: "desc" })
    .lean()
    .then((categories) => {
      res.render("admin/categories", { categories: categories });
    })
    .catch((err) => {
      req.flash("errorMessage", "Houve um erro ao listar as categorias!");
    });
});

router.get("/categories/add", isAdmin, (req, res) => {
  res.render("admin/addCategory");
});

router.post("/categories/save", isAdmin, (req, res) => {
  let errors = [];

  if (
    !req.body.name ||
    typeof req.body.name === undefined ||
    req.body.name === null
  )
    errors.push({ message: "Nome inválido!" });

  if (
    !req.body.slug ||
    typeof req.body.slug === undefined ||
    req.body.slug === null
  )
    errors.push({ message: "Slug inválido!" });

  if (errors.length > 0) {
    res.render("admin/addCategory", { errors: errors });
  } else {
    const category = {
      name: req.body.name,
      slug: req.body.slug.trim().toLowerCase(),
    };

    new Category(category)
      .save()
      .then(() => {
        req.flash("successMessage", "Categoria cadastrada com sucesso!");
        res.redirect("/admin/categories");
      })
      .catch((err) => {
        req.flash(
          "errorMessage",
          "Ocorreu um erro ao salar no bando de dados. Tente novamente."
        );
        res.redirect("/admin");
        console.error("Erro ao salvar: ", err);
      });
  }
});
router.get("/categories/edit/:id", isAdmin, (req, res) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) {
      req.flash("errorMessage", "Esta categoria não existe!");
      res.redirect("/admin/categories");
    } else {
      res.render("admin/editCategory", { category: category });
    }
  }).lean();
});

router.post("/categories/alter/:id", isAdmin, (req, res) => {
  const category = {
    _id: req.params.id,
    name: req.body.name,
    slug: req.body.slug,
  };
  Category.findByIdAndUpdate(category._id, category, (err) => {
    if (err) {
      req.flash("errorMessage", "Não foi possível alterar a categoria");
      res.redirect("/admin/categories");
    } else {
      req.flash("successMessage", "Categoria editada com sucesso!");
      res.redirect("/admin/categories");
    }
  });
});

router.post("/categories/remove", isAdmin, (req, res) => {
  Category.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      req.flash("errorMessage", "Não foi possível apagar a categoria");
      res.redirect("/admin/categories");
    } else {
      req.flash("successMessage", "Categoria apagada com sucesso!");
      res.redirect("/admin/categories");
    }
  });
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
