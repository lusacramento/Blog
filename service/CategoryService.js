const repository = require("../repository/Repository");

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
};
