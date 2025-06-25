const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student')

// Add attendance record
// Bulk OR Single attendance insert
router.post("/", async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : [req.body]; // Normalize to array

  try {
    const results = [];

    for (const record of payload) {
      const { studentID, lesson, status, date } = record;
      const student = await Student.findOne({ studentID });

      if (!student) {
        results.push({ studentID, error: "Student not found" });
        continue;
      }

      const attendance = new Attendance({
        studentId: student._id,
        lesson,
        status,
        date: date ? new Date(date) : new Date(),
      });

      await attendance.save();
      results.push({ studentID, status: "Saved", lesson });
    }

    res.status(201).json({ message: "Batch insert complete", results });
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
