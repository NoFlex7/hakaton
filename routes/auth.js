const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { fullName, phone, password } = req.body;

  const oldUser = await User.findOne({ phone });
  if (oldUser) return res.status(400).json({ message: "Phone already registered" });

  const hashPass = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    phone,
    password: hashPass
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ message: "Registered", token, user });
});

// Login
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ message: "Logged in", token, user });
});

module.exports = router;
