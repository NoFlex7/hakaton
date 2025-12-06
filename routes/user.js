const router = require('express').Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { name, phone, password } = req.body;

  const exists = await User.findOne({ phone });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, phone, password });

  res.json({
    message: "User registered",
    user
  });
});

// Login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone, password });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    message: "Login success",
    user
  });
});

// Wallet pul qo‘shish
router.post('/wallet/add', async (req, res) => {
  const { userId, amount } = req.body;

  const user = await User.findById(userId);
  user.wallet += amount;
  await user.save();

  res.json({
    message: "Amount added",
    wallet: user.wallet
  });
});

// Walletdan pul yechish
router.post('/wallet/remove', async (req, res) => {
  const { userId, amount } = req.body;

  const user = await User.findById(userId);
  if (user.wallet < amount) {
    return res.status(400).json({ message: "Not enough balance" });
  }

  user.wallet -= amount;
  await user.save();

  res.json({
    message: "Amount removed",
    wallet: user.wallet
  });
});

module.exports = router;
