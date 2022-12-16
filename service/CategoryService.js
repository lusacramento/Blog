const repository = require("../repository/Repository");
const validation = require("../utils/Validation");
const mongoose = require("mongoose");

module.exports = {
  findAll: async (req, res, model, isJson) => {
    const result = await repository.findAll(model);
    // Checking is exist docs
    if (result.docs) {
      if (result.docs.length !== 0) {
        isJson
          ? res.json(result.docs)
          : res.render("admin/categories", { categories: result.docs });
      } else {
        if (isJson) {
          res.status(404).json({
            erro: "404",
            mensagem: "Não existe categoria cadastrada!",
          });
        } else {
          res.status(404);
          res.render("admin/categories", { categories: result.docs });
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
          `Houve um erro ao listar as categorias! ${result.err.message}`
        );
        res.redirect("/admin");
      }
  },

  findById: async (req, res, model, isJson) => {
    // Testing if Id is a ObjectId valid.
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    let result = {};
    if (isIdValid) {
      result = await repository.findById(model, req.params.id);
    }

    // Checking is exist a doc
    if (result.doc) {
      isJson
        ? res.json(result.doc)
        : res.render("admin/editCategory", { category: result.doc });
    } else {
      if (isJson) {
        res.status(404).json({
          erro: "404",
          mensagem: `Não existe categoria com o id! ${req.params.id}`,
        });
      } else {
        res.status(404);
        req.flash("errorMessage", "Esta categoria não existe!");
        res.redirect("/admin/categories");
      }
    }
    // Checking is exist error
    if (result.err)
      if (isJson) {
        res.status(404).json({ error: 404, message: result.err.message });
      } else {
        req.flash(
          "errorMessage",
          `Esta categoria não existe! ${result.err.message}`
        );
        res.redirect("/admin/categories");
      }
  },

  save: async (req, res, model, isJson) => {
    let errors = [];

    // Validating data
    if (validation.isEmpty(req.body.name))
      errors.push({ message: "Nome inválido!" });

    if (validation.isEmpty(req.body.slug))
      errors.push({ message: "Slug inválido!" });

    // Create object
    const category = {
      name: req.body.name,
      slug: req.body.slug.trim().toLowerCase(),
    };

    if (errors.length > 0) {
      res.render("admin/addCategory", { errors: errors, category: category });
    } else {
      // Trying save data
      const result = await repository.save(model, category);

      // Checking is exist docs
      if (result.docs) {
        if (isJson) {
          res.status(201).json(result.docs);
        } else {
          req.flash("successMessage", "Categoria cadastrada com sucesso!");
          res.redirect("/admin/categories");
        }
      }

      // Checking is exist error
      if (result.err) {
        if (isJson) {
          res.status(400).json({
            erro: "400",
            mensagem: "Ocorreu um erro ao cadastrar a categoria!",
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
};
