const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

router.put('/', auth, async (req, res) => {
  const { fullName, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { fullName, avatar },
    { new: true }
  ).select("-password");

  res.json(user);
});

module.exports = router;
