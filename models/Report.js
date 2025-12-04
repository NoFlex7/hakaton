const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['accident', 'construction', 'traffic'],
    required: true
  },
  description: String,
  lat: Number,
  lng: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Report', reportSchema);
