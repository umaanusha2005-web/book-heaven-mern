const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  address: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
