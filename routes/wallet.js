const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// get wallet
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("wallet");
  res.json(user.wallet);
});

// topup
router.post("/topup", auth, async (req, res) => {
  const { amount, description } = req.body;
  const user = await User.findById(req.userId);

  user.wallet.balance += amount;
  user.wallet.transactions.push({ type: "topup", amount, description });

  await user.save();
  res.json(user.wallet);
});

// withdraw
router.post("/withdraw", auth, async (req, res) => {
  const { amount, description } = req.body;
  const user = await User.findById(req.userId);

  if (user.wallet.balance < amount) {
    return res.status(400).json({ message: "Not enough balance" });
  }

  user.wallet.balance -= amount;
  user.wallet.transactions.push({ type: "withdraw", amount, description });

  await user.save();
  res.json(user.wallet);
});

module.exports = router;
