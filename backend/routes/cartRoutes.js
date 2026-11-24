const router = require("express").Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Book = require("../models/Book");

router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart");
  res.json({ data: user.cart });
});

router.post("/:bookId", protect, async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { cart: book._id } });
  res.json({ message: "Book added to cart" });
});

router.delete("/:bookId", protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { cart: req.params.bookId } });
  res.json({ message: "Book removed from cart" });
});

module.exports = router;
