const express = require('express');
const User = require('../models/User');
const router = express.Router();

// profile
router.get('/', async (req, res) => {
  const user = await User.findById(req.header("userid")).select("-password");
  res.json(user);
});

// update profile
router.put('/', async (req, res) => {
  const { fullName, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.header("userid"),
    { fullName, avatar },
    { new: true }
  ).select("-password");
  res.json(user);
});

module.exports = router;
