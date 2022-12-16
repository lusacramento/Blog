// Carregando módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const categoryRestController = require("./controller/rest/CategoryRestController");
const categoryNodeController = require("./controller/node/CategoryNodeController");

const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");

const app = express();
const port = 5000;
const uriMongoDb = "mongodb://127.0.0.1:27017/blogapp";

require("./models/Post");
const Post = mongoose.model("post");

require("./models/Category");
const Category = mongoose.model("category");

const passport = require("passport");
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

// Mongoose
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
  .connect(uriMongoDb)
  .then(() => {
    console.log("Conectado ao Mongodb com sucesso!");
  })
  .catch((err) => {
    console.error(`Erro ao se conectar! ${err}`);
  });

// Rotas

app.use("/api", categoryRestController);
app.use("/admin", categoryNodeController);

app.use("/admin", adminRoute);
app.use("/users", userRoute);

app.use("/post/:slug", (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .populate("category")
    .lean()
    .then((post) => {
      if (post) {
        Category.findById(post.category, (err, category) => {
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
  Category.find()
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
  Category.findOne({ slug: req.params.slug })
    .then((category) => {
      if (category) {
        Post.find({ category: category._id })
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

app.use("/404", (req, res) => {
  res.send("Erro 404");
});

app.use("/", (req, res) => {
  Post.find()
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

// Outros
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
