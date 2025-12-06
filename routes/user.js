const router = require('express').Router();
const User = require('../models/User');

// =======================
// Register
// =======================
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, phone, password, wallet: 0 });

    res.json({
      message: "User registered",
      user
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Login
// =======================
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

// =======================
// Get single user
// =======================
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Get all users
// =======================
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Wallet balance
// =======================
router.get('/wallet/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ wallet: user.wallet });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Add to wallet
// =======================
router.post('/wallet/add', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wallet += Number(amount);
    await user.save();

    res.json({
      message: "Amount added",
      wallet: user.wallet
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Remove from wallet
// =======================
router.post('/wallet/remove', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wallet < amount) {
      return res.status(400).json({ message: "Not enough balance" });
    }

    user.wallet -= Number(amount);
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
