import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema({
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

export const CategoryModel = mongoose.model("category", schema);
