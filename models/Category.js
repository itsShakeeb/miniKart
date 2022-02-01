const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  category_name: {
    type: String,
    required: true,
    unique: true,
  },
});

const CategorySchema = mongoose.model("categories", categorySchema);
module.exports = CategorySchema;
