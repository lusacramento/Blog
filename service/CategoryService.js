const repository = require("../repository/Repository");
const validation = require("../utils/Validation");

module.exports = {
  findAll: async (req, res, model, isJson) => {
    const result = await repository.findAll(model);
    if (result.docs.length !== 0) {
      isJson
        ? res.json(result.docs)
        : res.render("admin/categories", { categories: result.docs });
    } else {
      if (isJson) {
        res
          .status(404)
          .json({ erro: "404", mensagem: "Não existe categoria cadastrada!" });
      } else {
        res.status(404);
        res.render("admin/categories", { categories: result.docs });
      }
      if (result.err)
        req.flash("errorMessage", "Houve um erro ao listar as categorias!");
    }
  },

  save: async (req, res, model, isJson) => {
    let errors = [];

    if (validation.isEmpty(req.body.name))
      errors.push({ message: "Nome inválido!" });

    if (validation.isEmpty(req.body.slug))
      errors.push({ message: "Slug inválido!" });

    if (errors.length > 0) {
      res.render("admin/addCategory", { errors: errors });
    } else {
      const category = {
        name: req.body.name,
        slug: req.body.slug.trim().toLowerCase(),
      };
      const result = await repository.save(model, category);

      if (result.docs) {
        if (isJson) {
          res.status(201).json(result.docs);
        } else {
          req.flash("successMessage", "Categoria cadastrada com sucesso!");
          res.redirect("/admin/categories");
        }
      }

      if (result.err) {
        if (isJson) {
          res.status(400).json({
            erro: "400",
            mensagem: "Ocorreu um erro ao cadastrar a categoria!",
          });
        } else {
          req.flash("errorMessage", "Houve um erro ao listar as categorias!");
          res
            .status(404)
            .render("admin/categories", { categories: result.docs });
        }
        if (result.err)
          new Category(category).save().then(() => {
            req.flash("successMessage", "Categoria cadastrada com sucesso!");
            res.redirect("/admin");
          });
      }
    }
  },
};
