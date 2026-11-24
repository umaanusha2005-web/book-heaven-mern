const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  url: { type: String, default: "" },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  desc: { type: String, required: true },
  language: { type: String, default: "English" },
  category: { type: String, default: "general" }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
