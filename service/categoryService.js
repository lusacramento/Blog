import repository from "../repository/Repository.js";
import { Validation } from "../utils/Validation.js";
import mongoose from "mongoose";

import Responses from "./Responses.js";

import { CategoryModel } from "../models/Category.js";

let result = {};
let data = {};

export const CategoryService = {
  findAll: async (req, res) => {
    data = {};
    result = await repository.findAll(CategoryModel);

    if (result.doc) {
      if (result.doc.length > 0) {
        data.status = 200;
        data.doc = result.doc;
        data.message = { success: "" };
        data.model = "categories";
        data.isRedirect = false;
        data.isSuccess = true;
        data.success = { message: "" };

        Responses(req, res, data);
      } else {
        data.status = 404;
        data.doc = result.doc;
        data.isSuccess = false;
        data.success = { message: "" };
        data.isSuccess = true;
        data.model = "categories";

        Responses(req, res, data);
      }
    }

    if (result.err) {
      data.status = 500;
      data.doc = { status: data.status, message: result.err };
      data.err = `Houve um erro ao listar as categorias! ${result.err.message}`;
    }
  },

  findById: async (req, res) => {
    data = {};
    // Testing if Id is a ObjectId valid.
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (isIdValid) {
      result = await repository.findById(CategoryModel, req.params.id);
      if (result.doc) {
        // Se existe documento
        data.status = 200;
        data.doc = result.doc;
        data.model = "editCategory";
        data.isRedirect = false;
        data.isSuccess = true;
        data.success = { message: "Categoria localizada com sucesso!" };

        Responses(req, res, data);
      } else {
        // se não existe documento
        data.status = 404;
        data.doc = result.doc;
        data.err = {
          name: "Not Found Exception",
          message: "Esta categoria não está cadastrada.",
          code: 0,
          status: 404,
        };
        Responses(req, res, data);
      }

      if (result.err) {
        data.status = 500;
        data.doc = { status: data.status, message: result.err };
        data.err = {
          name: "Internal Exception",
          message: "Ocorreu um erro ao tentar localizar a categoria.",
          code: 0,
          status: 500,
        };
      }
    } else {
      data.status = 404;
      data.err = {
        name: "Not Found Exception",
        message: "O valor do Id não é do tipo ObjectId.",
        code: 0,
        status: 404,
      };
      Responses(req, res, data);
    }
  },

  save: async (req, res) => {
    data = {};
    const errors = [];
    if (await repository.existsByName(CategoryModel, req.body.name)) {
      console.log(
        "result: ",
        repository.existsByName(CategoryModel, req.body.name)
      );
    } else {
      const category = {
        name: req.body.name,
        slug: req.body.slug.trim().toLowerCase(),
      };

      if (Validation.isEmpty(category.name)) {
        errors.push({ message: "Campo nome é de preenchimento obrigatório!" });
      }
      if (Validation.isEmpty(category.slug)) {
        errors.push({ message: "Campo slug é de preenchimento obrigatório!" });
      }

      if (errors.length > 0) {
        data.status = 404;
        data.doc = category;
        data.isSuccess = false;
        data.model = "addCategory";
        data.err = errors;
        data.object = new Object();
        data.object[data.model] = data.doc;
        data.object.errors = errors;

        Responses(req, res, data);
      } else {
        result = await repository.save(CategoryModel, category);
        if (result.doc) {
          data.status = 201;
          data.doc = result.doc;
          data.isSuccess = true;
          data.model = "addCategory";
          data.isSuccess = true;

          data.success = {
            message: `
          Categoria ${req.body.name} cadastrada com sucesso!
          `,
          };
          data.isRedirect = true;
          data.redirect = "/api/categories";

          Responses(req, res, data);
        }
      }

      if (result.err) {
        data.status = 500;
        data.doc = { status: data.status, message: result.err };
        data.isSuccess = false;
        data.err = {
          message: `Houve um erro ao cadastrar a categoria! ${result.err.message}`,
        };
        data.model = "addCategory";

        Responses(req, res, data);
      }
    }
  },

  alter: async (req, res) => {
    data = {};
    const category = {
      _id: req.params.id,
      name: req.body.name,
      slug: req.body.slug.trim().toLowerCase(),
    };

    result = await repository.findByIdAndUpdate(CategoryModel, category);

    if (result.doc) {
      data.status = 200;
      data.doc = result.doc;
      data.isSuccess = true;
      data.success = {
        message: `
      Categoria ${req.body.name} alterada com sucesso!
      `,
      };
      data.model = "categories";
      data.isRedirect = true;
      data.redirect = "/api/categories";

      Responses(req, res, data);
    } else {
      data.status = 500;
      data.doc = { status: data.status, message: result.err };
      data.err = `Houve um erro ao cadastrar a categoria! ${result.err.message}`;
      data.model = "addCategory";
      data.isRedirect = true;
      data.redirect = "/api/categories/add";

      Responses(req, res, data);
    }
  },

  remove: async (req, res) => {
    data = {};
    const result = await repository.findByIdAndRemove(
      CategoryModel,
      req.body._id
    );

    if (result.err) {
    } else {
      data.status = 204;
      data.doc = result.doc;
      data.isSuccess = true;
      data.success = {
        message: `
      Categoria apagada com sucesso!
      `,
      };
      data.model = "categories";
      data.isRedirect = true;
      data.redirect = "/api/categories";
      data.succe;

      Responses(req, res, data);
    }
  },

  //   // Validating data
  //   if (validation.isEmpty(req.body.name))
  //     errors.push({ message: "Nome inválido!" });

  //   if (validation.isEmpty(req.body.slug))
  //     errors.push({ message: "Slug inválido!" });

  //   // Create object
  //   const category = {
  //     name: req.body.name,
  //     slug: req.body.slug.trim().toLowerCase(),
  //   };

  //   if (errors.length > 0) {
  //     res.render("admin/addCategory", { errors: errors, category: category });
  //   } else {
  //     // Trying save data
  //     const result = await repository.save(CategoryModel, category);

  //     // Checking is exist docs
  //     if (result.docs) {
  //       if (isJson) {
  //         res.status(201).json(result.docs);
  //       } else {
  //         req.flash("successMessage", "Categoria cadastrada com sucesso!");
  //         res.redirect("/admin/categories");
  //       }
  //     }

  //     // Checking is exist error
  //     if (result.err) {
  //       if (isJson) {
  //         res.status(400).json({
  //           erro: "400",
  //           mensagem: "Ocorreu um erro ao cadastrar a categoria!",
  //         });
  //       } else {
  //         req.flash(
  //           "errorMessage",
  //           `Houve um erro ao inserir dados! ${result.err.message}`
  //         );
  //         res.redirect("/admin");
  //       }
  //     }
  //   }
  // },

  // alter: async (req, res, isJson) => {
  //   const category = {
  //     _id: req.params.id,
  //     name: req.body.name,
  //     slug: req.body.slug,
  //   };
  //   const result = await repository.findByIdAndUpdate(CategoryModel, category);
  //   if (result.doc) {
  //     if (isJson) {
  //       res.status(200).json(result.doc);
  //     } else {
  //       req.flash("successMessage", "Categoria alterada com sucesso!");
  //       res.redirect("/admin/categories");
  //     }
  //   } else {
  //     if (isJson) {
  //       res.status(404).json({
  //         erro: "404",
  //         mensagem: `Não existe categoria com o id! ${req.params.id}`,
  //       });
  //     } else {
  //       req.flash(
  //         "errorMessage",
  //         `Esta categoria não existe! ${result.err.message}`
  //       );
  //       res.redirect("/admin/categories");
  //     }
  //   }

  //   // Checking is exist error
  //   if (result.err) {
  //     if (isJson) {
  //       res.status(400).json({
  //         erro: "400",
  //         mensagem: "Ocorreu um erro ao alterar a categoria!",
  //       });
  //     } else {
  //       req.flash(
  //         "errorMessage",
  //         `Houve um erro ao alterar a categoria! ${result.err.message}`
  //       );
  //       res.redirect("/admin");
  //     }
  //   }
  // },
};
