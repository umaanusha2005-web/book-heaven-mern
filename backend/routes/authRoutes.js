const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, address = "" } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Username, email and password are required" });
    if (username.trim().length < 4)
      return res.status(400).json({ message: "Username must contain at least 4 characters" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must contain at least 6 characters" });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ message: "Username or email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, address });
    res.status(201).json({ message: "Registration successful", user: {
      id: user._id, username: user.username, email: user.email, role: user.role
    }});
  } catch (error) {
    res.status(500).json({ message: "Could not register user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password || "", user.password)))
      return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token, user: {
      id: user._id, username: user.username, email: user.email, role: user.role
    }});
  } catch (error) {
    res.status(500).json({ message: "Could not log in", error: error.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

router.post("/make-admin", protect, async (req, res) => {
  try {
    if (!process.env.ADMIN_CODE || req.body.code !== process.env.ADMIN_CODE)
      return res.status(403).json({ message: "Invalid admin code" });
    const user = await User.findByIdAndUpdate(req.user._id, { role: "admin" }, { new: true }).select("-password");
    res.json({ message: "Admin role enabled", user });
  } catch (error) {
    res.status(500).json({ message: "Could not update role", error: error.message });
  }
});

module.exports = router;
