const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student')

// Add attendance record
router.post("/", async (req, res) => {
  const { studentID, lesson, status } = req.body;

  try {
    const student = await Student.findOne({ studentID });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendance = new Attendance({
      studentId: student._id,
      lesson,
      status,
      date: new Date(),
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance saved", attendance });
  } catch (err) {
    res.status(500).json({ message: "Error saving attendance", error: err.message });
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
