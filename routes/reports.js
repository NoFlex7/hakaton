const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// YANGI REPORT QO‘SHISH
router.post('/', async (req, res) => {
  try {
    const io = req.app.get('io');

    const report = await Report.create({
      type: req.body.type,
      description: req.body.description,
      lat: req.body.lat,
      lng: req.body.lng,
      userId: req.body.userId
    });

    io.emit('newReport', report);

    res.status(201).json({
      message: "Report yuborildi",
      report
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// BARCHA REPORTLAR
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REPORTNI TASDIQLASH
router.put('/:id/approve', async (req, res) => {
  try {
    const io = req.app.get('io');

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Report topilmadi" });

    io.emit('reportApproved', updated);

    res.json({
      message: "Report tasdiqlandi",
      report: updated
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REPORTNI RAD QILISH
router.put('/:id/reject', async (req, res) => {
  try {
    const io = req.app.get('io');

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Report topilmadi" });

    io.emit('reportRejected', updated);

    res.json({
      message: "Report rad qilindi",
      report: updated
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
