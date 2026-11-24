const router = require("express").Router();
const Book = require("../models/Book");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", async (_req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ data: books });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch books", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ data: book });
  } catch (_error) {
    res.status(400).json({ message: "Invalid book ID" });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, author, price, desc, url = "", language = "English", category = "general" } = req.body;
    if (!title || !author || price === undefined || !desc)
      return res.status(400).json({ message: "Title, author, price and description are required" });
    const book = await Book.create({ title, author, price, desc, url, language, category });
    res.status(201).json({ message: "Book added successfully", data: book });
  } catch (error) {
    res.status(400).json({ message: "Could not add book", error: error.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated", data: book });
  } catch (error) {
    res.status(400).json({ message: "Could not update book", error: error.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (_error) {
    res.status(400).json({ message: "Invalid book ID" });
  }
});

module.exports = router;
