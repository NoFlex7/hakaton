const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// =======================
// Register (Create)
// =======================
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Fixed: Added input validation
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({ name, phone, password: hashedPass, wallet: 0 });

    // Fixed: Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: "User registered", user: userResponse });
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

    // Fixed: Added input validation
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    // Fixed: Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: "Login success", user: userResponse });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Get all users (Read)
// =======================
router.get('/users', async (req, res) => {
  try {
    // Fixed: Exclude passwords from query
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Get single user (Read)
// =======================
router.get('/user/:userId', async (req, res) => {
  try {
    // Fixed: Exclude password from query
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Update user (Update)
// =======================
router.put('/user/:userId', async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Fixed: Added input validation
    if (!name && !phone) {
      return res.status(400).json({ message: "At least one field is required" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Delete user (Delete)
// =======================
router.delete('/user/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
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
// Add money to wallet
// =======================
router.post('/wallet/add', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Fixed: Added input validation
    if (!userId || amount === undefined) {
      return res.status(400).json({ message: "UserId and amount are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    // Fixed: Use atomic update to prevent race conditions
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { wallet: Number(amount) } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Amount added", wallet: user.wallet });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// Remove money from wallet
// =======================
router.post('/wallet/remove', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Fixed: Added input validation
    if (!userId || amount === undefined) {
      return res.status(400).json({ message: "UserId and amount are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wallet < amount) {
      return res.status(400).json({ message: "Not enough balance" });
    }

    // Fixed: Use atomic update to prevent race conditions
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { wallet: -Number(amount) } },
      { new: true }
    );

    res.json({ message: "Amount removed", wallet: updatedUser.wallet });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;