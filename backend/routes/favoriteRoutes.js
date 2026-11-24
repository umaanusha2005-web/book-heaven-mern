const router = require("express").Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Book = require("../models/Book");

router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json({ data: user.favorites });
});

router.post("/:bookId", protect, async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: book._id } });
  res.json({ message: "Added to favorites" });
});

router.delete("/:bookId", protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.params.bookId } });
  res.json({ message: "Removed from favorites" });
});

module.exports = router;
