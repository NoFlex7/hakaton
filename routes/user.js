const router = require('express').Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, phone, password });

    res.json({
      message: "User registered",
      user
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone, password });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Login success",
      user
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Wallet balance olish
router.get('/wallet/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      wallet: user.wallet
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Walletga pul qo‘shish
router.post('/wallet/add', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);

    user.wallet += amount;
    await user.save();

    res.json({
      message: "Amount added",
      wallet: user.wallet
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Walletdan pul yechish
router.post('/wallet/remove', async (req, res) => {
  try {
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
