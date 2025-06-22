const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Add attendance record
router.post('/', async (req, res) => {
  const { studentId, status } = req.body;

  try {
    const attendance = new Attendance({ studentId, status });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error saving attendance', error });
  }
});

// Get attendance records for a student
router.get('/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const records = await Attendance.find({ studentId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
});

module.exports = router;
