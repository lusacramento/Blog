const mongoose = require("mongoose");
const URI = "mongodb://127.0.0.1:27017/test";

// Configurando o mongoose
mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;

// Conectando ao banco de dados.
mongoose
  .connect(URI)
  .then(() => {
    console.log("Conectado em localhost!");
  })
  .catch((er) => {
    console.log(`Ocorreu um erro: ${err}`);
  });

// Models
const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  country: {
    type: String,
    require: false,
  },
});

mongoose.model("user", UserSchema);

const User = mongoose.model("user");

new User({
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  age: 26,
  country: "Estados Unidos",
})
  .save()
  .then(() => {
    console.log("usuario criado com sucesso!");
  })
  .catch((er) => {
    "Houve um erro ao registrar!", er;
  });
