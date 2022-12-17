// Requests
const repository = require("../repository/Repository");
const validation = require("../utils/Validation");
const mongoose = require("mongoose");

require("../models/Post");
const Post = mongoose.model("post");

require("../models/Category");
const Category = mongoose.model("category");

module.exports = {
  findAll: async (req, res, isJson) => {
    const populate = "category";

    const result = await repository.findAll(Post, populate);
    // Checking is exist docs
    if (result.docs) {
      if (result.docs.length !== 0) {
        isJson
          ? res.json(result.docs)
          : res.render("admin/posts", { posts: result.docs });
      } else {
        if (isJson) {
          res.status(404).json({
            erro: "404",
            mensagem: "Não existe postagem cadastrada!",
          });
        } else {
          res.status(404);
          res.render("admin/posts", { posts: result.docs });
        }
      }
    }
    // Checking is exist error
    if (result.err)
      if (isJson) {
        res.status(500).json({ error: 500, message: result.err.message });
      } else {
        req.flash(
          "errorMessage",
          `Houve um erro ao listar as postagens! ${result.err.message}`
        );
        res.redirect("/admin");
      }
  },

  findById: async (req, res, isJson) => {
    // Testing if Id is a ObjectId valid.
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    let result = {};
    const populate = "category";
    if (isIdValid) {
      result = await repository.findById(Post, req.params.id, populate);
    }

    // Checking is exist a doc
    if (result.doc) {
      if (isJson) {
        res.json(result.doc);
      } else {
        const categories = await repository.findAll(Category);

        res.render("admin/editPost", {
          post: result.doc,
          categories: categories.docs,
        });
      }
    } else {
      if (isJson) {
        res.status(404).json({
          erro: "404",
          mensagem: `Não existe postagem com o id! ${req.params.id}`,
        });
      } else {
        res.status(404);
        req.flash("errorMessage", "Esta postagem não existe!");
        res.redirect("/admin/posts");
      }
    }
    // Checking is exist error
    if (result.err)
      if (isJson) {
        res.status(404).json({ error: 404, message: result.err.message });
      } else {
        req.flash(
          "errorMessage",
          `Esta postagem não existe! ${result.err.message}`
        );
        res.redirect("/admin/posts");
      }
  },

  add: async (req, res) => {
    const result = await repository.findAll(Category);
    if (result.docs) {
      res.render("admin/addPost", { categories: result.docs });
    }
  },

  save: async (req, res, isJson) => {
    let errors = [];

    // Create object
    const post = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category: req.body.category,
      slug: req.body.slug,
    };

    // Validating data
    if (validation.isEmpty(post.title))
      errors.push({ message: "Título inválido!" });

    if (validation.isEmpty(post.description))
      errors.push({ message: "Descrição inválida!" });

    if (validation.isEmpty(post.content))
      errors.push({ message: "Conteúdo inválido!" });

    if (validation.isEmpty(post.category))
      errors.push({ message: "Categoria inválida!" });

    if (validation.isEmpty(post.slug))
      errors.push({ message: "Slug inválido!" });

    if (errors.length > 0) {
      res.render("admin/addPost", { errors: errors, post: post });
    } else {
      // Trying save data
      const result = await repository.save(Post, post);

      // Checking is exist docs
      if (result.docs) {
        if (isJson) {
          res.status(201).json(result.docs);
        } else {
          req.flash("successMessage", "Postagem cadastrada com sucesso!");
          res.redirect("/admin/posts");
        }
      }

      // Checking is exist error
      if (result.err) {
        if (isJson) {
          res.status(400).json({
            erro: "400",
            mensagem: "Ocorreu um erro ao cadastrar a postagem!",
          });
        } else {
          req.flash(
            "errorMessage",
            `Houve um erro ao inserir dados! ${result.err.message}`
          );
          res.redirect("/admin");
        }
      }
    }
  },

  alter: async (req, res, isJson) => {
    const post = {
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category: req.body.category,
      slug: req.body.slug,
    };

    // Validating data
    if (validation.isEmpty(post.title))
      errors.push({ message: "Título inválido!" });

    if (validation.isEmpty(post.description))
      errors.push({ message: "Descrição inválida!" });

    if (validation.isEmpty(post.content))
      errors.push({ message: "Conteúdo inválido!" });

    if (validation.isEmpty(post.category))
      errors.push({ message: "Categoria inválida!" });

    if (validation.isEmpty(post.slug))
      errors.push({ message: "Slug inválido!" });

    const result = await repository.findByIdAndUpdate(Post, post);
    if (result.doc) {
      if (isJson) {
        res.status(200).json(result.doc);
      } else {
        req.flash("successMessage", "Postagem alterada com sucesso!");
        res.redirect("/admin/posts");
      }
    } else {
      if (isJson) {
        res.status(404).json({
          erro: "404",
          mensagem: `Não existe postagem com o id! ${req.params.id}`,
        });
      } else {
        req.flash(
          "errorMessage",
          `Esta postagem não existe! ${result.err.message}`
        );
        res.redirect("/admin/posts");
      }
    }

    // Checking is exist error
    if (result.err) {
      if (isJson) {
        res.status(400).json({
          erro: "400",
          mensagem: "Ocorreu um erro ao alterar a postagem!",
        });
      } else {
        req.flash(
          "errorMessage",
          `Houve um erro ao alterar a postagem! ${result.err.message}`
        );
        res.redirect("/admin");
      }
    }
  },

  remove: async (req, res, isJson) => {
    const result = await repository.findByIdAndRemove(Post, req.body.id);

    if (result.err) {
      if (isJson) {
        res.status(400).json(`Erro ao apagar a postagem com id ${req.body.id}`);
      } else {
        req.flash("errorMessage", "Não foi possível apagar a postagem");
        res.redirect("/admin/posts");
      }
    } else {
      if (isJson) {
        res.status(204).json("Postagem apagada com sucesso!");
      } else {
        req.flash("successMessage", "Postagem apagada com sucesso!");
        res.redirect("/admin/posts");
      }
    }
  },
};
