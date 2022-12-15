const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    default: "sem categoria",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model("category", Category);
